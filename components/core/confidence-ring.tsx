'use client';

import { motion } from 'framer-motion';

interface ConfidenceRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export function ConfidenceRing({
  value,
  size = 120,
  strokeWidth = 8,
}: ConfidenceRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let color = '#5723E7'; 
  if (value >= 75) color = '#5723E7'; 
  else if (value >= 50) color = '#7c3aed'; 
  else if (value >= 25) color = '#8b5cf6'; 

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          { }
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />

          { }
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </motion.svg>

        { }
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-xl font-semibold text-white">
              {Math.round(value)}%
            </div>
            <div className="text-xs text-white">confidence</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
