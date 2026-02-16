'use client'

import { motion } from 'framer-motion'

interface ConfidenceRingProps {
  confidence: number
  size?: number
  strokeWidth?: number
}

export function ConfidenceRing({
  confidence,
  size = 120,
  strokeWidth = 4,
}: ConfidenceRingProps) {
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - confidence)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#confidence-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="confidence-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" />
            <stop offset="100%" stopColor="rgb(0, 188, 212)" />
          </linearGradient>
        </defs>
      </motion.svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-cyan-400">
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </div>
  )
}
