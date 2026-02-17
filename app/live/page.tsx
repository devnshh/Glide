'use client'

import { motion } from 'framer-motion'
import { Video, Pause, Play, CircleOff } from 'lucide-react'
import { useGesture } from '../context/GestureContext'
import { useState } from 'react'

export default function LiveFeedPage() {
  const { recentDetections, systemHealth } = useGesture()
  const [isPlaying, setIsPlaying] = useState(true)

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
            Live Detection Feed
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time gesture detection and analysis from your camera
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-xl border border-white/15 overflow-hidden glow-primary">
              {}
              <div className="relative w-full bg-black aspect-video flex items-center justify-center group overflow-hidden">
                {}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-center"
                  >
                    <Video className="w-24 h-24 text-indigo-400/40 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Camera Feed Preview
                    </p>
                  </motion.div>
                </div>

                {}
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">
                    LIVE
                  </span>
                </motion.div>

                {}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white smooth-transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 smooth-transition"
                  >
                    <CircleOff className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {}
              <div className="p-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Frame Rate
                    </span>
                    <span className="text-sm font-mono text-cyan-400">
                      {recentDetections.length > 0 ? '60 FPS' : '0 FPS'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Inference Time
                    </span>
                    <span className="text-sm font-mono text-indigo-400">
                      {recentDetections.length > 0 ? '42ms' : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Current Accuracy
                    </span>
                    <span className="text-sm font-mono text-emerald-400">
                      {systemHealth.detectionRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-xl border border-white/15 p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Current Detection
            </h2>

            {recentDetections.length > 0 ? (
              <div className="space-y-4 flex-1">
                {}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Detected Gesture
                  </p>
                  <motion.div
                    key={recentDetections[0]?.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-indigo-300 mb-4"
                  >
                    {recentDetections[0]?.gesture || 'None'}
                  </motion.div>
                </div>

                {}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.svg
                      viewBox="0 0 120 120"
                      className="w-full h-full transform -rotate-90"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="55"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="55"
                        fill="none"
                        stroke="url(#confidence-gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '345 345' }}
                        animate={{
                          strokeDasharray: [
                            '345 345',
                            `${
                              (recentDetections[0]?.confidence || 0.8) * 345
                            } 345`,
                          ],
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient
                          id="confidence-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgb(99, 102, 241)"
                          />
                          <stop offset="100%" stopColor="rgb(0, 188, 212)" />
                        </linearGradient>
                      </defs>
                    </motion.svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-cyan-400">
                        {Math.round(
                          (recentDetections[0]?.confidence || 0.8) * 100
                        )}
                        %
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="text-foreground font-mono">
                      {recentDetections[0]?.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-400 font-medium">
                      {recentDetections[0]?.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Video className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  No gesture detected yet
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Perform a gesture in front of the camera
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 glass-card rounded-xl border border-white/15 p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Detection History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                    Gesture
                  </th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                    Time
                  </th>
                  <th className="px-4 py-3 text-right text-muted-foreground font-medium">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-center text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.slice(0, 10).map((detection, idx) => (
                  <motion.tr
                    key={detection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 smooth-transition"
                  >
                    <td className="px-4 py-3 text-foreground font-medium">
                      {detection.gesture}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {detection.timestamp}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan-400 font-semibold">
                        {Math.round(detection.confidence * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-block w-3 h-3 rounded-full ${
                          detection.success
                            ? 'bg-emerald-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}
