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
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
          <span className="text-4xl animate-pulse">👁️</span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Waiting for gesture</p>
          <p className="text-xs text-muted-foreground mt-2">
            {state.systemStatus.detectionActive
              ? 'Perform a gesture in front of your camera'
              : 'Start detection to begin'}
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 flex flex-col gap-6 h-full">
      {}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Current Detection</p>
        <h2 className="text-2xl font-bold text-foreground">
          {currentDetection.gestureName}
        </h2>
      </div>

      {}
      <div className="flex justify-center">
        <ConfidenceRing
          value={Math.round(currentDetection.confidence * 100)}
          size={140}
          strokeWidth={10}
        />
      </div>

      {}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Mapped Action</p>
        <motion.div
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg p-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold text-white">{currentDetection.action}</p>
        </motion.div>
      </div>

      {}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Detected at</p>
        <p className="font-mono text-sm text-cyan-400">
          {new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
          }).format(currentDetection.timestamp)}
        </p>
      </div>

      {}
      <div className="space-y-2 flex-1 min-h-0">
        <p className="text-xs text-muted-foreground">Recent detections</p>
        <div className="space-y-1 h-[240px] overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {state.detections.slice(0, 10).map((detection, index) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <span className="text-foreground">{detection.gestureName}</span>
                <span className="text-cyan-400 font-mono">
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
