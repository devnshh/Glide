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

    def _mac_media_key(self, key_type):
        """Send a media key event using the NX system event layer (AppKit + Quartz).
        This is identical to how physical media keys work on macOS — routes to any
        active media player regardless of which app is in the foreground.
        NX_KEYTYPE_MUTE=7, NX_KEYTYPE_PLAY=16, NX_KEYTYPE_NEXT=17, NX_KEYTYPE_PREVIOUS=18
        Both AppKit and Quartz are guaranteed present because pyautogui requires them on macOS.
        """
        try:
            from AppKit import NSEvent
            import Quartz
            for flags, updown in ((0xa00, 0xa), (0xb00, 0xb)):
                data1 = (key_type << 16) | (updown << 8)
                ev = NSEvent.otherEventWithType_location_modifierFlags_timestamp_windowNumber_context_subtype_data1_data2_(
                    14,      # NSSystemDefined
                    (0, 0),  # location
                    flags,   # modifierFlags (0xa00=keydown, 0xb00=keyup)
                    0,       # timestamp
                    0,       # windowNumber
                    None,    # context
                    8,       # subtype
                    data1,   # data1 encodes key type + up/down
                    -1,      # data2
                )
                Quartz.CGEventPost(Quartz.kCGHIDEventTap, ev.CGEvent())
        except Exception as e:
            print(f"DesktopController: media key error: {e}")

    def screenshot(self):
        print("DesktopController: Screenshot")
        if self._system == "Darwin":
            pyautogui.hotkey("command", "shift", "3")
        else:
            pyautogui.hotkey("win", "printscreen")

    def switch_tab(self):
        print("DesktopController: Switch Tab")
        if self._system == "Darwin":
            pyautogui.hotkey("ctrl", "tab")
        else:
            pyautogui.hotkey("alt", "tab")

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
            self._mac_media_key(16)  # NX_KEYTYPE_PLAY = 16
        else:
            pyautogui.press("playpause")

    def next_track(self):
        print("DesktopController: Next Track")
        if self._system == "Darwin":
            self._mac_media_key(17)  # NX_KEYTYPE_NEXT = 17
        else:
            pyautogui.press("nexttrack")

    def prev_track(self):
        print("DesktopController: Prev Track")
        if self._system == "Darwin":
            self._mac_media_key(18)  # NX_KEYTYPE_PREVIOUS = 18
        else:
            pyautogui.press("prevtrack")

    def switch_desktop_left(self):
        """Switch to the previous virtual desktop/workspace.
        macOS: Ctrl+Left (same as 4-finger swipe left).
        Windows: Win+Ctrl+Left."""
        print("DesktopController: Switch Desktop Left")
        if self._system == "Darwin":
            pyautogui.hotkey("ctrl", "left")
        else:
            pyautogui.hotkey("win", "ctrl", "left")

    def switch_desktop_right(self):
        """Switch to the next virtual desktop/workspace.
        macOS: Ctrl+Right (same as 4-finger swipe right).
        Windows: Win+Ctrl+Right."""
        print("DesktopController: Switch Desktop Right")
        if self._system == "Darwin":
            pyautogui.hotkey("ctrl", "right")
        else:
            pyautogui.hotkey("win", "ctrl", "right")

    def scroll_up(self):
        print("DesktopController: Scroll Up")
        pyautogui.scroll(5)

    def scroll_down(self):
        print("DesktopController: Scroll Down")
        pyautogui.scroll(-5)

desktop_controller = DesktopController()
