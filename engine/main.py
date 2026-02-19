import cv2
import threading
import time
import asyncio
import uuid
import queue
import queue
import numpy as np
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from gesture_detector import GestureDetector
from gesture_classifier import GestureClassifier
from mouse_controller import MouseController

from desktop_controller import desktop_controller
from action_mapper import ACTION_MAP, execute_action
from websocket_manager import manager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

message_queue = queue.Queue()

class SystemState:
    def __init__(self):
        self.camera_running = False
        self.detection_active = True
        self.last_action_time = {}
        self.cursor_mode = False
        self.last_notification_time = 0
        self.prediction_cooldown = 0.5

        self.total_detections = 0
        self.actions_executed = 0

        self.training_mode = False
        self.training_gesture_id = None
        self.training_data_buffer = []
        self.training_sample_target = 0
        self.last_capture_time = 0

        self.confidence_threshold = 0.75
        self.confidence_threshold = 0.75
        self.speed_factor = 1.0
        self.latest_frame = None
        self.action_lock = threading.Lock()

        self.gestures = self.load_gestures()
        self.last_known_landmarks = None
        self.latest_frame_raw = None
        self.latest_landmarks = None  # Shared landmark data from camera loop for detection loop
        self.draw_lock = threading.Lock()

    def load_gestures(self):
        import json
        import os
        if os.path.exists("gestures.json"):
            try:
                with open("gestures.json", "r") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading gestures: {e}")

        return [
             {"id": "1", "name": "Swipe Left", "emoji": "👈", "action": "previous_track", "sampleCount": 0},
             {"id": "2", "name": "Swipe Right", "emoji": "👉", "action": "next_track", "sampleCount": 0},
             {"id": "3", "name": "Thumbs Up", "emoji": "👍", "action": "play_pause", "sampleCount": 0},
        ]

    def save_gestures(self):
        import json
        try:
            with open("gestures.json", "w") as f:
                json.dump(self.gestures, f, indent=2)
            print("Gestures saved to gestures.json")
        except Exception as e:
            print(f"Error saving gestures: {e}")
        self.confidence_threshold = 0.75
        self.latest_frame = None

state = SystemState()
detector = GestureDetector()
classifier = GestureClassifier()
mouse_controller = MouseController()

# Lightweight MediaPipe instance for real-time landmark drawing in camera loop
import mediapipe as mp
_draw_hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)
_draw_mp_draw = mp.solutions.drawing_utils
_draw_mp_hands = mp.solutions.hands

def camera_loop():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap.set(cv2.CAP_PROP_FPS, 30)

    state.camera_running = True
    print("Camera started.")

    fps_start_time = time.time()
    frame_count = 0
    fps = 0

    while state.camera_running:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.1)
            continue

        frame = cv2.flip(frame, 1)

        # Run MediaPipe once — used for both drawing AND detection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb.flags.writeable = False
        draw_results = _draw_hands.process(rgb)
        rgb.flags.writeable = True

        # Draw landmarks on the frame for streaming
        if draw_results.multi_hand_landmarks:
            for hand_lm in draw_results.multi_hand_landmarks:
                _draw_mp_draw.draw_landmarks(
                    frame, hand_lm, _draw_mp_hands.HAND_CONNECTIONS
                )

            # Share extracted landmarks with detection thread (normalized x,y,z list)
            first_hand = draw_results.multi_hand_landmarks[0]
            landmarks = []
            for lm in first_hand.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
            with state.draw_lock:
                state.latest_landmarks = landmarks
        else:
            with state.draw_lock:
                state.latest_landmarks = None

        # Stream the frame (with overlay drawn on it)
        try:
             encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 92]
             ret, buffer = cv2.imencode('.jpg', frame, encode_param)
             if ret:
                 state.latest_frame = buffer.tobytes()
        except Exception as e:
             print(f"Frame encoding error: {e}")

        # Update FPS Status
        frame_count += 1
        curr_time = time.time()
        if curr_time - fps_start_time > 1.0:
            fps = frame_count / (curr_time - fps_start_time)
            frame_count = 0
            fps_start_time = curr_time

            message_queue.put({
                "type": "status",
                "data": {
                    "fps": round(fps),
                    "camera_status": "on",
                    "detection_active": state.detection_active,
                    "model_status": "ready" if classifier.model is not None else "loading",
                    "total_detections": state.total_detections,
                    "actions_executed": state.actions_executed,
                    "confidence_threshold": state.confidence_threshold,
                    "speed_factor": state.speed_factor,
                    "cursor_mode": state.cursor_mode
                }
            })
            
        time.sleep(0.01) # Small sleep to prevent 100% CPU usage

    cap.release()
    print("Camera stopped.")


def detection_loop():
    """Independent loop for AI processing and Action Execution.
    Uses shared landmarks from camera_loop — no duplicate MediaPipe call."""
    print("Detection thread started.")

    while state.camera_running:
        # 1. Get the latest landmarks from camera loop
        with state.draw_lock:
            hand_landmarks = list(state.latest_landmarks) if state.latest_landmarks else None

        if hand_landmarks is None:
            time.sleep(0.01)
            continue

        try:
            # 2. Action Logic (uses landmarks shared from camera_loop's single MediaPipe pass)
            if hand_landmarks:
                 
                 # --- Training Mode ---
                 if state.training_mode and state.training_gesture_id:
                      current_time = time.time()
                      if current_time - state.last_capture_time >= 0.1:
                          state.last_capture_time = current_time
                          state.training_data_buffer.append(hand_landmarks)
                          sample_count = len(state.training_data_buffer)

                          message_queue.put({
                              "type": "training",
                              "data": {
                                  "gestureId": state.training_gesture_id,
                                  "sampleCount": sample_count,
                                  "target": state.training_sample_target
                              }
                          })

                          if sample_count >= state.training_sample_target:
                              state.training_mode = False
                              print(f"Training capture complete for {state.training_gesture_id}")
                              save_training_data(state.training_gesture_id, state.training_data_buffer)
                              message_queue.put({"type": "training_complete", "data": {"gestureId": state.training_gesture_id}})
                 
                 # --- Detection Mode ---
                 elif state.detection_active:
                      current_time = time.time()
                      prediction_label, confidence_score = classifier.predict(hand_landmarks)

                      mapped_gesture = next((g for g in state.gestures if g["id"] == prediction_label), None)
                      gesture_name = mapped_gesture["name"] if mapped_gesture else None
                      action_name = mapped_gesture["action"] if mapped_gesture else None
                      
                      gesture_map = {g["name"]: g["action"] for g in state.gestures}
                      
                      ACTION_COOLDOWNS = {
                         "volume_up": 0.15,
                         "volume_down": 0.15,
                         "brightness_up": 0.15,
                         "brightness_down": 0.15,
                         "scroll_up": 0.15,
                         "scroll_down": 0.15,
                         "play_pause": 2.5,
                         "next_track": 2.0,
                         "prev_track": 2.0,
                         "screenshot": 4.0,
                         "switch_tab": 1.0,
                         "mute": 2.0,
                         "toggle_cursor": 0.5,
                         "None": 0.0
                      }

                      # --- Helper for executing actions ---
                      def execute_gesture_action_logic(act_name):
                          if act_name == "toggle_cursor":
                             # Toggle with debounce
                             last_tog = state.last_action_time.get("toggle_cursor", 0)
                             if current_time - last_tog > 1.0:
                                  state.cursor_mode = not state.cursor_mode
                                  print(f"Cursor Mode: {'ON' if state.cursor_mode else 'OFF'}")
                                  state.last_action_time["toggle_cursor"] = current_time
                                  message_queue.put({
                                        "type": "status",
                                        "data": {
                                            "detection_active": state.detection_active,
                                            "cursor_mode": state.cursor_mode,
                                            "camera_status": "on" if state.camera_running else "off",
                                            "model_status": "ready" if classifier.model is not None else "loading",
                                            "fps": 0,
                                            "confidence_threshold": state.confidence_threshold,
                                            "speed_factor": state.speed_factor
                                        }
                                  })
                             return

                          # Normal Action — cooldown is scaled by speed_factor so higher
                          # speed means shorter cooldowns and faster gesture execution.
                          last_time = state.last_action_time.get(act_name, 0)
                          base_cooldown = ACTION_COOLDOWNS.get(act_name, 0.5)
                          cooldown = base_cooldown / max(state.speed_factor, 0.1)

                          if current_time - last_time > cooldown:
                              print(f"Executing: {act_name} for {gesture_name}")
                              execute_action(act_name)
                              state.last_action_time[act_name] = current_time

                      # --- Logic Branching ---
                      # 1. Toggle Cursor (Always active if high confidence)
                      if action_name == "toggle_cursor" and confidence_score > 0.8:
                           execute_gesture_action_logic(action_name)

                      # 2. Cursor Mode Active
                      elif state.cursor_mode:
                          mouse_controller.update(hand_landmarks)
                          # We do NOT execute other gestures in cursor mode
                          
                      # 3. Standard Gesture Mode
                      else:
                          if gesture_name and confidence_score > state.confidence_threshold:
                              if action_name and action_name != "toggle_cursor":
                                  execute_gesture_action_logic(action_name)
                      
                      # --- Notifications ---
                      # Only notify if confidence is ABOVE threshold
                      should_notify = False
                      if confidence_score > state.confidence_threshold:
                          # Debounce notifications — scale with speed_factor
                          notification_debounce = 0.5 / max(state.speed_factor, 0.1)
                          if current_time - state.last_notification_time > notification_debounce:
                              if state.cursor_mode:
                                  # Only notify toggle in cursor mode
                                  if action_name == "toggle_cursor" and confidence_score > 0.8:
                                      should_notify = True
                              elif action_name:
                                  # Notify all actions in normal mode
                                  should_notify = True

                          if should_notify:
                              state.last_notification_time = current_time
                              message_queue.put({
                                  "type": "detection",
                                  "data": {
                                      "gesture_id": "detect_" + str(uuid.uuid4())[:8],
                                      "gesture_name": gesture_name,
                                      "confidence": float(confidence_score),
                                      "action": action_name or "None",
                                      "executed": True 
                                  }
                              })

        except Exception as e:
            print(f"Detection Error: {e}")
            
        # Small sleep to prevent eating 100% CPU in this thread
        time.sleep(0.01)



def save_training_data(gesture_id, data):

    import os
    if not os.path.exists("data"):
        os.makedirs("data")

    filename = f"data/{gesture_id}.npy"
    if os.path.exists(filename):
        existing = np.load(filename)
        data = np.concatenate((existing, data))

    np.save(filename, data)
    print(f"Saved {len(data)} samples for {gesture_id}")

def retrain_model_logic():

    import os
    import glob

    X = []
    y = []

    files = glob.glob("data/*.npy")
    for f in files:
        gesture_id = os.path.basename(f).replace(".npy", "")
        data = np.load(f)
        for sample in data:
            X.append(sample)
            y.append(gesture_id)

    if X:
        print(f"Retraining on {len(X)} samples...")
        classifier.train(X, y)
        print("Retraining done.")
        message_queue.put({
            "type": "status",
            "data": {
                "model_status": "ready",
                "camera_status": "on" if state.camera_running else "off",
                "detection_active": state.detection_active,
                "fps": 0
            }
        })
        message_queue.put({
            "type": "training_complete",
            "data": {
                "accuracy": 100
            }
        })
        return True
    return False

async def message_consumer():
    """Reads from the queue and broadcasts to WebSockets."""
    while True:
        try:

            while not message_queue.empty():
                msg = message_queue.get_nowait()
                if msg["type"] == "status":
                    await manager.send_status(**msg["data"])
                elif msg["type"] == "detection":
                    await manager.send_detection(**msg["data"])
                elif msg["type"] == "training":

                    await manager.broadcast(msg)
                elif msg["type"] == "training_complete":
                     await manager.broadcast(msg)

            await asyncio.sleep(0.05)
        except Exception as e:
            print(f"Consumer Error: {e}")
            await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    state.camera_running = True
    
    camera_thread = threading.Thread(target=camera_loop, name="CameraThread", daemon=True)
    camera_thread.start()

    detection_thread = threading.Thread(target=detection_loop, name="DetectionThread", daemon=True)
    detection_thread.start()

    asyncio.create_task(message_consumer())


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down... Stopping camera.")
    state.camera_running = False
    time.sleep(0.5)

class Gesture(BaseModel):
    id: str
    name: str
    emoji: str
    action: str
    sampleCount: int = 0

class CaptureRequest(BaseModel):
    gestureId: str
    numSamples: int = 50



@app.get("/")
def read_root():
    return {"status": "ok", "message": "Glide Backend Running"}

def gen_frames():
    while True:
        if state.latest_frame:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + state.latest_frame + b'\r\n')
        time.sleep(0.016)

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(gen_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await manager.send_status()
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/gestures")
def get_gestures():
    return state.gestures

@app.post("/gestures")
def add_gesture(gesture: Gesture):
    state.gestures.append(gesture.model_dump())
    state.save_gestures()
    return {"status": "success", "gesture": gesture}

@app.delete("/gestures/{gesture_id}")
def delete_gesture(gesture_id: str):
    state.gestures = [g for g in state.gestures if g["id"] != gesture_id]
    state.save_gestures()

    import os
    try:
        data_path = f"data/{gesture_id}.npy"
        if os.path.exists(data_path):
            os.remove(data_path)
            print(f"Deleted training data for {gesture_id}")
    except Exception as e:
        print(f"Error deleting data file: {e}")

    return {"status": "success"}

@app.put("/gestures/{gesture_id}")
def update_gesture(gesture_id: str, gesture_update: Dict[str, Any]):
    found = False
    for g in state.gestures:
        if g["id"] == gesture_id:
            if "name" in gesture_update:
                g["name"] = gesture_update["name"]
            if "action" in gesture_update:
                g["action"] = gesture_update["action"]
            if "emoji" in gesture_update:
                g["emoji"] = gesture_update["emoji"]
            found = True
            break
            
    if found:
        state.save_gestures()
        return {"status": "success"}
    return {"status": "error", "message": "Gesture not found"}

@app.post("/train/capture")
def start_capture_route(req: CaptureRequest):
    if state.training_mode:
        return {"status": "error", "message": "Already training"}

    state.training_gesture_id = req.gestureId
    state.training_sample_target = req.numSamples
    state.training_data_buffer = []
    state.training_mode = True

    return {"status": "started", "gestureId": req.gestureId}

@app.post("/train/model")
def train_model_route(background_tasks: BackgroundTasks):

    background_tasks.add_task(retrain_model_logic)
    return {"status": "training_started"}



@app.post("/system/status")
def update_system_status(status_update: dict):
    """
    Expects: {"camera": "on"|"off", "detectionActive": boolean}
    """
    if "camera" in status_update:
        if status_update["camera"] == "on":
            if not state.camera_running:
                state.camera_running = True

                if not any(t.name == "CameraThread" for t in threading.enumerate()):
                     camera_thread = threading.Thread(target=camera_loop, name="CameraThread", daemon=True)
                     camera_thread.start()

                if not any(t.name == "DetectionThread" for t in threading.enumerate()):
                     detection_thread = threading.Thread(target=detection_loop, name="DetectionThread", daemon=True)
                     detection_thread.start()
        elif status_update["camera"] == "off":
            state.camera_running = False

    if "detectionActive" in status_update:
        state.detection_active = bool(status_update["detectionActive"])

    if "confidenceThreshold" in status_update:

        state.confidence_threshold = float(status_update["confidenceThreshold"]) / 100.0

    if "speedFactor" in status_update:
        state.speed_factor = float(status_update["speedFactor"])

    return {"status": "success", "systemStatus": {
        "camera": "on" if state.camera_running else "off",
        "detectionActive": state.detection_active,
        "model": "ready",
        "cursorMode": state.cursor_mode
    }}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8053)
