import subprocess
import platform
import pyautogui

class DesktopController:
    def __init__(self):
        pyautogui.FAILSAFE = True
        self._system = platform.system()

    def _osascript(self, script):
        """Run an AppleScript command via subprocess (safer than os.system)."""
        try:
            subprocess.run(["osascript", "-e", script], check=False, timeout=3)
        except Exception as e:
            print(f"osascript error: {e}")

    def screenshot(self):
        print("DesktopController: Screenshot")
        if self._system == "Darwin":
            pyautogui.hotkey("command", "shift", "3")
        else:
            pyautogui.hotkey("win", "printscreen")

    def switch_tab(self):
        print("DesktopController: Switch Tab")
        pyautogui.hotkey("ctrl", "tab")

    def volume_up(self):
        print("DesktopController: Volume Up")
        if self._system == "Darwin":
            self._osascript("set volume output volume (output volume of (get volume settings) + 8)")
        else:
            pyautogui.press("volumeup")

    def volume_down(self):
        print("DesktopController: Volume Down")
        if self._system == "Darwin":
            self._osascript("set volume output volume (output volume of (get volume settings) - 8)")
        else:
            pyautogui.press("volumedown")

    def _adjust_windows_brightness(self, delta):
        """Adjust Windows brightness via WMI through PowerShell.
        No admin rights needed. Works on laptops and most built-in displays."""
        try:
            no_window = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
            get_cmd = (
                "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness)"
                ".CurrentBrightness"
            )
            result = subprocess.run(
                ["powershell", "-NonInteractive", "-Command", get_cmd],
                capture_output=True, text=True, check=False,
                timeout=3, creationflags=no_window
            )
            current = int(result.stdout.strip())
            new_level = max(0, min(100, current + delta))
            set_cmd = (
                f"(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods)"
                f".WmiSetBrightness(1, {new_level})"
            )
            subprocess.run(
                ["powershell", "-NonInteractive", "-Command", set_cmd],
                check=False, timeout=3, creationflags=no_window
            )
            print(f"DesktopController: Windows brightness {current} -> {new_level}")
        except Exception as e:
            print(f"DesktopController: Windows brightness error: {e}")

    def brightness_up(self):
        print("DesktopController: Brightness Up")
        if self._system == "Darwin":
            self._osascript('tell application "System Events" to key code 144 using {option down, shift down}')
        else:
            self._adjust_windows_brightness(10)

    def brightness_down(self):
        print("DesktopController: Brightness Down")
        if self._system == "Darwin":
            self._osascript('tell application "System Events" to key code 145 using {option down, shift down}')
        else:
            self._adjust_windows_brightness(-10)

    def mute(self):
        print("DesktopController: Mute")
        if self._system == "Darwin":
            self._osascript("set volume output muted not (output muted of (get volume settings))")
        else:
            pyautogui.press("volumemute")

    def play_pause(self):
        print("DesktopController: Play/Pause")
        if self._system == "Darwin":
            self._osascript('tell application "System Events" to key code 100')
        else:
            pyautogui.press("playpause")

    def next_track(self):
        print("DesktopController: Next Track")
        if self._system == "Darwin":
            self._osascript('tell application "System Events" to key code 101')
        else:
            pyautogui.press("nexttrack")

    def prev_track(self):
        print("DesktopController: Prev Track")
        if self._system == "Darwin":
            self._osascript('tell application "System Events" to key code 98')
        else:
            pyautogui.press("prevtrack")

    def scroll_up(self):
        print("DesktopController: Scroll Up")
        pyautogui.scroll(5)

    def scroll_down(self):
        print("DesktopController: Scroll Down")
        pyautogui.scroll(-5)

desktop_controller = DesktopController()
