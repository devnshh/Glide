'use client'

import { motion } from 'framer-motion'
import { Settings, Zap, Shield, Bell, Save } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    confidenceThreshold: 75,
    autoRetrain: true,
    notificationsEnabled: true,
    darkMode: true,
    detectionFps: 30,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  }

  const handleSave = () => {

    console.log('Settings saved:', settings)
  }

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-12 max-w-4xl mx-auto"
      >
        {}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure gesture recognition and system preferences
          </p>
        </div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl border border-white/15 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Detection Settings
              </h2>
            </div>

            <div className="space-y-6">
              {}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Confidence Threshold
                  </label>
                  <span className="text-sm font-semibold text-indigo-400">
                    {settings.confidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={settings.confidenceThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      confidenceThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum confidence level to register a gesture
                </p>
              </div>

              {}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Detection FPS
                  </label>
                  <span className="text-sm font-semibold text-cyan-400">
                    {settings.detectionFps} FPS
                  </span>
                </div>
                <select
                  value={settings.detectionFps}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      detectionFps: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-foreground focus:outline-none focus:border-indigo-500 smooth-transition"
                >
                  <option value={15}>15 FPS</option>
                  <option value={24}>24 FPS</option>
                  <option value={30}>30 FPS (Recommended)</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>

              {}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-foreground">Auto-Retrain Model</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically improve accuracy with new samples
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, autoRetrain: !settings.autoRetrain })
                  }
                  className={`w-12 h-6 rounded-full smooth-transition ${settings.autoRetrain
                    ? 'bg-emerald-500/50 border border-emerald-500/70'
                    : 'bg-white/10 border border-white/20'
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: settings.autoRetrain ? 24 : 2,
                    }}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl border border-white/15 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                System Settings
              </h2>
            </div>

            <div className="space-y-4">
              {}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Always use dark theme
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, darkMode: !settings.darkMode })
                  }
                  className={`w-12 h-6 rounded-full smooth-transition ${settings.darkMode
                    ? 'bg-emerald-500/50 border border-emerald-500/70'
                    : 'bg-white/10 border border-white/20'
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: settings.darkMode ? 24 : 2,
                    }}
                  />
                </button>
              </div>

              {}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for detected gestures
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: !settings.notificationsEnabled,
                    })
                  }
                  className={`w-12 h-6 rounded-full smooth-transition ${settings.notificationsEnabled
                    ? 'bg-emerald-500/50 border border-emerald-500/70'
                    : 'bg-white/10 border border-white/20'
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: settings.notificationsEnabled ? 24 : 2,
                    }}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl border border-white/15 p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              About GestureDesk
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Version:</span> 1.0.0
              </p>
              <p>
                <span className="text-foreground font-medium">Built with:</span> Next.js
                16, React 19, Framer Motion
              </p>
              <p>
                <span className="text-foreground font-medium">License:</span> MIT
              </p>
            </div>
          </motion.div>
        </motion.div>

        {}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium smooth-transition glow-accent"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </motion.button>
      </motion.section>
    </AppShell>
  )
}
