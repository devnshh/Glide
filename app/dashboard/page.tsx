'use client';

import { AppShell } from '@/components/app-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { SystemHealthBar } from '@/components/dashboard/system-health-bar';
import { SpeedControl } from '@/components/dashboard/speed-control';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Wand2, Activity, TrendingUp, Zap } from 'lucide-react';
import { MagicBentoGrid } from '@/components/ui/magic-bento';

export default function DashboardPage() {
  const { state } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AppShell>
      <motion.div
        className="px-4 sm:px-6 py-4 max-w-7xl mx-auto overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        { }
        <motion.div variants={itemVariants} className="mb-3 -ml-[3px]">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
        </motion.div>

        { }
        <MagicBentoGrid>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<Wand2 className="w-5 h-5" />}
                label="Total Gestures"
                value={state.gestures.length}
                trend={{ direction: 'up', value: 12 }}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                label="Detections (24h)"
                value="324"
                trend={{ direction: 'up', value: 8 }}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Accuracy"
                value="94.2"
                suffix="%"
                trend={{ direction: 'up', value: 2 }}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={<Zap className="w-5 h-5" />}
                label="Model Status"
                value={state.systemStatus.model === 'ready' ? 'Ready' : 'Loading'}
                trend={undefined}
              />
            </motion.div>
          </motion.div>
        </MagicBentoGrid>

        { }
        <MagicBentoGrid>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
          >
            {}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <ActivityFeed />
            </motion.div>

            {}
            <motion.div variants={itemVariants}>
              <QuickActions />
            </motion.div>
          </motion.div>

          {}
          <motion.div variants={itemVariants} className="space-y-3">
            <SystemHealthBar />
            <SpeedControl />
          </motion.div>
        </MagicBentoGrid>
      </motion.div>
    </AppShell>
  );
}
