'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  color: 'indigo' | 'cyan' | 'emerald' | 'amber'
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-500/10',
    icon: 'text-indigo-400',
    border: 'border-indigo-500/20',
    glow: 'glow-primary',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    icon: 'text-cyan-400',
    border: 'border-cyan-500/20',
    glow: 'glow-secondary',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-lg shadow-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-lg shadow-amber-500/20',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  const styles = colorMap[color]

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card ${styles.glow} group cursor-pointer p-6 rounded-xl border ${styles.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {trend !== undefined && (
            <p
              className={`text-xs mt-2 ${
                trend > 0
                  ? 'text-emerald-400'
                  : trend < 0
                    ? 'text-red-400'
                    : 'text-muted-foreground'
              }`}
            >
              {trend > 0 ? '+' : ''}{trend}% from yesterday
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.bg} group-hover:scale-110 smooth-transition`}
        >
          <Icon className={`w-6 h-6 ${styles.icon}`} />
        </div>
      </div>
    </motion.div>
  )
}
