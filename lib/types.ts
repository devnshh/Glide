
export type GestureStatus = 'idle' | 'recording' | 'training' | 'active';
export type DetectionStatus = 'active' | 'inactive' | 'paused';
export type CameraStatus = 'on' | 'off' | 'error';

export interface Gesture {
  id: string;
  name: string;
  emoji: string;
  action: string;
  sampleCount: number;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Detection {
  id: string;
  gestureId: string;
  gestureName: string;
  confidence: number;
  action: string;
  timestamp: Date;
}

export interface SystemStatus {
  camera: CameraStatus;
  model: 'loading' | 'ready' | 'error';
  detectionActive: boolean;
  fps: number;
  wsConnected: boolean;
  confidenceThreshold?: number;
  speedFactor?: number;
  cursorMode?: boolean;
}

export interface TrainingState {
  inProgress: boolean;
  gesture?: string;
  progress: number;
  accuracy?: number;
  error?: string;
}

export type ModalType =
  | 'addGesture'
  | 'editGesture'
  | 'deleteGesture'
  | 'mapAction'
  | 'retrain'
  | null;

export interface ModalState {
  type: ModalType;
  data?: Record<string, unknown>;
}

export interface AppState {
  gestures: Gesture[];
  detections: Detection[];
  systemStatus: SystemStatus;
  trainingState: TrainingState;
  modalState: ModalState;
  selectedGestureId?: string;
  needsRetrain: boolean;
}

export interface WebSocketMessage {
  type: 'detection' | 'status' | 'training' | 'error' | 'heartbeat';
  data: unknown;
  timestamp: number;
}

export interface DetectionMessage extends WebSocketMessage {
  type: 'detection';
  data: {
    gestureId: string;
    gestureName: string;
    confidence: number;
    action: string;
  };
}

export interface StatusMessage extends WebSocketMessage {
  type: 'status';
  data: {
    camera: CameraStatus;
    modelReady: boolean;
    fps: number;
    detectionActive: boolean;
    cursorMode?: boolean;
  };
}

export interface TrainingMessage extends WebSocketMessage {
  type: 'training';
  data: {
    gestureName: string;
    progress: number;
    accuracy?: number;
    complete: boolean;
  };
}
