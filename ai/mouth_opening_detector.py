# -*- coding: utf-8 -*-
import cv2
from face_detector import get_face_detector, find_faces
from face_landmarks import get_landmark_model, detect_marks, draw_marks

outer_points = [[49, 59], [50, 58], [51, 57], [52, 56], [53, 55]]
inner_points = [[61, 67], [62, 66], [63, 65]]

def get_mouth_distances(shape):
    d_outer = [0]*5
    d_inner = [0]*3
    for i, (p1, p2) in enumerate(outer_points):
        d_outer[i] = shape[p2][1] - shape[p1][1]
    for i, (p1, p2) in enumerate(inner_points):
        d_inner[i] = shape[p2][1] - shape[p1][1]
    return d_outer, d_inner

def is_mouth_open(shape, d_outer_avg, d_inner_avg):
    cnt_outer = 0
    cnt_inner = 0
    for i, (p1, p2) in enumerate(outer_points):
        if d_outer_avg[i] + 3 < shape[p2][1] - shape[p1][1]:
            cnt_outer += 1 
    for i, (p1, p2) in enumerate(inner_points):
        if d_inner_avg[i] + 2 <  shape[p2][1] - shape[p1][1]:
            cnt_inner += 1
    return cnt_outer > 3 and cnt_inner > 2

if __name__ == "__main__":
    face_model = get_face_detector()
    landmark_model = get_landmark_model()
    cap = cv2.VideoCapture(0)
    d_outer_avg = [0]*5
    d_inner_avg = [0]*3
    
    print("Calibrating mouth... stay still with mouth closed.")
    # Simple calibration loop
    for _ in range(30):
        ret, img = cap.read()
        faces = find_faces(img, face_model)
        if faces:
            marks = detect_marks(img, landmark_model, faces[0])
            do, di = get_mouth_distances(marks)
            for i in range(5): d_outer_avg[i] += do[i]
            for i in range(3): d_inner_avg[i] += di[i]
    
    d_outer_avg = [x / 30 for x in d_outer_avg]
    d_inner_avg = [x / 30 for x in d_inner_avg]
    print("Calibration done.")

    while True:
        ret, img = cap.read()
        if not ret: break
        faces = find_faces(img, face_model)
        for face in faces:
            marks = detect_marks(img, landmark_model, face)
            if is_mouth_open(marks, d_outer_avg, d_inner_avg):
                cv2.putText(img, 'Mouth open', (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        cv2.imshow("Mouth Detection", img)
        if cv2.waitKey(1) & 0xFF == ord('q'): break
    cap.release(); cv2.destroyAllWindows()
