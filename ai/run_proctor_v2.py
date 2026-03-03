import cv2 # type: ignore
import numpy as np
import tensorflow as tf # type: ignore
import os
import sys
import time
import traceback
from dotenv import load_dotenv # type: ignore
from typing import List, cast

# Ensure local directory is in path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from face_detector import get_face_detector, find_faces # type: ignore
    from face_landmarks import get_landmark_model, detect_marks # type: ignore
    from head_pose_estimation import get_head_pose # type: ignore
    from mouth_opening_detector import get_mouth_distances, is_mouth_open # type: ignore
    from person_and_phone import get_yolo_model, detect_objects # type: ignore
    from face_spoofing import get_spoofing_classifier, detect_spoofing # type: ignore
except ImportError as e:
    print(f"Error: Missing local AI modules. Ensure all .py files are in the same directory. {e}")
    sys.exit(1)

# Set logging level for TensorFlow to suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
load_dotenv()

def main():
    print("Initializing Upgraded AI Proctoring System...")
    
    print("Loading Models (TensorFlow, DNN, YOLO)...")
    
    # 1. Initialize Models
    try:
        prototxt = os.getenv('FACE_DETECTOR_PROTOTXT')
        model_file = os.getenv('FACE_DETECTOR_MODEL')
        landmark_path = os.getenv('LANDMARK_MODEL')
        yolo_path = os.getenv('YOLO_WEIGHTS')
        yolo_classes = os.getenv('YOLO_CLASSES')
        spoof_path = os.getenv('SPOOF_MODEL')

        if (prototxt is None or model_file is None or landmark_path is None or 
            yolo_path is None or yolo_classes is None or spoof_path is None):
            print("Error: One or more environment variables are missing in .env")
            return

        print("- Loading Face Detector...")
        face_model = get_face_detector(
            configFile=prototxt,
            modelFile=model_file
        )
        print("- Loading Landmark Model...")
        landmark_model = get_landmark_model(landmark_path)
        print("- Loading YOLO Model...")
        yolo_model = get_yolo_model(yolo_path)
        print("- Loading Spoofing Classifier...")
        try:
            spoof_clf = get_spoofing_classifier(spoof_path)
        except Exception as e:
            print(f"  Warning: Could not load spoofing model ({e}). Spoofing detection disabled.")
            spoof_clf = None
        
        # casting path to str to satisfy static analyzer
        path_to_classes = str(yolo_classes)
        with open(path_to_classes, "r") as f:
            class_names: List[str] = [c.strip() for c in f.readlines()]
    except Exception as e:
        print(f"Error loading models: {e}")
        traceback.print_exc()
        return

    # 2. State Variables
    integrity_score = 100.0
    sample_number: int = 1
    spoof_count: int = 0
    spoof_measures: np.ndarray = np.zeros(sample_number, dtype=float)
    
    # Mouth calibration state
    calibrated: bool = False
    calibration_frames: int = 0
    d_outer_avg: List[float] = [0.0] * 5
    d_inner_avg: List[float] = [0.0] * 3

    # 3. Start Camera
    cap: cv2.VideoCapture = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    print("\nStarting Live Feed...")
    print("Step 1: Calibration - Keep your mouth closed and look at the camera.")
    
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        display_frame = frame.copy()
        h, w = frame.shape[:2]

        # A. Calibration Logic
        if not calibrated:
            cv2.putText(display_frame, f"Calibrating... {calibration_frames}/30", (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            faces = find_faces(frame, face_model)
            if faces:
                marks = detect_marks(frame, landmark_model, faces[0])
                do, di = get_mouth_distances(marks)
                # Ensure the analyzer sees these as list access
                outer_list = cast(List[float], d_outer_avg)
                inner_list = cast(List[float], d_inner_avg)
                for i in range(5):
                    outer_list[i] += float(do[i])
                for i in range(3):
                    inner_list[i] += float(di[i])
                calibration_frames += 1  # type: ignore[operator]
                if calibration_frames >= 30:
                    d_outer_avg = [x / 30.0 for x in outer_list]
                    d_inner_avg = [x / 30.0 for x in inner_list]
                    calibrated = True
                    print("Calibration Complete.")
            cv2.imshow('Upgraded Proctoring System', display_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break
            continue

        # B. Full Logic Post-Calibration
        
        # 1. Person & Phone Detection
        # YOLO detect_objects returns (boxes, scores, classes, nums)
        res = detect_objects(frame, yolo_model, class_names)
        classes = res[2]
        nums = res[3]
        
        person_count: int = 0
        phone_detected: bool = False
        
        num_objects = int(nums[0])
        for i in range(num_objects):
            cls_id = int(classes[0][i])
            if cls_id == 0: 
                person_count += 1
            if cls_id == 67: 
                phone_detected = True

        if person_count > 1:
            integrity_score -= 1.0
        if phone_detected:
            integrity_score -= 5.0

        # 2. Face & Landmark Detection
        faces = find_faces(frame, face_model)
        
        for face in faces:
            fx, fy, fx1, fy1 = map(int, face)
            marks = detect_marks(frame, landmark_model, face)
            
            # Head Pose
            ang1, ang2, p1, p2, _, _ = get_head_pose(frame, marks)
            head_pose = "Straight"
            if ang1 >= 48: head_pose = "Down"
            elif ang1 <= -48: head_pose = "Up"
            if ang2 >= 48: head_pose = "Right"
            elif ang2 <= -48: head_pose = "Left"
            
            if head_pose != "Straight":
                integrity_score -= 0.1
            
            # Mouth Status
            mouth_open = is_mouth_open(marks, d_outer_avg, d_inner_avg)
            if mouth_open:
                integrity_score -= 0.5
            
            # Spoofing (only on first face for efficiency)
            is_spoof = False
            if spoof_clf is not None:
                spoof_results = detect_spoofing(frame, [face], spoof_clf, spoof_measures, spoof_count, sample_number)
                is_spoof = bool(spoof_results[0]) if spoof_results else False
                if is_spoof:
                    integrity_score -= 2.0
            spoof_count += 1

            # Visual Overlays
            # Face box
            box_color = (0, 255, 0) if not is_spoof else (0, 0, 255)
            cv2.rectangle(display_frame, (fx, fy), (fx1, fy1), box_color, 2)
            
            # Pose lines
            cv2.line(display_frame, p1, p2, (255, 255, 0), 2) # Nose direction
            
            # Alerts on screen
            if mouth_open:
                cv2.putText(display_frame, "Talking Detected", (fx, fy-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
            if is_spoof:
                cv2.putText(display_frame, "SPOOF DETECTED", (fx, fy-30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Head pose labels
            if ang1 >= 48: cv2.putText(display_frame, 'Down', (fx1+10, fy+20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            elif ang1 <= -48: cv2.putText(display_frame, 'Up', (fx1+10, fy+20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            if ang2 >= 48: cv2.putText(display_frame, 'Right', (fx1+10, fy+45), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            elif ang2 <= -48: cv2.putText(display_frame, 'Left', (fx1+10, fy+45), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)

        if len(faces) > 1:
            integrity_score -= 1.0
        elif len(faces) == 0:
            integrity_score -= 0.5

        # Integrity Score Overlay
        integrity_score = max(0, min(100, integrity_score))
        score_color = (0, 255, 0) if integrity_score >= 70 else (0, 165, 255) if integrity_score >= 40 else (0, 0, 255)
        cv2.putText(display_frame, f"Integrity: {integrity_score:.1f}%", (w-250, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, score_color, 2)

        # Global Alerts
        y_offset = 30
        if person_count > 1:
            cv2.putText(display_frame, f"ALERT: {person_count} Persons Found", (10, h-30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        if phone_detected:
            cv2.putText(display_frame, "ALERT: Phone Detected", (10, h-60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        
        cv2.putText(display_frame, f"Faces: {len(faces)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        cv2.imshow('Upgraded Proctoring System', display_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
