'use client';

import { AppShell } from '@/components/app-shell';
import { GestureCard } from '@/components/gestures/gesture-card';
import { AddGestureCard } from '@/components/gestures/add-gesture-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Gesture } from '@/lib/types';
import { MagicBentoGrid, MagicBentoCard } from '@/components/ui/magic-bento';

export default function GesturesPage() {
  const { state, dispatch } = useApp();

  const handleDeleteGesture = (id: string) => {
    const gesture = state.gestures.find((g) => g.id === id);
    dispatch({
      type: 'OPEN_MODAL',
      payload: { type: 'deleteGesture', data: { id, name: gesture?.name } },
    });
  };

  const handleEditGesture = (gesture: Gesture) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: { type: 'editGesture', data: { gestureId: gesture.id } },
    });
  };

  const handleAddGesture = () => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: { type: 'addGesture' },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        className="px-4 sm:px-6 py-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        { }
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Gestures
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and train your gesture library
          </p>
        </motion.div>

        { }
        <AnimatePresence>
          {state.needsRetrain && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-amber-200">
                    Model update required
                  </p>
                  <p className="text-sm text-amber-200/70">
                    Your gesture library has changed. Retrain the model to apply updates.
                  </p>
                </div>
              </div>
              <Button
                onClick={() =>
                  dispatch({ type: 'OPEN_MODAL', payload: { type: 'retrain' } })
                }
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                Retrain Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        { }
        <MagicBentoGrid>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            { }
            <motion.div variants={itemVariants}>
              <AddGestureCard onClick={handleAddGesture} delay={0} />
            </motion.div>

            { }
            {state.gestures.map((gesture, index) => (
              <motion.div key={gesture.id} variants={itemVariants}>
                <GestureCard
                  gesture={gesture}
                  onEdit={() => handleEditGesture(gesture)}
                  onDelete={handleDeleteGesture}
                  delay={index * 0.05}
                />
              </motion.div>
            ))}
          </motion.div>
        </MagicBentoGrid>

        { }
        {state.gestures.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="text-6xl">👆</div>
            <p className="text-foreground font-semibold">No gestures yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first gesture to get started
            </p>
          </motion.div>
        )}

        {/* Stats Grid */}
        {state.gestures.length > 0 && (
          <MagicBentoGrid>
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <MagicBentoCard className="p-4">
                <p className="text-muted-foreground text-xs mb-1">Total Gestures</p>
                <p className="text-2xl font-bold text-foreground">
                  {state.gestures.length}
                </p>
              </MagicBentoCard>
              <MagicBentoCard className="p-4">
                <p className="text-muted-foreground text-xs mb-1">
                  Total Samples
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {state.gestures.reduce((sum, g) => sum + g.sampleCount, 0)}
                </p>
              </MagicBentoCard>
              <MagicBentoCard className="p-4">
                <p className="text-muted-foreground text-xs mb-1">
                  Average Confidence
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    (state.gestures.reduce(
                      (sum, g) => sum + (g.confidence || 0),
                      0
                    ) /
                      state.gestures.length) *
                    100
                  )}
                  %
                </p>
              </MagicBentoCard>
            </motion.div>
          </MagicBentoGrid>
        )}
      </motion.div>
    </AppShell>
  );
}
