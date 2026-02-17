'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Wand2, Video } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { useWebSocket } from '@/lib/websocket-context';
import { StatusIndicator } from './core/status-indicator';
import { cn } from '@/lib/utils';
import { ModalManager } from './modals/modal-manager';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/gestures', label: 'Gestures', icon: Wand2 },
  { href: '/live-feed', label: 'Live Feed', icon: Video },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const { isConnected } = useWebSocket();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      { }
      <header className="glass-sm border-b sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          { }
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-foreground font-bold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GD
            </motion.div>
            <div>
              <h1 className="text-base font-semibold">Glide</h1>
              <p className="text-xs text-muted-foreground">Real-time Control</p>
            </div>
          </div>

          { }
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-smooth relative',
                      isActive
                        ? 'text-primary font-medium bg-white/5'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          { }
          <div className="flex items-center gap-4">
            { }
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <StatusIndicator
                status={state.systemStatus.camera === 'on' ? 'active' : 'error'}
                label="Camera"
                pulse={state.systemStatus.camera === 'on'}
              />
              <div className="w-px h-4 bg-white/10" />
              <StatusIndicator
                status={state.systemStatus.model === 'ready' ? 'active' : 'idle'}
                label="Model"
                pulse={state.systemStatus.model === 'ready'}
              />
              <div className="w-px h-4 bg-white/10" />
              <StatusIndicator
                status={isConnected ? 'active' : 'error'}
                label="Connected"
                pulse={isConnected}
              />
            </div>

            { }
            <div className="font-mono text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg">
              {state.systemStatus.fps} FPS
            </div>
          </div>
        </div>

        { }
        <div className="md:hidden px-2 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    'px-3 py-1.5 rounded-md flex items-center gap-2 text-xs whitespace-nowrap transition-smooth',
                    isActive
                      ? 'text-primary font-medium bg-white/5'
                      : 'text-muted-foreground'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </header>

      { }
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      { }
      <ModalManager />
    </div>
  );
}
