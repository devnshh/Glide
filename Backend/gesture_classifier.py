import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = "models/gesture_model.pkl"
LABEL_ENCODER_PATH = "models/label_encoder.pkl"

class GestureClassifier:
    def __init__(self):
        self.model = None
        self.labels = []
        self.load_model()

    def train(self, data, labels):
        """
        Train the model with new data.
        data: List of landmark lists (each 63 floats).
        labels: List of string labels.
        """
        if not data or not labels:
            print("No data to train on.")
            return

        augmented_data = []
        augmented_labels = []

        print("Augmenting data...")
        for i, landmarks in enumerate(data):

            norm_lm = self.normalize_landmarks(landmarks)
            augmented_data.append(norm_lm)
            augmented_labels.append(labels[i])

            lm_np = np.array(norm_lm).reshape(-1, 3)

            if np.isnan(lm_np).any(): continue

            noise = np.random.normal(0, 0.005, lm_np.shape)
            augmented_data.append((lm_np + noise).flatten().tolist())
            augmented_labels.append(labels[i])

            for angle in [-10, 10]:
                theta = np.radians(angle)
                c, s = np.cos(theta), np.sin(theta)
                R = np.array(((c, -s, 0), (s, c, 0), (0, 0, 1)))

                rotated = np.dot(lm_np, R.T)
                augmented_data.append(rotated.flatten().tolist())
                augmented_labels.append(labels[i])

        print(f"Training on {len(augmented_data)} samples (Original: {len(data)})")

        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(augmented_data, augmented_labels)
        self.save_model()
        print("Model trained and saved.")

    def normalize_landmarks(self, landmarks):
        """
        Normalize landmarks:
        1. Relative to wrist (Translation Invariant)
        2. Scaled by max distance (Scale Invariance)
        """
        lm_np = np.array(landmarks).reshape(-1, 3)
        wrist = lm_np[0]
        relative_lm = lm_np - wrist

        max_dist = np.max(np.linalg.norm(relative_lm, axis=1))

        if max_dist > 1e-6:
            relative_lm /= max_dist

        return relative_lm.flatten().tolist()

    def predict(self, landmarks):
        """
        Predict gesture from landmarks.
        landmarks: Single list of 63 floats.
        Returns: strict label or None
        """
        if not self.model:
            return None, 0.0

        norm_landmarks = self.normalize_landmarks(landmarks)

        prediction = self.model.predict([norm_landmarks])[0]
        probabilities = self.model.predict_proba([norm_landmarks])[0]
        confidence = max(probabilities)

        return prediction, confidence

    def save_model(self):
        if not os.path.exists("models"):
            os.makedirs("models")
        joblib.dump(self.model, MODEL_PATH)

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            print("Model loaded.")
        else:
            print("No model found. Please train first.")
            self.model = None
