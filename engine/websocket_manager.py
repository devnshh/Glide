from fastapi import WebSocket
from typing import List
import json
import time

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):

        if "timestamp" not in message:
            message["timestamp"] = time.time() * 1000

        json_msg = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(json_msg)
            except Exception as e:
                print(f"Error sending to websocket: {e}")

    async def send_status(self, camera_status="on", model_status="ready", detection_active=True, fps=0, total_detections=0, actions_executed=0, confidence_threshold=0.75, speed_factor=1.0, cursor_mode=False):
        msg = {
            "type": "status",
            "data": {
                "camera": camera_status,
                "modelReady": model_status == "ready",
                "fps": fps,
                "detectionActive": detection_active,
                "totalDetections": total_detections,
                "actionsExecuted": actions_executed,
                "confidenceThreshold": round(confidence_threshold * 100),
                "speedFactor": speed_factor,
                "cursorMode": cursor_mode
            }
        }
        await self.broadcast(msg)

    async def send_detection(self, gesture_id, gesture_name, confidence, action, executed=False):
        msg = {
            "type": "detection",
            "data": {
                "gestureId": gesture_id,
                "gestureName": gesture_name,
                "confidence": confidence,
                "action": action,
                "executed": executed
            }
        }
        await self.broadcast(msg)

manager = ConnectionManager()
