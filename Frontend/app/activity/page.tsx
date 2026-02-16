'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useGesture } from '../context/GestureContext'

export default function ActivityPage() {
  const { recentDetections, gestures } = useGesture()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const totalDetections = recentDetections.length
  const successfulDetections = recentDetections.filter(
    (d) => d.success
  ).length
  const successRate =
    totalDetections > 0
      ? Math.round((successfulDetections / totalDetections) * 100)
      : 0
  const avgConfidence =
    totalDetections > 0
      ? (
          recentDetections.reduce(
            (sum, d) => sum + d.confidence,
            0
          ) / totalDetections
        ).toFixed(2)
      : '0.00'

  return (
    <div className="min-h-screen bg-background">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-12 max-w-7xl mx-auto"
      >
        {}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Activity Log
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete history of gesture detections and system events
          </p>
        </div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl border border-white/15 glow-primary"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Total Detections
            </p>
            <h3 className="text-3xl font-bold text-indigo-300 mb-2">
              {totalDetections}
            </h3>
            <p className="text-xs text-muted-foreground">
              All detected gestures
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl border border-white/15 glow-secondary"
          >
            <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
            <h3 className="text-3xl font-bold text-cyan-300 mb-2">
              {successRate}%
            </h3>
            <p className="text-xs text-muted-foreground">
              {successfulDetections} successful
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl border border-white/15 shadow-lg shadow-emerald-500/20"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Avg Confidence
            </p>
            <h3 className="text-3xl font-bold text-emerald-300 mb-2">
              {(parseFloat(avgConfidence) * 100).toFixed(0)}%
            </h3>
            <p className="text-xs text-muted-foreground">
              Across all detections
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl border border-white/15 shadow-lg shadow-amber-500/20"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Unique Gestures
            </p>
            <h3 className="text-3xl font-bold text-amber-300 mb-2">
              {gestures.length}
            </h3>
            <p className="text-xs text-muted-foreground">
              Configured gestures
            </p>
          </motion.div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-xl border border-white/15 p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Detection Events
          </h2>

          {recentDetections.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-0"
            >
              {recentDetections.map((detection, idx) => (
                <motion.div
                  key={detection.id}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 smooth-transition group"
                >
                  {}
                  <div className="mt-1 flex-shrink-0">
                    {detection.success ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      </motion.div>
                    )}
                  </div>

                  {}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {detection.gesture}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {detection.success ? 'Successful' : 'Failed'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {detection.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Today
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="flex-shrink-0 text-right">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30"
                    >
                      <span className="text-sm font-semibold bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                        {Math.round(detection.confidence * 100)}%
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No activity yet. Perform a gesture to start detection.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.section>
    </div>
  )
}
