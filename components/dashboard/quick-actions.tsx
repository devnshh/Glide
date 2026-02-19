'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Plus, Camera } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { MagicBentoCard } from '../ui/magic-bento';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function QuickActions() {
  const { state, dispatch } = useApp();
  const [localThreshold, setLocalThreshold] = useState([80]);

  useEffect(() => {
    if (state.systemStatus.confidenceThreshold !== undefined) {
      setLocalThreshold([state.systemStatus.confidenceThreshold]);
    }
  }, [state.systemStatus.confidenceThreshold]);

  const handleThresholdChange = async (value: number[]) => {
    setLocalThreshold(value);
    try {
      await fetch('http://localhost:8053/system/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confidenceThreshold: value[0] })
      });
    } catch (e) {
      console.error("Failed to update threshold", e);
    }
  };

  const toggleDetection = () => {

    const newStatus = !state.systemStatus.detectionActive;
    fetch('http://localhost:8053/system/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detectionActive: newStatus })
    }).catch(console.error);

    dispatch({
      type: 'UPDATE_SYSTEM_STATUS',
      payload: {
        detectionActive: newStatus,
      },
    });
  };

  const toggleCamera = () => {
    const newStatus = state.systemStatus.camera === 'on' ? 'off' : 'on';
    fetch('http://localhost:8053/system/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ camera: newStatus })
    }).catch(console.error);

    dispatch({
      type: 'UPDATE_SYSTEM_STATUS',
      payload: { camera: newStatus },
    });
  };

  const startTraining = () => {

    dispatch({
      type: 'UPDATE_TRAINING_STATE',
      payload: { inProgress: true, progress: 0 },
    });

  };

  return (
    <MagicBentoCard className="p-4 flex flex-col gap-3" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
      <h3 className="font-semibold text-foreground">Quick Actions</h3>

      { }

      { }
      { }
      { }
      { }
      { }

      <motion.div
        className="space-y-2"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        animate="visible"
      >
        { }
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={toggleDetection}
            className={`w-full justify-between h-9 transition-all duration-300 text-white ${state.systemStatus.detectionActive
              ? 'bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10'
              : 'bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm'
              }`}
          >
            <span className="flex items-center gap-2 text-white">
              {state.systemStatus.detectionActive ? (
                <>
                  <Square className="w-4 h-4 text-white" />
                  Stop Detection
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white" />
                  Start Detection
                </>
              )}
            </span>
            {state.systemStatus.detectionActive && (
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </Button>
        </motion.div>

        { }
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() =>
              dispatch({ type: 'OPEN_MODAL', payload: { type: 'retrain' } })
            }
            disabled={state.trainingState.inProgress}
            className="w-full justify-between h-9 bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10 disabled:opacity-50 text-white"
          >
            <span className="flex items-center gap-2 text-white">
              <RotateCcw className="w-4 h-4 text-white" />
              {state.trainingState.inProgress
                ? `Retraining... ${state.trainingState.progress}%`
                : 'Retrain Model'}
            </span>
          </Button>
        </motion.div>

        { }
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() =>
              dispatch({
                type: 'OPEN_MODAL',
                payload: { type: 'addGesture' },
              })
            }
            className="w-full justify-between h-9 bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10 text-white"
          >
            <span className="flex items-center gap-2 text-white">
              <Plus className="w-4 h-4 text-white" />
              Add Gesture
            </span>
          </Button>
        </motion.div>

        { }
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={toggleCamera}
            className={`w-full justify-between h-9 transition-all duration-300 text-white ${state.systemStatus.camera === 'on'
              ? 'bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10'
              : 'bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm'
              }`}
          >
            <span className="flex items-center gap-2 text-white">
              <Camera className="w-4 h-4 text-white" />
              {state.systemStatus.camera === 'on'
                ? 'Camera On'
                : 'Camera Off'}
            </span>
          </Button>
        </motion.div>

        { }
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[3.5rem]">
              Conf: {localThreshold}%
            </span>
            <Slider
              defaultValue={[80]}
              max={100}
              min={10}
              step={5}
              value={localThreshold}
              onValueChange={handleThresholdChange}
              className="w-full"
            />
          </div>
        </motion.div>

      </motion.div>
    </MagicBentoCard>
  );
}
