'use client';

import { AppShell } from '@/components/app-shell';
import { CameraFeed } from '@/components/live-feed/camera-feed';
import { DetectionPanel } from '@/components/live-feed/detection-panel';
import { LiveFeedControls } from '@/components/live-feed/controls';
import { motion } from 'framer-motion';
import { MagicBentoCard, MagicBentoGrid } from '@/components/ui/magic-bento';

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
        { }
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Live Feed
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time gesture detection and recognition
          </p>
        </motion.div>

        { }
        <MagicBentoGrid>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[680px] items-stretch overflow-hidden"
          >
            {/* Camera Feed Section */}
            <div className="lg:col-span-2 h-full">
              <MagicBentoCard className="h-full p-0 overflow-hidden" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
                <div className="relative h-full w-full">
                  <CameraFeed className="h-full w-full" />
                </div>
              </MagicBentoCard>
            </div>

            {/* Detection Panel Section */}
            <div className="h-full overflow-hidden">
              <MagicBentoCard className="h-full p-0 overflow-hidden" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
                <DetectionPanel />
              </MagicBentoCard>
            </div>
          </motion.div>

          { }
          <motion.div variants={itemVariants} className="mt-6">
            <MagicBentoCard className="p-0 overflow-hidden" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
              <LiveFeedControls />
            </MagicBentoCard>
          </motion.div>
        </MagicBentoGrid>
      </motion.div>
    </AppShell>
  );
}
