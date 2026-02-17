'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useApp } from '@/lib/app-context';
import { GlassCard } from '../core/glass-card';

export function ActivityFeed() {
  const { state } = useApp();

  if (state.detections.length === 0) {
    return (
      <GlassCard className="p-8 flex flex-col items-center justify-center gap-3 min-h-[300px] h-full">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center text-4xl">
          👋
        </div>
        <div className="text-center">
          <p className="font-semibold">No detections yet</p>
          <p className="text-sm text-muted-foreground">
            Perform a gesture in front of your camera to see activity
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 flex flex-col gap-4 h-full">
      <div>
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">
          Last {state.detections.length} detections
        </p>
      </div>

      { }
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {state.detections.map((detection, index) => (
            <motion.div
              key={detection.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-smooth"
            >
              { }
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-foreground">
                {index + 1}
              </div>

              { }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{detection.gestureName}</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                    {Math.round(detection.confidence * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Action: {detection.action}
                </p>
              </div>

              { }
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {format(detection.timestamp, 'HH:mm:ss')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
