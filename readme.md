<div align="center">
  <h1>Glide</h1>

  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>A sophisticated, AI-powered desktop control system powered by MediaPipe and React.</p>
</div>

Glide combines real-time computer vision with a modern, glassmorphism-styled dashboard for a seamless and futuristic user experience.
## Features

### Computer Vision and AI
- Real-Time Hand Tracking: High-fidelity landmark detection using MediaPipe.
- Customizable Gesture Recognition: Custom Random Forest classifier (Scikit-learn) for high-accuracy gesture identification.
- Data Collection Engine: Capture landmark samples in real-time to train new gestures.
- Instant Retraining: Retrain the AI model directly from the UI to incorporate new gestures on-the-fly.

### Dynamic Desktop Control
- Precision Cursor Control: Smooth mouse movement using vector projection from hand landmarks to minimize jitter.
- Gesture-Based Clicking:
    - Left Click: Short pinch gesture.
    - Double Click: Two rapid short pinches.
    - Right Click: Long hold pinch gesture.
- Global Action Mapping: Map specific gestures to a wide range of system actions.

### Comprehensive Action Library
- Media Controls: Play/Pause, Next Track, Previous Track, Mute.
- Audio Management: Volume Up, Volume Down.
- Display Settings: Brightness Up, Brightness Down.
- Navigation: Scroll Up, Scroll Down, Switch Tab (Alt+Tab / Cmd+Tab).
- System Utilities: Screenshot capture, Minimize Window.

### Professional Dashboard
- Live Camera Feed: Low-latency video stream with real-time hand landmark overlays.
- Real-Time Statistics: Monitor FPS, total detections, actions executed, and model confidence scores.
- System Status: Instant feedback on camera status, model readiness, and WebSocket connectivity.
- Gesture Management: Create, edit, and delete gestures and their assigned actions.

### Communication and Scalability
- WebSocket Integration: Full-duplex communication between the Python backend and React frontend for instantaneous feedback.
- Cross-Platform Support: Optimized hotkeys and system controls for both macOS and Windows.

## Project Structure

```text
Glide/
├── engine/                     # AI & System Control Logic
│   ├── data/                   # Saved landmark samples (npy format)
│   ├── models/                 # Serialized model weights and metadata
│   ├── main.py                 # FastAPI server, WebSocket orchestrator
│   ├── gesture_detector.py      # MediaPipe integration for landmark extraction
│   ├── gesture_classifier.py    # Random Forest training and prediction logic
│   ├── mouse_controller.py      # Cursor movement and click detection logic
│   ├── desktop_controller.py    # Platform-specific automation (PyAutoGUI)
│   ├── action_mapper.py        # Mapping interface for system actions
│   ├── websocket_manager.py     # Connection management for real-time updates
│   ├── gestures.json           # Persistent storage for mappings
│   └── requirements.txt        # Python dependency specifications
├── app/                        # Next.js App Router and page layouts
├── components/                 # Reusable UI components (LiveFeed, UI, Dashboard)
├── hooks/                      # Custom React hooks (useMobile, etc.)
├── lib/                        # Utility functions and type definitions
├── public/                     # Static assets and icons
├── styles/                     # Tailwind CSS and global themes
├── package.json               # Node.js dependency specifications
├── .gitignore                  # Consolidated repository ignore rules
└── readme.md                  # Project documentation
```

## Setup and Installation

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher (pnpm recommended)
- Integrated or external webcam

### 1. Engine Configuration (Backend)
Navigate to the engine directory and initialize the environment:

```bash
cd engine
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Launch the engine server:
```bash
python3 main.py
```
Default endpoint: http://localhost:8053

### 2. Dashboard Configuration (Frontend)
From the root directory, install dependencies and start the UI:

```bash
pnpm install
# Alternative: npm install
```

Start the development server:
```bash
pnpm dev
# Alternative: npm run dev
```
Dashboard address: http://localhost:3000

## Usage Guide

1. **Initialize**: Ensure the backend and frontend are running. Open the dashboard in your browser.
2. **Connectivity**: Verify that Camera, Model, and WebSocket indicators are active.
3. **Gesture Creation**:
   - Navigate to the Gestures tab.
   - Click Add Gesture, provide a name, and select a system action.
   - Record landmark samples by following the on-screen prompts.
4. **Retrain**: Click Retrain Model to synchronize the AI classifier with your new data.
5. **Control**: Toggle Start Detection and use your hand gestures to interact with your system.

## Technical Stack

### Backend
- FastAPI: High-performance asynchronous API framework.
- MediaPipe: Google's modular ML framework for computer vision.
- Scikit-learn: Machine learning library for the Random Forest classifier.
- OpenCV: Real-time image processing.
- PyAutoGUI: Cross-platform GUI automation.

### Frontend
- Next.js: React framework for performance and routing.
- Tailwind CSS: Utility-first styling for the glassmorphism design.
- Framer Motion: Production-ready motion library for animations.
- Recharts: Composable charting library for data visualization.
- Lucide React: Clean and consistent icon library.

## License
This project is licensed under the MIT License.
