'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  label: string
  value: number
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber'
  showPercentage?: boolean
}

const colorMap = {
  indigo: 'from-indigo-500 to-indigo-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
}

export function ProgressBar({
  label,
  value,
  color = 'indigo',
  showPercentage = true,
}: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-muted-foreground">{label}</label>
        {showPercentage && (
          <span className="text-sm font-semibold text-indigo-400">{value}%</span>
        )}
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorMap[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
