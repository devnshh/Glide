'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MagicBentoCard } from '../ui/magic-bento';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: { direction: 'up' | 'down'; value: number };
}

export function StatCard({
  icon,
  label,
  value,
  suffix,
  trend,
}: StatCardProps) {
  return (
    <MagicBentoCard className="p-4 flex flex-col gap-3 h-full" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
      {/* Icon */}
      <motion.div
        className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-indigo-400"
        whileHover={{ scale: 1.1 }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <motion.div
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {value}
          </motion.div>
          {suffix && (
            <span className="text-sm text-muted-foreground">{suffix}</span>
          )}
        </div>

        {/* Trend */}
        {trend && (
          <div
            className={`text-xs font-medium ${trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}% this week
          </div>
        )}
      </div>
    </MagicBentoCard>
  );
}
