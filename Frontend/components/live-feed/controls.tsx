'use client';

import { motion } from 'framer-motion';
import { Play, Square, Camera, CameraOff } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { GlassCard } from '../core/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';

export function LiveFeedControls() {
  const { state, updateSystemStatus } = useApp();

  const [localThreshold, setLocalThreshold] = useState([75]);

  useEffect(() => {
    if (state.systemStatus.confidenceThreshold !== undefined) {
      setLocalThreshold([state.systemStatus.confidenceThreshold]);
    }
  }, [state.systemStatus.confidenceThreshold]);

  const handleThresholdChange = async (value: number[]) => {
    setLocalThreshold(value);
    await updateSystemStatus({ confidenceThreshold: value[0] });
  };

  const toggleDetection = async () => {
    const newStatus = !state.systemStatus.detectionActive;
    await updateSystemStatus({ detectionActive: newStatus });
  };

  const toggleCamera = async () => {
    const newStatus = state.systemStatus.camera === 'on' ? 'off' : 'on';
    await updateSystemStatus({ camera: newStatus });
  };

  return (
    <GlassCard className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {/* Detection Toggle */}
      <motion.div
        className="flex-1"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={toggleDetection}
          className={`w-full h-12 justify-between transition-all duration-300 text-white bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10`}
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

      {/* Camera Toggle */}
      <motion.div
        className="flex-1"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={toggleCamera}
          className={`w-full h-12 justify-center transition-all duration-300 text-white bg-gradient-to-r from-[#301088] to-[#5723E7] hover:brightness-110 shadow-lg shadow-[#5723E7]/20 border border-white/10`}
        >
          <span className="flex items-center gap-2 text-white">
            {state.systemStatus.camera === 'on' ? (
              <>
                <Camera className="w-4 h-4 text-white" />
                Camera On
              </>
            ) : (
              <>
                <CameraOff className="w-4 h-4 text-white" />
                Camera Off
              </>
            )}
          </span>
        </Button>
      </motion.div>

      { }
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-40 min-w-[200px]">
          <span className="text-xs text-white whitespace-nowrap min-w-[3.5rem]">
            Conf: {localThreshold}%
          </span>
          <Slider
            defaultValue={[75]}
            max={100}
            min={10}
            step={5}
            value={localThreshold}
            onValueChange={handleThresholdChange}
            className="w-full flex-1"
          />
        </div>
        <div className="glass-sm px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap self-end sm:self-auto">
          <span className="text-xs text-white">FPS:</span>
          <span className="font-mono text-sm font-semibold text-white">
            {state.systemStatus.fps}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
