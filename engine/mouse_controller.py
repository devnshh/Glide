import pyautogui
import numpy as np
import time
from collections import deque

class MouseController:
    def __init__(self):
        # Configuration
        self.smoothing_factor = 0.5 # increased reactivity for moving average
        self.pinch_threshold = 0.05  # Normalized distance for click
        self.click_hold_time = 1.0   # Seconds to trigger right click
        self.double_click_time = 0.5 # Seconds window for double click
        self.history_length = 5
        self.deadzone_radius = 2.0   # Pixels
        
        # State
        self.prev_x, self.prev_y = 0, 0
        self.screen_w, self.screen_h = pyautogui.size()
        self.is_pinched = False
        self.pinch_start_time = 0
        self.last_click_time = 0
        self.history = deque(maxlen=self.history_length)
        
        # Disable FailSafe to prevent crashes at corners
        pyautogui.FAILSAFE = False

    def update(self, landmarks):
        """
        Process hand landmarks to move mouse and detect clicks.
        """
        if not landmarks:
            return

        # disable pyautogui default delays for speed
        pyautogui.PAUSE = 0
        pyautogui.MINIMUM_DURATION = 0

        # Extract landmarks
        # Index Tip: 8 (Indices 24, 25)
        # Index PIP: 6 (Indices 18, 19)
        # Index MCP: 5 (Indices 15, 16)
        # Thumb Tip: 4 (Indices 12, 13)

        try:
            # Click Detection (Actual Tip vs Thumb)
            tip_x, tip_y = landmarks[24], landmarks[25]
            tx, ty = landmarks[12], landmarks[13]
            
            # --- Move Mouse (Virtual Tip Projection) ---
            # To fix "cursor drop" on pinch while still feeling like "tip tracking":
            # We project a vector from the Index MCP (Knuckle) through the PIP joint.
            # This tracks where the finger is *pointing*, which stays stable even if the tip curls down.
            
            mx, my = landmarks[15], landmarks[16] # Index MCP
            px, py = landmarks[18], landmarks[19] # Index PIP
            
            # Vector from MCP to PIP
            vx, vy = px - mx, py - my
            
            # Project outwards to estimate where the "straight" tip would be
            # Scale factor 1.5 approximates the length of the rest of the finger
            proj_x = px + vx * 1.5
            proj_y = py + vy * 1.5
            
            # Map normalized coordinates (0-1) to screen size
            target_x = np.interp(proj_x, [0, 1], [0, self.screen_w])
            target_y = np.interp(proj_y, [0, 1], [0, self.screen_h])
            
            # Add to history
            self.history.append((target_x, target_y))
            
            # Calculate Moving Average
            avg_x = np.mean([p[0] for p in self.history])
            avg_y = np.mean([p[1] for p in self.history])
            
            # Apply Deadzone
            if not self.is_pinched:
                dist_moved = ((avg_x - self.prev_x)**2 + (avg_y - self.prev_y)**2)**0.5
                if dist_moved < self.deadzone_radius:
                    avg_x, avg_y = self.prev_x, self.prev_y

            # Dynamic Smoothing
            if self.is_pinched:
                 # Slower smoothing when dragging
                 curr_x = self.prev_x + (avg_x - self.prev_x) * 0.2
                 curr_y = self.prev_y + (avg_y - self.prev_y) * 0.2
            else:
                 # Normal smoothing
                 curr_x = self.prev_x + (avg_x - self.prev_x) * self.smoothing_factor
                 curr_y = self.prev_y + (avg_y - self.prev_y) * self.smoothing_factor
            
            pyautogui.moveTo(curr_x, curr_y)
            self.prev_x, self.prev_y = curr_x, curr_y
            
            # --- Click Detection ---
            distance = ((tip_x - tx)**2 + (tip_y - ty)**2)**0.5
            
            if distance < self.pinch_threshold:
                if not self.is_pinched:
                    # Pinch Started
                    self.is_pinched = True
                    self.pinch_start_time = time.time()
            else:
                if self.is_pinched:
                    # Pinch Released
                    self.is_pinched = False
                    duration = time.time() - self.pinch_start_time
                    
                    if duration < self.click_hold_time:
                        # Short Pinch -> Left Click
                        current_time = time.time()
                        if current_time - self.last_click_time < self.double_click_time:
                            pyautogui.doubleClick()
                            print("Mouse: Double Click")
                            self.last_click_time = 0 # Reset
                        else:
                            pyautogui.click()
                            print("Mouse: Left Click")
                            self.last_click_time = current_time
                    else:
                        # Long Pinch -> Right Click
                        pyautogui.rightClick()
                        print("Mouse: Right Click")
                        
        except Exception as e:
            print(f"Mouse control error: {e}")
