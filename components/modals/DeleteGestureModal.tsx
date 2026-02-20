'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Trash2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { API_URL } from '@/lib/config'

export function DeleteGestureModal() {
  const { state, dispatch } = useApp()
  const isOpen = state.modalState.type === 'deleteGesture'
  const gestureId = state.modalState.data?.id as string
  const gestureName = state.modalState.data?.name as string

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  const handleConfirm = async () => {
    if (gestureId) {
      try {
        await fetch(`${API_URL}/gestures/${gestureId}`, {
          method: 'DELETE',
        });
        dispatch({ type: 'DELETE_GESTURE', payload: gestureId });
        handleClose();
      } catch (error) {
        console.error('Failed to delete gesture:', error);
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          { }
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          { }
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="glass-card rounded-xl border border-white/15 p-8 max-w-sm w-full">
              { }
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <AlertCircle className="w-6 h-6 text-red-400" />
              </motion.div>

              { }
              <h2 className="text-xl font-bold text-foreground text-center mb-2">
                Delete Gesture?
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-8">
                This action cannot be undone. The gesture "{gestureName}" and
                all its recorded samples will be permanently removed.
              </p>

              { }
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-foreground font-medium smooth-transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium smooth-transition flex items-center justify-center gap-2 glow-accent"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
