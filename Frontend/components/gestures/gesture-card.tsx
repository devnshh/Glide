'use client';

import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import { GlassCard } from '../core/glass-card';
import { Gesture } from '@/lib/types';

interface GestureCardProps {
  gesture: Gesture;
  onEdit?: (gesture: Gesture) => void;
  onDelete?: (id: string) => void;
  delay?: number;
}

export function GestureCard({
  gesture,
  onEdit,
  onDelete,
  delay = 0,
}: GestureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard className="p-6 h-full flex flex-col gap-4 group">
        {}
        <div className="flex items-start justify-between">
          <div className="text-4xl">{gesture.emoji}</div>
          <motion.div
            className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          >
            {onEdit && (
              <motion.button
                onClick={() => onEdit(gesture)}
                className="p-2 rounded-lg bg-white/10 hover:bg-indigo-500/30 text-indigo-400 transition-smooth"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={() => onDelete(gesture.id)}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-red-400 transition-smooth"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </div>

        {}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            {gesture.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{gesture.action}</p>

          {}
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full font-mono">
              {gesture.sampleCount} samples
            </div>
          </div>

          {}
          {gesture.confidence !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="text-cyan-400 font-mono">
                  {Math.round(gesture.confidence * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${gesture.confidence * 100}%` }}
                  transition={{ duration: 0.6, delay: delay * 0.1 }}
                />
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
