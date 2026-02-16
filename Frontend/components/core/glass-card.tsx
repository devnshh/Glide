'use client';

import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  hover?: boolean;
  glowIntensity?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlassCard({
  children,
  hover = true,
  glowIntensity = 'sm',
  className,
  ...motionProps
}: GlassCardProps) {
  const glowClasses = {
    sm: 'hover:glow-indigo',
    md: 'hover:glow-indigo-lg',
    lg: 'hover:shadow-2xl hover:shadow-indigo-500/50',
  };

  return (
    <motion.div
      className={cn(
        'glass-lg transition-smooth',
        hover && glowClasses[glowIntensity],
        className
      )}
      whileHover={hover ? { y: -2 } : {}}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
