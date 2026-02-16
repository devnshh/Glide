'use client';

import { AppShell } from '@/components/app-shell';
import { CameraFeed } from '@/components/live-feed/camera-feed';
import { DetectionPanel } from '@/components/live-feed/detection-panel';
import { LiveFeedControls } from '@/components/live-feed/controls';
import { motion } from 'framer-motion';

export default function LiveFeedPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
        className="px-4 sm:px-6 py-8 max-w-7xl mx-auto h-full flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Live Feed
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time gesture detection and recognition
          </p>
        </motion.div>

        {}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px] items-start"
        >
          {}
          <div className="lg:col-span-2 flex flex-col h-full relative">
            <div className="absolute inset-0">
              <CameraFeed className="h-full w-full" />
            </div>
          </div>

          {}
          <div className="flex flex-col h-full">
            <DetectionPanel />
          </div>
        </motion.div>

        {}
        <motion.div variants={itemVariants}>
          <LiveFeedControls />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
