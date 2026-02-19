from desktop_controller import desktop_controller

ACTION_MAP = {
    "Swipe Left": "previous_track",
    "Swipe Right": "next_track",
    "Thumbs Up": "play_pause",
    "Peace Sign": "volume_mute",
    "Open Palm": "volume_up",
    "Closed Fist": "volume_down"
}

def execute_action(action_name):
    """Executes the mapped action safely using the platform-specific controller."""
    try:

        if action_name == "prev_track":
            desktop_controller.prev_track()
        elif action_name == "next_track":
            desktop_controller.next_track()
        elif action_name == "play_pause":
            desktop_controller.play_pause()

        elif action_name == "mute":
            desktop_controller.mute()
        elif action_name == "volume_up":
            desktop_controller.volume_up()
        elif action_name == "volume_down":
            desktop_controller.volume_down()

        elif action_name == "scroll_up":
            desktop_controller.scroll_up()
        elif action_name == "scroll_down":
            desktop_controller.scroll_down()

        elif action_name == "brightness_up":
            desktop_controller.brightness_up()
        elif action_name == "brightness_down":
            desktop_controller.brightness_down()

        elif action_name == "switch_tab":
            desktop_controller.switch_tab()
        elif action_name == "screenshot":
            desktop_controller.screenshot()
        elif action_name == "minimize_window":

            import pyautogui
            import platform
            if platform.system() == "Darwin":
                pyautogui.hotkey("command", "m")
            else:
                pyautogui.hotkey("win", "down")

        else:
            print(f"Unknown or unmapped action: {action_name}")

    except Exception as e:
        print(f"Error executing action {action_name}: {e}")
