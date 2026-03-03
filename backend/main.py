import asyncio
import json
import base64
import cv2
import numpy as np
import os
import sys
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure the root directory is in the path so local modules can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_detector import get_face_detector, find_faces
from face_landmarks import get_landmark_model, detect_marks
from head_pose_estimation import get_head_pose
from mouth_opening_detector import get_mouth_distances, is_mouth_open
from person_and_phone import get_yolo_model, detect_objects
from face_spoofing import get_spoofing_classifier, detect_spoofing

load_dotenv()

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models once at startup
print("Initializing AI models...")
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
except Exception as e:
    print(f"Warning: Could not load spoofing model ({e}). Spoofing detection disabled.")
    spoof_clf = None

with open(yolo_classes, "r") as f:
    class_names = [c.strip() for c in f.readlines()]

@app.get("/")
async def root():
    return {"message": "AEGIS AI Proctoring Logic is Online"}

@app.websocket("/ws/proctor")
async def websocket_proctor(websocket: WebSocket):
    await websocket.accept()
    print("Agent connected for proctoring...")
    
    # Per-session state
    integrity_score = 100
    calibrated = False
    calibration_frames = 0
    d_outer_avg = [0.0] * 5
    d_inner_avg = [0.0] * 3
    
    # Spoofing state
    sample_number = 1
    spoof_count = 0
    spoof_measures = np.zeros(sample_number, dtype=float)

    try:
        while True:
            # Receive base64 frame from frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            frame_data = payload.get("image")
            
            if not frame_data:
                continue

            # Decode base64 image
            try:
                header, encoded = frame_data.split(",", 1)
                nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception as e:
                print(f"Decode error: {e}")
                continue

            if frame is None:
                continue

            # --- AI PROCESSING ---
            alerts = []
            status = "SECURE"
            
            # 1. Face Detection
            faces = find_faces(frame, face_model)
            
            mouth_open = False
            head_pose = "Straight"
            is_spoof = False
            
            if len(faces) == 1:
                # 2. Landmarks & Head Pose
                marks = detect_marks(frame, landmark_model, faces[0])
                ang1, ang2, p1, p2, x1, x2 = get_head_pose(frame, marks)
                
                if ang1 >= 48: head_pose = "Down"
                elif ang1 <= -48: head_pose = "Up"
                elif ang2 >= 48: head_pose = "Right"
                elif ang2 <= -48: head_pose = "Left"
                
                if head_pose != "Straight":
                    alerts.append(f"Looking {head_pose}")
                    integrity_score -= 0.1 # Small deduction per frame

                # 3. Mouth Detection (Calibration first)
                if not calibrated:
                    do, di = get_mouth_distances(marks)
                    for i in range(5): d_outer_avg[i] += do[i]
                    for i in range(3): d_inner_avg[i] += di[i]
                    calibration_frames += 1
                    if calibration_frames >= 30:
                        d_outer_avg = [x / 30.0 for x in d_outer_avg]
                        d_inner_avg = [x / 30.0 for x in d_inner_avg]
                        calibrated = True
                else:
                    mouth_open = is_mouth_open(marks, d_outer_avg, d_inner_avg)
                    if mouth_open:
                        alerts.append("Talking Detected")
                        integrity_score -= 0.5

                # 4. Spoofing Detection
                if spoof_clf:
                    spoof_results = detect_spoofing(frame, [faces[0]], spoof_clf, spoof_measures, spoof_count, sample_number)
                    is_spoof = bool(spoof_results[0]) if spoof_results else False
                    spoof_count += 1
                    if is_spoof:
                        alerts.append("SPOOF DETECTED")
                        integrity_score -= 2.0

            elif len(faces) > 1:
                alerts.append("Multiple faces detected")
                integrity_score -= 1.0
            else:
                alerts.append("No face detected")
                integrity_score -= 0.5

            # 5. Person and Phone Detection (YOLO)
            res = detect_objects(frame, yolo_model, class_names)
            classes = res[2]
            nums = res[3]
            person_count = 0
            phone_detected = False
            
            num_objects = int(nums[0])
            for i in range(num_objects):
                cls_id = int(classes[0][i])
                if cls_id == 0: person_count += 1
                if cls_id == 67: phone_detected = True

            if person_count > 1:
                alerts.append(f"Multiple persons detected ({person_count})")
                integrity_score -= 1.0
            
            if phone_detected:
                alerts.append("Unauthorized device (Phone)")
                integrity_score -= 5.0

            # Clamp integrity score
            integrity_score = max(0, min(100, integrity_score))
            
            if integrity_score < 70:
                status = "FLAGGED"
            if integrity_score < 40:
                status = "CRITICAL"

            # Create proctoring results
            results = {
                "face_count": len(faces),
                "person_count": person_count,
                "phone_detected": phone_detected,
                "head_pose": head_pose,
                "mouth_open": mouth_open,
                "is_spoof": is_spoof,
                "integrity_score": round(integrity_score, 2),
                "status": status,
                "alerts": list(set(alerts)), # Filter duplicates
                "calibrated": calibrated
            }

            # Send results back to frontend
            await websocket.send_text(json.dumps(results))

    except WebSocketDisconnect:
        print("Agent disconnected")
    except Exception as e:
        print(f"Critical Backend Error: {e}")
        await asyncio.sleep(1)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
