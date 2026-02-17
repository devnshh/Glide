'use client'

import { motion } from 'framer-motion'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
}

const variantConfig = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/50',
  secondary:
    'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/30 border border-cyan-500/50',
  outline:
    'bg-transparent border border-white/20 text-foreground hover:bg-white/10 hover:border-white/40',
  ghost:
    'bg-transparent text-foreground hover:bg-white/5 border border-transparent',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 border border-red-500/50',
}

const sizeConfig = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      fullWidth = false,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium
          smooth-transition disabled:opacity-50 disabled:cursor-not-allowed
          ${variantConfig[variant]}
          ${sizeConfig[size]}
          ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
      >
        {loading && (
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            width={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
            height={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36" />
          </motion.svg>
        )}
        {icon && !loading && icon}
        {children}
      </motion.button>
    )
  }
)

ActionButton.displayName = 'ActionButton'
