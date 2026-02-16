'use client'

import { motion } from 'framer-motion'
import { Wifi, Camera, Zap, Activity } from 'lucide-react'

interface HealthStatus {
  name: string
  icon: typeof Wifi
  isActive: boolean
}

interface SystemHealthBarProps {
  statuses: HealthStatus[]
}

export function SystemHealthBar({ statuses }: SystemHealthBarProps) {
  return (
    <div className="glass-card rounded-lg border border-white/15 p-4 flex flex-wrap gap-4">
      {statuses.map((status, idx) => {
        const Icon = status.icon
        return (
          <motion.div
            key={status.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${
              status.isActive
                ? 'bg-emerald-500 animate-pulse-glow'
                : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium text-muted-foreground">
              {status.name}
            </span>
            <Icon className={`w-4 h-4 ${
              status.isActive ? 'text-emerald-400' : 'text-red-400'
            }`} />
          </motion.div>
        )
      })}
    </div>
  )
}
