'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'error' | 'warning' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<StatusType, string> = {
  active: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  idle: 'bg-gray-500',
};

const labelColors: Record<StatusType, string> = {
  active: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  idle: 'text-gray-400',
};

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusIndicator({
  status,
  label,
  pulse = false,
  size = 'md',
}: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn(
          'rounded-full',
          sizeMap[size],
          statusColors[status],
          pulse && 'animate-pulse-ring'
        )}
        animate={pulse && status === 'active' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className={cn('text-xs font-medium', labelColors[status])}>
        {label}
      </span>
    </div>
  );
}
