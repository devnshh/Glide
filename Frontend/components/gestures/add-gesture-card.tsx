'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { GlassCard } from '../core/glass-card';

interface AddGestureCardProps {
  onClick?: () => void;
  delay?: number;
}

export function AddGestureCard({ onClick, delay = 0 }: AddGestureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <motion.button
        onClick={onClick}
        className="w-full h-full"
        whileTap={{ scale: 0.98 }}
      >
        <GlassCard className="p-6 h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/20 hover:border-cyan-500/50 transition-smooth cursor-pointer">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Plus className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Add Gesture</p>
            <p className="text-xs text-muted-foreground">
              Create a new gesture
            </p>
          </div>
        </GlassCard>
      </motion.button>
    </motion.div>
  );
}
