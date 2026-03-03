import sys
import time
import json
import base64
import cv2
import numpy as np
import os
from dotenv import load_dotenv

# Ensure the root directory is in the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_detector import get_face_detector, find_faces
from face_landmarks import get_landmark_model, detect_marks
from head_pose_estimation import get_head_pose
from mouth_opening_detector import get_mouth_distances, is_mouth_open
from person_and_phone import get_yolo_model, detect_objects
from face_spoofing import get_spoofing_classifier, detect_spoofing

load_dotenv()

class ProctorState:
    def __init__(self):
        self.integrity_score = 100.0
        self.calibrated = False
        self.calibration_frames = 0
        self.d_outer_avg = [0.0] * 5
        self.d_inner_avg = [0.0] * 3
        self.spoof_measures = np.zeros(1, dtype=float)
        self.spoof_count = 0
        self.person_count = 0
        self.phone_detected = False
        self.frame_idx = 0

    def reset(self):
        self.integrity_score = 100.0
        self.calibrated = False
        self.calibration_frames = 0

def main():
    # Initialize models
    prototxt = os.getenv('FACE_DETECTOR_PROTOTXT')
    model_file = os.getenv('FACE_DETECTOR_MODEL')
    landmark_path = os.getenv('LANDMARK_MODEL')
    yolo_path = os.getenv('YOLO_WEIGHTS')
    yolo_classes = os.getenv('YOLO_CLASSES')
    spoof_path = os.getenv('SPOOF_MODEL')

    face_model = get_face_detector(configFile=prototxt, modelFile=model_file)
    landmark_model = get_landmark_model(landmark_path)
    yolo_model = get_yolo_model(yolo_path)

    try:
        spoof_clf = get_spoofing_classifier(spoof_path)
    except:
        spoof_clf = None

    with open(yolo_classes, "r") as f:
        class_names = [c.strip() for c in f.readlines()]

    state = ProctorState()

    # Signal ready to Node.js
    print(json.dumps({"type": "ready"}), flush=True)

    for line in sys.stdin:
        start_time = time.time()
        try:
            payload = json.loads(line)
            if payload.get("type") == "reset":
                state.reset()
                continue
            
            frame_data = payload.get("image")
            if not frame_data: continue

            # Decode
            _, encoded = frame_data.split(",", 1)
            nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None: continue

            # AI Logic
            alerts = []
            state.frame_idx += 1
            
            t_start = time.time()
            faces = find_faces(frame, face_model)
            t_face = time.time() - t_start
            
            mouth_open = False
            head_pose = "Straight"
            is_spoof = False
            t_marks, t_pose, t_mouth, t_spoof, t_yolo = 0, 0, 0, 0, 0

            if len(faces) == 1:
                t1 = time.time()
                marks = detect_marks(frame, landmark_model, faces[0])
                t_marks = time.time() - t1
                
                t2 = time.time()
                ang1, ang2, _, _, _, _ = get_head_pose(frame, marks)
                t_pose = time.time() - t2
                
                if ang1 >= 48: head_pose = "Down"
                elif ang1 <= -48: head_pose = "Up"
                elif ang2 >= 48: head_pose = "Right"
                elif ang2 <= -48: head_pose = "Left"
                
                if head_pose != "Straight":
                    alerts.append(f"Looking {head_pose}")
                    state.integrity_score -= 0.1

                if not state.calibrated:
                    do, di = get_mouth_distances(marks)
                    for i in range(5): state.d_outer_avg[i] += do[i]
                    for i in range(3): state.d_inner_avg[i] += di[i]
                    state.calibration_frames += 1
                    if state.calibration_frames >= 30:
                        state.d_outer_avg = [x / 30.0 for x in state.d_outer_avg]
                        state.d_inner_avg = [x / 30.0 for x in state.d_inner_avg]
                        state.calibrated = True
                else:
                    t3 = time.time()
                    mouth_open = is_mouth_open(marks, state.d_outer_avg, state.d_inner_avg)
                    t_mouth = time.time() - t3
                    if mouth_open:
                        alerts.append("Talking Detected")
                        state.integrity_score -= 0.5

                if spoof_clf:
                    t4 = time.time()
                    spoof_results = detect_spoofing(frame, [faces[0]], spoof_clf, state.spoof_measures, state.spoof_count, 1)
                    t_spoof = time.time() - t4
                    is_spoof = bool(spoof_results[0]) if spoof_results else False
                    state.spoof_count += 1
                    if is_spoof:
                        alerts.append("SPOOF DETECTED")
                        state.integrity_score -= 2.0

            elif len(faces) > 1:
                alerts.append("Multiple faces detected")
                state.integrity_score -= 1.0
            else:
                alerts.append("No face detected")
                state.integrity_score -= 0.5

            # YOLO - run every 2nd frame or if suspicious
            if state.frame_idx % 2 == 0 or len(faces) != 1:
                t5 = time.time()
                res = detect_objects(frame, yolo_model, class_names)
                t_yolo = time.time() - t5
                
                classes, nums = res[2], res[3]
                state.person_count = 0
                state.phone_detected = False
                for i in range(int(nums[0])):
                    cls_id = int(classes[0][i])
                    if cls_id == 0: state.person_count += 1
                    if cls_id == 67: state.phone_detected = True

            if state.person_count > 1: 
                alerts.append(f"Multiple persons detected ({state.person_count})")
                state.integrity_score -= 1.0
            if state.phone_detected: 
                alerts.append("Unauthorized device (Phone)")
                state.integrity_score -= 5.0

            state.integrity_score = max(0, min(100, state.integrity_score))
            status = "SECURE"
            if state.integrity_score < 70: status = "FLAGGED"
            if state.integrity_score < 40: status = "CRITICAL"

            processing_time = time.time() - start_time
            print(json.dumps({
                "type": "result",
                "face_count": len(faces),
                "person_count": state.person_count,
                "phone_detected": state.phone_detected,
                "head_pose": head_pose,
                "mouth_open": mouth_open,
                "is_spoof": is_spoof,
                "integrity_score": round(state.integrity_score, 2),
                "status": status,
                "alerts": list(set(alerts)),
                "calibrated": state.calibrated,
                "timing_ms": {
                    "face": round(t_face * 1000, 1),
                    "marks": round(t_marks * 1000, 1),
                    "pose": round(t_pose * 1000, 1),
                    "mouth": round(t_mouth * 1000, 1),
                    "spoof": round(t_spoof * 1000, 1),
                    "yolo": round(t_yolo * 1000, 1),
                    "total": round(processing_time * 1000, 1)
                }
            }), flush=True)

        except Exception as e:
            print(json.dumps({"type": "error", "message": str(e)}), flush=True)

if __name__ == "__main__":
    main()
