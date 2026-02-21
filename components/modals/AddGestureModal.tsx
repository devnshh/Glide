'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Video, Circle, StopCircle } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { API_URL, WS_URL } from '@/lib/config';
import { GlassCard } from '../core/glass-card';
import { Button } from '@/components/ui/button';
import { ConfidenceRing } from '../core/confidence-ring';
import { CameraFeed } from '@/components/live-feed/camera-feed';

const AVAILABLE_ACTIONS = [
  { id: 'None', label: 'No Action', icon: '🚫', shortcut: '-' },
  { id: 'switch_tab', label: 'Switch Tab', icon: '🔄', shortcut: 'Alt+Tab' },
  { id: 'play_pause', label: 'Play / Pause', icon: '⏯️', shortcut: 'Space' },
  { id: 'volume_up', label: 'Volume Up', icon: '🔊', shortcut: 'Vol+' },
  { id: 'volume_down', label: 'Volume Down', icon: '🔉', shortcut: 'Vol-' },
  { id: 'mute', label: 'Mute', icon: '🔇', shortcut: 'M' },
  { id: 'next_track', label: 'Next Track', icon: '⏭️', shortcut: 'Ctrl+Right' },
  { id: 'prev_track', label: 'Previous Track', icon: '⏮️', shortcut: 'Ctrl+Left' },
  { id: 'screenshot', label: 'Screenshot', icon: '📸', shortcut: 'PrtScr' },
  { id: 'scroll_up', label: 'Scroll Up', icon: '⬆️', shortcut: 'ScrollUp' },
  { id: 'scroll_down', label: 'Scroll Down', icon: '⬇️', shortcut: 'ScrollDown' },
  { id: 'brightness_up', label: 'Brightness Up', icon: '☀️', shortcut: 'Bright+' },
  { id: 'brightness_down', label: 'Brightness Down', icon: '🌙', shortcut: 'Bright-' },
  { id: 'toggle_cursor', label: 'Toggle Cursor Mode', icon: '🖱️', shortcut: 'Gesture' },
  { id: 'switch_desktop_left', label: 'Desktop Left', icon: '⬅️', shortcut: 'Ctrl+←' },
  { id: 'switch_desktop_right', label: 'Desktop Right', icon: '➡️', shortcut: 'Ctrl+→' },
];

const GESTURE_EMOJIS = ['👋', '✌️', '👍', '👎', '🤞', '🤟', '🖐️', '👈', '👉', '☝️', '👆', '🤘'];

const STEP_LABELS = ['Name', 'Action', 'Record', 'Confirm'];

export function AddGestureModal() {
  const { state, dispatch, updateSystemStatus } = useApp();
  const isOpen = state.modalState.type === 'addGesture';
  const wasDetectionActiveRef = useRef(false);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👋');
  const [selectedAction, setSelectedAction] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [targetSamples, setTargetSamples] = useState(30);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const gestureId = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_') || 'unknown';

  useEffect(() => {
    if (!isRecording) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'training' && msg.data.gestureId === gestureId) {
          setSampleCount(msg.data.sampleCount);
          if (msg.data.sampleCount >= msg.data.target) {
            setIsRecording(false);
            setRecordingComplete(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const ws = new WebSocket(WS_URL);
    ws.onmessage = handleMessage;

    return () => {
      ws.close();
    };
  }, [isRecording, gestureId]);

  // Pause detection when modal opens
  useEffect(() => {
    if (isOpen) {
      wasDetectionActiveRef.current = state.systemStatus.detectionActive;
      if (state.systemStatus.detectionActive) {
        updateSystemStatus({ detectionActive: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL' });
    // Re-enable detection if it was active before
    if (wasDetectionActiveRef.current) {
      updateSystemStatus({ detectionActive: true });
    }
    setTimeout(() => {
      setStep(1);
      setName('');
      setEmoji('👋');
      setSelectedAction('');
      setIsRecording(false);
      setSampleCount(0);
      setRecordingComplete(false);
    }, 300);
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSampleCount(0);

    try {
      await fetch(`${API_URL}/train/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gestureId, numSamples: targetSamples })
      });

      await fetch(`${API_URL}/train/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gestureId, numSamples: targetSamples })
      });

    } catch (e) {
      console.error("Failed to start recording", e);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {

    setIsRecording(false);
    if (sampleCount >= 10) {
      setRecordingComplete(true);
    }
  };

  const handleConfirm = async () => {
    const actionLabel = AVAILABLE_ACTIONS.find(a => a.id === selectedAction)?.label || selectedAction;
    const newGesture = {
      id: gestureId,
      name,
      emoji,
      action: selectedAction,
      sampleCount,
      confidence: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await fetch(`${API_URL}/gestures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGesture)
      });

      dispatch({
        type: 'ADD_GESTURE',
        payload: { ...newGesture, action: selectedAction }
      });
      handleClose();
    } catch (e) {
      console.error("Failed to save gesture", e);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return selectedAction !== '';
      case 3: return recordingComplete || sampleCount >= 10;
      case 4: return true;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        { }
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        { }
        <motion.div
          className="relative w-full max-w-xl glass-card border border-white/15 rounded-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          { }
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Add New Gesture</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of 4 — {STEP_LABELS[step - 1]}
              </p>
            </div>
            <motion.button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-smooth"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>

          { }
          <div className="px-6 py-3 flex items-center gap-2">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                    initial={{ width: '0%' }}
                    animate={{ width: i < step ? '100%' : i === step - 1 ? '50%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          { }
          <div className="p-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              { }
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Gesture Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Swipe Left, Peace Sign..."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-smooth"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Choose an Emoji
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {GESTURE_EMOJIS.map((e) => (
                        <motion.button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className={`p-3 rounded-lg text-2xl text-center transition-smooth ${emoji === e
                            ? 'bg-indigo-500/30 border border-indigo-500/50 ring-2 ring-indigo-500/30'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {e}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              { }
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Select the desktop action this gesture will trigger:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                    {AVAILABLE_ACTIONS.map((action) => (
                      <motion.button
                        key={action.id}
                        onClick={() => setSelectedAction(action.id)}
                        className={`p-3 rounded-lg flex items-center gap-3 text-left transition-smooth ${selectedAction === action.id
                          ? 'bg-indigo-500/30 border border-indigo-500/50 ring-1 ring-indigo-500/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl">{action.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {action.label}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {action.shortcut}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              { }
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Perform the gesture in front of your camera.
                    </p>

                    { }
                    {!isRecording && !recordingComplete && (
                      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        {[30, 50, 100].map((count) => (
                          <button
                            key={count}
                            onClick={() => setTargetSamples(count)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${targetSamples === count
                              ? 'bg-indigo-500 text-white shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                              }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  { }
                  <div className="relative aspect-video rounded-lg border border-white/10 overflow-hidden bg-black">
                    <CameraFeed key={`modal-cam-${step}`} className="w-full h-full" />

                    { }
                    {isRecording && (
                      <div className="absolute inset-0 border-4 border-red-500/50 animate-pulse pointer-events-none" />
                    )}
                  </div>

                  { }
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Samples collected</span>
                      <span className="font-mono text-cyan-400">{sampleCount} / {targetSamples}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        animate={{ width: `${Math.min((sampleCount / targetSamples) * 100, 100)}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>

                  { }
                  <div className="flex gap-3">
                    {!isRecording && !recordingComplete && (
                      <Button
                        onClick={handleStartRecording}
                        className="flex-1 h-12 bg-red-600 hover:bg-red-700"
                      >
                        <Circle className="w-4 h-4 mr-2 fill-current" />
                        Start Recording
                      </Button>
                    )}
                    {isRecording && (
                      <Button
                        onClick={handleStopRecording}
                        className="flex-1 h-12 bg-slate-700 hover:bg-slate-600"
                      >
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Recording ({sampleCount} samples)
                      </Button>
                    )}
                    {recordingComplete && (
                      <motion.div
                        className="flex-1 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2 text-emerald-400 font-medium"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <Check className="w-5 h-5" />
                        {sampleCount} samples captured
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              { }
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-6 py-4"
                >
                  { }
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Check className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                  </motion.div>

                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">Ready to save!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review your gesture details below
                    </p>
                  </div>

                  { }
                  <div className="w-full glass-card border border-white/15 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{emoji}</span>
                      <div>
                        <p className="font-semibold text-foreground">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          {AVAILABLE_ACTIONS.find(a => a.id === selectedAction)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full font-mono">
                        {sampleCount} samples
                      </div>
                      <div className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full font-mono">
                        {AVAILABLE_ACTIONS.find(a => a.id === selectedAction)?.shortcut}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-amber-400/80 text-center">
                    💡 After saving, retrain the model to include this gesture
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          { }
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <Button
              onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Gesture
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
