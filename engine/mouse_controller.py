import pyautogui
import numpy as np
import time
import math

# ---------------------------------------------------------------------------
# 1-Euro Filter — adaptive low-pass filter for real-time signal smoothing.
# Reduces jitter at rest while staying responsive during fast movement.
# Reference: Casiez, Roussel & Vogel (2012)
# ---------------------------------------------------------------------------

class LowPassFilter:
    """Simple first-order exponential low-pass filter."""
    def __init__(self, alpha=1.0):
        self._y = None
        self._alpha = alpha

    def __call__(self, value, alpha=None):
        if alpha is not None:
            self._alpha = alpha
        if self._y is None:
            self._y = value
        else:
            self._y = self._alpha * value + (1.0 - self._alpha) * self._y
        return self._y


class OneEuroFilter:
    """
    Attempt to minimize jitter while preserving responsiveness.
    min_cutoff  — lower = smoother (more jitter reduction at rest)
    beta        — higher = faster adaptation to speed (snappier tracking)
    d_cutoff    — cutoff for derivative filter (usually leave at 1.0)
    """
    def __init__(self, freq=30.0, min_cutoff=1.0, beta=0.007, d_cutoff=1.0):
        self._freq = freq
        self._min_cutoff = min_cutoff
        self._beta = beta
        self._d_cutoff = d_cutoff
        self._x_filter = LowPassFilter()
        self._dx_filter = LowPassFilter()
        self._last_time = None

    @staticmethod
    def _alpha(cutoff, freq):
        tau = 1.0 / (2.0 * math.pi * cutoff)
        te = 1.0 / freq
        return 1.0 / (1.0 + tau / te)

    def __call__(self, x, timestamp=None):
        if self._last_time is not None and timestamp is not None:
            dt = timestamp - self._last_time
            if dt > 0:
                self._freq = 1.0 / dt
        self._last_time = timestamp

        prev = self._x_filter._y
        dx = 0.0 if prev is None else (x - prev) * self._freq
        edx = self._dx_filter(dx, alpha=self._alpha(self._d_cutoff, self._freq))
        cutoff = self._min_cutoff + self._beta * abs(edx)
        return self._x_filter(x, alpha=self._alpha(cutoff, self._freq))


# ---------------------------------------------------------------------------
# Mouse Controller
# ---------------------------------------------------------------------------

class MouseController:
    def __init__(self):
        # --- Configuration ---
        self.pinch_on_threshold = 0.04    # Tighter: must clearly pinch to trigger
        self.pinch_off_threshold = 0.07   # Wider: must clearly release to un-trigger
        self.click_hold_time = 1.0        # Seconds to trigger right click
        self.double_click_time = 0.5      # Seconds window for double click
        self.deadzone_radius = 5.0        # Pixels — absorbs natural hand tremor
        self.projection_scale = 1.2       # Reduced from 1.5 to lower noise amplification

        # --- State ---
        self.prev_x, self.prev_y = 0, 0
        self.screen_w, self.screen_h = pyautogui.size()
        self.is_pinched = False
        self.pinch_start_time = 0
        self.last_click_time = 0
        self.initialized = False          # First frame flag

        # --- 1-Euro filters (one per axis) ---
        # freq=30 matches our ~30fps camera loop
        self.filter_x = OneEuroFilter(freq=30.0, min_cutoff=1.0, beta=0.007)
        self.filter_y = OneEuroFilter(freq=30.0, min_cutoff=1.0, beta=0.007)

        # Disable FailSafe to prevent crashes at corners
        pyautogui.FAILSAFE = False

    def update(self, landmarks):
        """
        Process hand landmarks to move mouse and detect clicks.
        """
        if not landmarks:
            return

        # Disable pyautogui default delays for speed
        pyautogui.PAUSE = 0
        pyautogui.MINIMUM_DURATION = 0

        # Landmark indices (each landmark has x, y, z → index*3, index*3+1, index*3+2)
        # Index Tip  (8): indices 24, 25
        # Index PIP  (6): indices 18, 19
        # Index MCP  (5): indices 15, 16
        # Thumb Tip  (4): indices 12, 13

        try:
            now = time.time()

            # --- Click Detection (Actual Tip vs Thumb) ---
            tip_x, tip_y = landmarks[24], landmarks[25]
            tx, ty = landmarks[12], landmarks[13]
            distance = ((tip_x - tx)**2 + (tip_y - ty)**2)**0.5

            # Hysteresis: separate on/off thresholds to prevent oscillation
            if not self.is_pinched and distance < self.pinch_on_threshold:
                # --- Pinch Started ---
                self.is_pinched = True
                self.pinch_start_time = now

            elif self.is_pinched and distance > self.pinch_off_threshold:
                # --- Pinch Released ---
                self.is_pinched = False
                duration = now - self.pinch_start_time

                if duration < self.click_hold_time:
                    # Short Pinch → Left Click (or Double Click)
                    if now - self.last_click_time < self.double_click_time:
                        pyautogui.doubleClick()
                        print("Mouse: Double Click")
                        self.last_click_time = 0  # Reset
                    else:
                        pyautogui.click()
                        print("Mouse: Left Click")
                        self.last_click_time = now
                else:
                    # Long Pinch → Right Click
                    pyautogui.rightClick()
                    print("Mouse: Right Click")

            # --- Pinch Freeze: skip ALL cursor movement while pinched ---
            if self.is_pinched:
                return

            # --- Move Mouse (Virtual Tip Projection) ---
            mx, my = landmarks[15], landmarks[16]  # Index MCP
            px, py = landmarks[18], landmarks[19]  # Index PIP

            # Vector from MCP to PIP
            vx, vy = px - mx, py - my

            # Project outward (reduced from 1.5 to 1.2 to lower noise amplification)
            proj_x = px + vx * self.projection_scale
            proj_y = py + vy * self.projection_scale

            # Map normalized [0,1] coordinates to screen pixels
            target_x = np.interp(proj_x, [0, 1], [0, self.screen_w])
            target_y = np.interp(proj_y, [0, 1], [0, self.screen_h])

            # Edge clamping — prevent erratic behavior at edges
            target_x = max(0, min(target_x, self.screen_w - 1))
            target_y = max(0, min(target_y, self.screen_h - 1))

            # Apply 1-Euro filter (adaptive smoothing)
            smooth_x = self.filter_x(target_x, timestamp=now)
            smooth_y = self.filter_y(target_y, timestamp=now)

            # Initialize on first frame (no jump from 0,0)
            if not self.initialized:
                self.prev_x, self.prev_y = smooth_x, smooth_y
                self.initialized = True
                return

            # Deadzone — absorb tiny tremor when hand is stationary
            dist_moved = ((smooth_x - self.prev_x)**2 + (smooth_y - self.prev_y)**2)**0.5
            if dist_moved < self.deadzone_radius:
                return  # Don't move at all

            # Move the cursor
            pyautogui.moveTo(smooth_x, smooth_y)
            self.prev_x, self.prev_y = smooth_x, smooth_y

        except Exception as e:
            print(f"Mouse control error: {e}")
