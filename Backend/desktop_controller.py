import pyautogui
import platform

class DesktopController:
    def __init__(self):

        pyautogui.FAILSAFE = True

    def screenshot(self):
        print("DesktopController: Screenshot")
        if platform.system() == "Darwin":
            pyautogui.hotkey("command", "shift", "3")
        else:
            pyautogui.hotkey("win", "printscreen")

    def switch_tab(self):
        if platform.system() == "Darwin":
            pyautogui.hotkey("ctrl", "tab")
        else:
            pyautogui.hotkey("alt", "tab")

    def volume_up(self):
        print("DesktopController: Volume Up")
        if platform.system() == "Darwin":
            import os

            os.system("osascript -e 'set volume output volume (output volume of (get volume settings) + 6)'")
        else:
            pyautogui.press("volumeup")

    def volume_down(self):
        print("DesktopController: Volume Down")
        if platform.system() == "Darwin":
            import os
            os.system("osascript -e 'set volume output volume (output volume of (get volume settings) - 6)'")
        else:
            pyautogui.press("volumedown")

    def brightness_up(self):
        print("DesktopController: Brightness Up")
        if platform.system() == "Darwin":
            import os

            os.system("osascript -e 'tell application \"System Events\" to key code 144 using {option down, shift down}'")
        else:

            pass

    def brightness_down(self):
        print("DesktopController: Brightness Down")
        if platform.system() == "Darwin":
            import os

            os.system("osascript -e 'tell application \"System Events\" to key code 145 using {option down, shift down}'")
        else:
            pass

    def mute(self):
        print("DesktopController: Mute")
        if platform.system() == "Darwin":
             import os
             os.system("osascript -e 'set volume output muted not (output muted of (get volume settings))'")
        else:
            pyautogui.press("volumemute")

    def play_pause(self):
        print("DesktopController: Play/Pause")
        pyautogui.press("playpause")

    def next_track(self):
        print("DesktopController: Next Track")
        pyautogui.press("nexttrack")

    def prev_track(self):
        print("DesktopController: Prev Track")
        pyautogui.press("prevtrack")

    def scroll_up(self):
        pyautogui.scroll(50)

    def scroll_down(self):
        pyautogui.scroll(-50)

desktop_controller = DesktopController()
