import cv2
import mediapipe as mp
import numpy as np

class GestureDetector:
    def __init__(self, static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7, min_tracking_confidence=0.5):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.mp_draw = mp.solutions.drawing_utils

    def process_frame(self, frame):
        """
        Process a single frame to detect hands.
        Returns:
            processed_frame: The frame with landmarks drawn (if any).
            landmarks_list: A list of normalized landmarks (x, y, z) for the detected hand.
            world_landmarks_list: List of world landmarks.
        """

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.hands.process(rgb_frame)

        landmarks_data = []

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:

                self.mp_draw.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.extend([lm.x, lm.y, lm.z])

                landmarks_data.append(landmarks)

        return frame, landmarks_data, results

    @staticmethod
    def count_fingers(landmarks):
        """
        Estimates the number of extended fingers based on landmarks.
        landmarks: Normalized landmark list [x1, y1, z1, x2, y2, z2, ...]
        """
        points = []
        for i in range(0, len(landmarks), 3):
            points.append({'x': landmarks[i], 'y': landmarks[i+1]})

        if not points:
            return 0

        fingers = []
        
        is_upright = points[0]['y'] > points[9]['y']
        
        tips = [8, 12, 16, 20]
        pips = [6, 10, 14, 18]

        for tip, pip in zip(tips, pips):
            if is_upright:
                fingers.append(points[tip]['y'] < points[pip]['y'])
            else:
                fingers.append(points[tip]['y'] > points[pip]['y'])

        
        def dist(p1, p2):
            return ((p1['x'] - p2['x'])**2 + (p1['y'] - p2['y'])**2)**0.5

        thumb_extended = dist(points[4], points[17]) > dist(points[3], points[17])
        fingers.append(thumb_extended)
        
        return sum(fingers)

    def close(self):
        self.hands.close()
