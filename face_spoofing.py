import numpy as np
import cv2
import joblib
from face_detector import get_face_detector, find_faces

import sys
import sklearn.ensemble
import sklearn.tree

def calc_hist(img):
    histogram = [0] * 3
    for j in range(3):
        histr = cv2.calcHist([img], [j], None, [256], [0, 256])
        if histr.max() != 0:
            histr *= 255.0 / histr.max()
        histogram[j] = histr
    return np.array(histogram)

def get_spoofing_classifier(model_path='models/face_spoofing.pkl'):
    # Monkey patch for compatibility with older scikit-learn versions
    if 'sklearn.ensemble.forest' not in sys.modules:
        sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble
    if 'sklearn.tree.tree' not in sys.modules:
        sys.modules['sklearn.tree.tree'] = sklearn.tree
    if 'sklearn.externals.joblib' not in sys.modules:
        sys.modules['sklearn.externals.joblib'] = joblib
    return joblib.load(model_path)

def detect_spoofing(img, faces, clf, measures, count, sample_number=1):
    spoof_results = []
    for x, y, x1, y1 in faces:
        roi = img[y:y1, x:x1]
        if roi.size == 0:
            continue
            
        img_ycrcb = cv2.cvtColor(roi, cv2.COLOR_BGR2YCR_CB)
        img_luv = cv2.cvtColor(roi, cv2.COLOR_BGR2LUV)

        ycrcb_hist = calc_hist(img_ycrcb)
        luv_hist = calc_hist(img_luv)

        feature_vector = np.append(ycrcb_hist.ravel(), luv_hist.ravel())
        feature_vector = feature_vector.reshape(1, len(feature_vector))

        prediction = clf.predict_proba(feature_vector)
        prob = prediction[0][1]

        measures[count % sample_number] = prob
        
        is_spoof = False
        if 0 not in measures:
            if np.mean(measures) >= 0.7:
                is_spoof = True
        
        spoof_results.append(is_spoof)
    return spoof_results

if __name__ == "__main__":
    face_model = get_face_detector()
    clf = get_spoofing_classifier()
    cap = cv2.VideoCapture(0)
    sample_number = 1
    count = 0
    measures = np.zeros(sample_number, dtype=float)

    while True:
        ret, img = cap.read()
        if not ret: break
        faces = find_faces(img, face_model)
        results = detect_spoofing(img, faces, clf, measures, count, sample_number)
        
        for i, (x, y, x1, y1) in enumerate(faces):
            label = "Real" if not results[i] else "Spoof"
            color = (0, 255, 0) if not results[i] else (0, 0, 255)
            cv2.rectangle(img, (x, y), (x1, y1), color, 2)
            cv2.putText(img, label, (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
            
        count += 1
        cv2.imshow('Face Spoofing Detection', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
