'use client';

import { motion } from 'framer-motion';
import { Camera, Brain, Activity, Radio, MousePointer } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { useWebSocket } from '@/lib/websocket-context';
import { GlassCard } from '../core/glass-card';

export function SystemHealthBar() {
  const { state } = useApp();
  const { isConnected } = useWebSocket();

  const healthItems = [
    {
      icon: Camera,
      label: 'Camera',
      status: state.systemStatus.camera === 'on' ? 'active' : 'error',
    },
    {
      icon: Brain,
      label: 'Model',
      status: state.systemStatus.model === 'ready' ? 'active' : 'idle',
    },
    {
      icon: Activity,
      label: 'Detection',
      status: state.systemStatus.detectionActive ? 'active' : 'idle',
    },
    {
      icon: Radio,
      label: 'Connection',
      status: isConnected ? 'active' : 'error',
    },
    {
      icon: MousePointer,
      label: 'Cursor Mode',
      status: state.systemStatus.cursorMode ? 'active' : 'idle',
    },
  ];

  return (
    <GlassCard className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {healthItems.map((item, index) => {
          const Icon = item.icon;
          const statusColor = {
            active: 'from-emerald-500 to-emerald-600',
            error: 'from-red-500 to-red-600',
            idle: 'from-gray-500 to-gray-600',
          }[item.status];

          const dotColor = {
            active: 'bg-emerald-500',
            error: 'bg-red-500',
            idle: 'bg-gray-500',
          }[item.status];

          return (
            <motion.div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-smooth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              { }
              <div className={`p-2 rounded-lg bg-gradient-to-br ${statusColor}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>

              { }
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${dotColor}`}
                    animate={
                      item.status === 'active'
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-foreground capitalize">
                    {item.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
