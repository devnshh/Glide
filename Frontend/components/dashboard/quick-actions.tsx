'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Plus, Camera } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { GlassCard } from '../core/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function QuickActions() {
  const { state, dispatch } = useApp();
  const [localThreshold, setLocalThreshold] = useState([75]);

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
    <GlassCard className="p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-foreground">Quick Actions</h3>

      {}

      {}
      {}
      {}
      {}
      {}

      <motion.div
        className="space-y-2"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        animate="visible"
      >
        {}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Button
            onClick={toggleDetection}
            className={`w-full justify-between h-12 transition-smooth ${state.systemStatus.detectionActive
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-slate-700 hover:bg-slate-600'
              }`}
          >
            <span className="flex items-center gap-2">
              {state.systemStatus.detectionActive ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Detection
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
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

        {}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Button
            onClick={() =>
              dispatch({ type: 'OPEN_MODAL', payload: { type: 'retrain' } })
            }
            disabled={state.trainingState.inProgress}
            className="w-full justify-between h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {state.trainingState.inProgress
                ? `Retraining... ${state.trainingState.progress}%`
                : 'Retrain Model'}
            </span>
          </Button>
        </motion.div>

        {}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Button
            onClick={() =>
              dispatch({
                type: 'OPEN_MODAL',
                payload: { type: 'addGesture' },
              })
            }
            className="w-full justify-between h-12 bg-cyan-600 hover:bg-cyan-700"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Gesture
            </span>
          </Button>
        </motion.div>

        {}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Button
            onClick={toggleCamera}
            className={`w-full justify-between h-12 transition-smooth ${state.systemStatus.camera === 'on'
              ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {state.systemStatus.camera === 'on'
                ? 'Camera On'
                : 'Camera Off'}
            </span>
          </Button>
        </motion.div>

        {}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[3.5rem]">
              Conf: {localThreshold}%
            </span>
            <Slider
              defaultValue={[75]}
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
    </GlassCard>
  );
}
