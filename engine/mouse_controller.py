import pyautogui
import numpy as np
import time
import math

class MouseController:
    def __init__(self):
        self.pinch_on_threshold = 0.04
        self.pinch_off_threshold = 0.07
        self.click_hold_time = 1.0
        self.double_click_time = 0.5
        self.smoothing = 0.4

        self.prev_x, self.prev_y = 0, 0
        self.screen_w, self.screen_h = pyautogui.size()
        self.is_pinched = False
        self.pinch_start_time = 0
        self.last_click_time = 0
        self.initialized = False
        self.pinch_freeze_y = None

        pyautogui.FAILSAFE = False

    def update(self, landmarks):
        """
        Process hand landmarks to move mouse and detect clicks.
        Uses index fingertip directly for natural, responsive cursor movement.
        """
        if not landmarks:
            return

        pyautogui.PAUSE = 0
        pyautogui.MINIMUM_DURATION = 0

        try:
            now = time.time()

            tip_x, tip_y = landmarks[24], landmarks[25]
            tx, ty = landmarks[12], landmarks[13]
            distance = ((tip_x - tx)**2 + (tip_y - ty)**2)**0.5

            if not self.is_pinched and distance < self.pinch_on_threshold:
                self.is_pinched = True
                self.pinch_start_time = now
                self.pinch_freeze_y = self.prev_y

            elif self.is_pinched and distance > self.pinch_off_threshold:
                self.is_pinched = False
                duration = now - self.pinch_start_time
                self.pinch_freeze_y = None

                if duration < self.click_hold_time:
                    if now - self.last_click_time < self.double_click_time:
                        pyautogui.doubleClick()
                        print("Mouse: Double Click")
                        self.last_click_time = 0
                    else:
                        pyautogui.click()
                        print("Mouse: Left Click")
                        self.last_click_time = now
                else:
                    pyautogui.rightClick()
                    print("Mouse: Right Click")

            if self.is_pinched:
                return

            raw_x = tip_x
            raw_y = tip_y

            target_x = np.interp(raw_x, [0.05, 0.95], [0, self.screen_w])
            target_y = np.interp(raw_y, [0.05, 0.85], [0, self.screen_h])

            target_x = max(0, min(target_x, self.screen_w - 1))
            target_y = max(0, min(target_y, self.screen_h - 1))

            if not self.initialized:
                self.prev_x, self.prev_y = target_x, target_y
                self.initialized = True
                return

            smooth_x = self.prev_x + (1 - self.smoothing) * (target_x - self.prev_x)
            smooth_y = self.prev_y + (1 - self.smoothing) * (target_y - self.prev_y)

            pyautogui.moveTo(smooth_x, smooth_y)
            self.prev_x, self.prev_y = smooth_x, smooth_y

        except Exception as e:
            print(f"Mouse control error: {e}")
