'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { ConfidenceRing } from '../core/confidence-ring';

type RetrainPhase = 'idle' | 'training' | 'success' | 'error';

export function RetrainStatusModal() {
    const { state, dispatch } = useApp();
    const isOpen = state.modalState.type === 'retrain';

    const [phase, setPhase] = useState<RetrainPhase>('idle');
    const [progress, setProgress] = useState(0);
    const [accuracy, setAccuracy] = useState<number | null>(null);

    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
        setTimeout(() => {
            setPhase('idle');
            setProgress(0);
            setAccuracy(null);
        }, 300);
    };

    const handleStartRetrain = async () => {
        setPhase('training');
        setProgress(0);
        dispatch({
            type: 'UPDATE_TRAINING_STATE',
            payload: { inProgress: true, progress: 0 },
        });

        try {
            await fetch('http://localhost:8053/train/model', { method: 'POST' });
        } catch (e) {
            console.error("Retrain failed", e);
            setPhase('error');
            return;
        }

        const ws = new WebSocket('ws://localhost:8053/ws');

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'training_complete') {
                    setProgress(100);
                    setAccuracy(msg.data.accuracy || 100);
                    setPhase('success');
                    dispatch({
                        type: 'UPDATE_TRAINING_STATE',
                        payload: { inProgress: false, progress: 100, accuracy: msg.data.accuracy || 100 },
                    });
                    dispatch({ type: 'SET_NEEDS_RETRAIN', payload: false });
                    ws.close();
                }
            } catch (e) {
                console.error(e);
            }
        };

    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={phase !== 'training' ? handleClose : undefined}
                />

                {}
                <motion.div
                    className="relative w-full max-w-sm glass-card border border-white/15 rounded-2xl overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                    {}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Retrain Model</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {phase === 'idle' && 'Update the model with your latest gestures'}
                                {phase === 'training' && 'Training in progress...'}
                                {phase === 'success' && 'Training complete!'}
                                {phase === 'error' && 'Training failed'}
                            </p>
                        </div>
                        {phase !== 'training' && (
                            <motion.button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-smooth"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </motion.button>
                        )}
                    </div>

                    {}
                    <div className="p-6 flex flex-col items-center gap-6">
                        <AnimatePresence mode="wait">
                            {}
                            {phase === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <RotateCcw className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground">
                                            {state.gestures.length} gestures in library
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            This will take about 30 seconds
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleStartRetrain}
                                        className="w-full h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Start Retraining
                                    </Button>
                                </motion.div>
                            )}

                            {}
                            {phase === 'training' && (
                                <motion.div
                                    key="training"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
                                        <h3 className="text-lg font-semibold text-foreground">Training Model...</h3>
                                        <p className="text-sm text-muted-foreground mt-2 text-center max-w-[200px]">
                                            Optimizing gesture recognition. This usually takes a few seconds.
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Please wait, do not close this window
                                    </p>
                                </motion.div>
                            )}

                            {}
                            {phase === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center gap-4 text-center"
                                >
                                    <motion.div
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <Check className="w-10 h-10 text-emerald-400" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Training Complete!</h3>
                                        {accuracy !== null && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Model accuracy: <span className="text-emerald-400 font-mono font-semibold">{accuracy}%</span>
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Done
                                    </Button>
                                </motion.div>
                            )}

                            {}
                            {phase === 'error' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-8 h-8 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Training Failed</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Something went wrong. Please try again.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <Button
                                            onClick={handleClose}
                                            variant="ghost"
                                            className="flex-1 text-muted-foreground"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={handleStartRetrain}
                                            className="flex-1 bg-red-600 hover:bg-red-700"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Retry
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
