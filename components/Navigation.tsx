'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Activity, Zap, Video, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  const pathname = usePathname()

  const routes = [
    { href: '/', icon: BarChart3, label: 'Dashboard' },
    { href: '/gestures', icon: Zap, label: 'Gestures' },
    { href: '/live', icon: Video, label: 'Live Feed' },
    { href: '/activity', icon: Activity, label: 'Activity' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass-lg border-b border-white/10 z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        { }
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg overflow-hidden"
          >
            <Image src="/logo.jpeg" alt="Glide Logo" width={32} height={32} className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-bold text-lg text-white hidden sm:inline">
            Glide
          </span>
        </Link>

        { }
        <div className="flex items-center gap-1">
          {routes.map((route) => {
            const isActive = pathname === route.href
            const Icon = route.icon

            return (
              <motion.div
                key={route.href}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  href={route.href}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 smooth-transition ${isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {route.label}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        { }
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow" />
          <span className="text-xs text-emerald-400 hidden sm:inline">
            Online
          </span>
        </motion.div>
      </div>
    </nav>
  )
}
