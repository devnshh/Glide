'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { GlassCard } from '../core/glass-card';
import { ConfidenceRing } from '../core/confidence-ring';

export function DetectionPanel() {
  const { state } = useApp();

  const currentDetection = state.detections[0];

  if (!currentDetection) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center gap-4 h-full min-h-[600px]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#301088] to-[#5723E7] flex items-center justify-center shadow-lg shadow-[#5723E7]/20 border border-white/10">
          <span className="text-4xl animate-pulse">👁️</span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">Waiting for gesture</p>
          <p className="text-xs text-white mt-2">
            {state.systemStatus.detectionActive
              ? 'Perform a gesture in front of your camera'
              : 'Start detection to begin'}
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 flex flex-col gap-6 h-full min-h-[600px]">
      { }
      <div>
        <p className="text-xs text-white mb-3">Current Detection</p>
        <h2 className="text-2xl font-bold text-white">
          {currentDetection.gestureName}
        </h2>
      </div>

      { }
      <div className="flex justify-center">
        <ConfidenceRing
          value={Math.round(currentDetection.confidence * 100)}
          size={140}
          strokeWidth={10}
        />
      </div>

      { }
      <div className="space-y-2">
        <p className="text-xs text-white">Mapped Action</p>
        <motion.div
          className="w-full bg-gradient-to-r from-[#301088] to-[#5723E7] rounded-lg p-4 text-center shadow-lg shadow-[#5723E7]/20 border border-white/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold text-white">{currentDetection.action}</p>
        </motion.div>
      </div>

      { }
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        <p className="text-xs text-white">Recent detections</p>
        <div className="space-y-1 flex-1 overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {state.detections.slice(0, 10).map((detection, index) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <span className="text-white">{detection.gestureName}</span>
                <span className="text-white font-mono">
                  {Math.round(detection.confidence * 100)}%
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
