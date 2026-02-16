'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

type Status = 'success' | 'warning' | 'pending' | 'error'

interface StatusBadgeProps {
  status: Status
  label: string
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle2,
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: AlertCircle,
  },
  pending: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: Clock,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertCircle,
  },
}

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function StatusBadge({
  status,
  label,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const sizeClass = sizeConfig[size]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border ${config.bg} ${config.border} ${sizeClass}`}
    >
      <Icon className={`w-4 h-4 ${config.text}`} />
      <span className={`font-medium ${config.text}`}>{label}</span>
    </motion.div>
  )
}
