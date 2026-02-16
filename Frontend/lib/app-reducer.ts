import { AppState, Gesture, Detection, SystemStatus, TrainingState, ModalType } from './types';

export type AppAction =
  | { type: 'SET_GESTURES'; payload: Gesture[] }
  | { type: 'ADD_GESTURE'; payload: Gesture }
  | { type: 'UPDATE_GESTURE'; payload: Gesture }
  | { type: 'DELETE_GESTURE'; payload: string }
  | { type: 'ADD_DETECTION'; payload: Detection }
  | { type: 'CLEAR_DETECTIONS' }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<SystemStatus> }
  | { type: 'UPDATE_TRAINING_STATE'; payload: Partial<TrainingState> }
  | { type: 'SELECT_GESTURE'; payload: string | undefined }
  | { type: 'OPEN_MODAL'; payload: { type: ModalType; data?: Record<string, unknown> } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_NEEDS_RETRAIN'; payload: boolean }
  | { type: 'UPDATE_GESTURE_ACTION'; payload: { id: string; action: string } }
  | { type: 'RESET_STATE' };

export const initialState: AppState = {
  gestures: [],
  detections: [],
  systemStatus: {
    camera: 'on',
    model: 'loading',
    detectionActive: false,
    fps: 0,
    wsConnected: false,
    cursorMode: false,
  },
  trainingState: {
    inProgress: false,
    progress: 0,
  },
  modalState: {
    type: null,
  },
  selectedGestureId: undefined,
  needsRetrain: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_GESTURES':
      return { ...state, gestures: action.payload };

    case 'ADD_GESTURE':
      return {
        ...state,
        gestures: [...state.gestures, action.payload],
        needsRetrain: true,
      };

    case 'UPDATE_GESTURE':
      return {
        ...state,
        gestures: state.gestures.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };

    case 'UPDATE_GESTURE_ACTION':
      return {
        ...state,
        gestures: state.gestures.map((g) =>
          g.id === action.payload.id ? { ...g, action: action.payload.action } : g
        ),
      };

    case 'DELETE_GESTURE':
      return {
        ...state,
        gestures: state.gestures.filter((g) => g.id !== action.payload),
        selectedGestureId:
          state.selectedGestureId === action.payload
            ? undefined
            : state.selectedGestureId,
        needsRetrain: true,
      };

    case 'ADD_DETECTION': {
      const newDetections = [action.payload, ...state.detections].slice(0, 20);
      return { ...state, detections: newDetections };
    }

    case 'CLEAR_DETECTIONS':
      return { ...state, detections: [] };

    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: { ...state.systemStatus, ...action.payload },
      };

    case 'UPDATE_TRAINING_STATE':
      return {
        ...state,
        trainingState: { ...state.trainingState, ...action.payload },
      };

    case 'SELECT_GESTURE':
      return { ...state, selectedGestureId: action.payload };

    case 'OPEN_MODAL':
      return {
        ...state,
        modalState: { type: action.payload.type, data: action.payload.data },
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        modalState: { type: null },
      };

    case 'SET_NEEDS_RETRAIN':
      return { ...state, needsRetrain: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}
