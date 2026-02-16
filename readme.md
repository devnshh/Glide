# Glide - Gesture Control Desktop System

**Glide** is a sophisticated, AI-powered desktop control system that allows you to control your computer using customizable hand gestures. It combines real-time computer vision (MediaPipe) with a modern, glassmorphism-styled React dashboard for a seamless and futuristic user experience.

![Glide Dashboard Screenshot](placeholder-image-url.png)
*(Replace with a screenshot of your dashboard once captured)*

## 🚀 Features

-   **Real-Time Gesture Recognition**: Uses MediaPipe and custom Random Forest models to detect gestures instantly.
-   **Customizable Gesture Library**: Add, name, and map your own hand gestures to desktop actions.
-   **One-Click Retraining**: Easily retrain the AI model directly from the UI when you add new gestures.
-   **Desktop Control Actions**:
    -   Media Controls (Play/Pause, Next/Previous, Volume)
    -   Window Management (Alt-Tab, Desktop Show)
    -   Scrolling & Navigation
    -   Brightness Control
-   **Modern Dashboard**: Built with Next.js, Tailwind CSS, and Framer Motion for a premium feel.
-   **WebSocket Integration**: Real-time feedback loop between the Python backend and React frontend.

## 🛠️ Tech Stack

### Backend (Python)
-   **FastAPI**: High-performance API and WebSocket server.
-   **OpenCV & MediaPipe**: Hand tracking and landmark extraction.
-   **Scikit-learn**: Gesture classification (Random Forest).
-   **PyAutoGUI**: Simulating keyboard and mouse actions.

### Frontend (React/Next.js)
-   **Next.js 16**: React framework for the dashboard.
-   **Tailwind CSS**: Utility-first styling.
-   **Framer Motion**: Smooth animations.
-   **Recharts**: Data visualization for detection stats.
-   **Lucide React**: Beautiful icons.

## 📦 Installation & Setup

### Prerequisites
-   **Python 3.9+**
-   **Node.js 18+** (pnpm recommended)
-   **Webcam**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/glide.git
cd glide
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend server:

```bash
python3 main.py
```
*The backend will start on http://localhost:8053*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:

```bash
cd Frontend
pnpm install
# or npm install
```

Run the development server:
```bash
pnpm dev
# or npm run dev
```
*The dashboard will be available at http://localhost:3000*

## 🎮 Usage Guide

1.  **Open the Dashboard**: Go to http://localhost:3000 in your browser.
2.  **Check Connection**: Ensure the "Camera", "Model", and "WebSocket" indicators in the top right are green.
3.  **Add a Gesture**:
    -   Go to the "Gestures" tab.
    -   Click "Add Gesture".
    -   Name your gesture (e.g., "Peace Sign") and map it to an action (e.g., "Play/Pause").
    -   Follow the prompts to record samples using your webcam.
4.  **Retrain Model**: Click the "Retrain" button to update the AI model with your new gesture.
5.  **Start Controlling**: Toggle "Start Detection" on the main dashboard and use your hand gestures to control your PC!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
