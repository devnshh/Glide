'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';

const AVAILABLE_ACTIONS = [
    { id: 'None', label: 'No Action', icon: '🚫', shortcut: '-' },
    { id: 'switch_tab', label: 'Switch Tab', icon: '🔄', shortcut: 'Alt+Tab' },
    { id: 'play_pause', label: 'Play / Pause', icon: '⏯️', shortcut: 'Space' },
    { id: 'volume_up', label: 'Volume Up', icon: '🔊', shortcut: 'Vol+' },
    { id: 'volume_down', label: 'Volume Down', icon: '🔉', shortcut: 'Vol-' },
    { id: 'mute', label: 'Mute', icon: '🔇', shortcut: 'M' },
    { id: 'next_track', label: 'Next Track', icon: '⏭️', shortcut: 'Ctrl+Right' },
    { id: 'prev_track', label: 'Previous Track', icon: '⏮️', shortcut: 'Ctrl+Left' },
    { id: 'screenshot', label: 'Screenshot', icon: '📸', shortcut: 'PrtScr' },
    { id: 'scroll_up', label: 'Scroll Up', icon: '⬆️', shortcut: 'ScrollUp' },
    { id: 'scroll_down', label: 'Scroll Down', icon: '⬇️', shortcut: 'ScrollDown' },
    { id: 'brightness_up', label: 'Brightness Up', icon: '☀️', shortcut: 'Bright+' },
    { id: 'brightness_down', label: 'Brightness Down', icon: '🌙', shortcut: 'Bright-' },
    { id: 'toggle_cursor', label: 'Toggle Cursor Mode', icon: '🖱️', shortcut: 'Gesture' },
];

export function EditActionModal() {
    const { state, dispatch } = useApp();
    const isOpen = state.modalState.type === 'editGesture' || state.modalState.type === 'mapAction';
    const gestureId = state.modalState.data?.gestureId as string | undefined;
    const gesture = state.gestures.find((g) => g.id === gestureId);

    const [selectedAction, setSelectedAction] = useState('');
    const [name, setName] = useState('');

    const currentAction = gesture
        ? AVAILABLE_ACTIONS.find((a) => a.label === gesture.action)?.id || ''
        : '';

    useEffect(() => {
        if (gesture) {
            setName(gesture.name);
            setSelectedAction(currentAction);
        }
    }, [gesture, currentAction]);

    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
        setSelectedAction('');
        setName('');
    };

    const handleSave = async () => {
        if (!gestureId || !selectedAction) return;
        const actionLabel = AVAILABLE_ACTIONS.find((a) => a.id === selectedAction)?.label || selectedAction;

        try {
            await fetch(`http://localhost:8053/gestures/${gestureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, action: selectedAction })
            });

            dispatch({
                type: 'UPDATE_GESTURE',
                payload: { ...gesture!, name: name, action: selectedAction },
            });
            handleClose();
        } catch (e) {
            console.error("Failed to update gesture", e);
        }
    };

    if (!isOpen || !gesture) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                { }
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                />

                { }
                <motion.div
                    className="relative w-full max-w-md glass-card border border-white/15 rounded-2xl overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                    { }
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Edit Gesture</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Update the name or action for this gesture
                            </p>
                        </div>
                        <motion.button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-smooth"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </motion.button>
                    </div>

                    { }
                    <div className="px-6 pt-4 space-y-4">
                        {/* Gesture Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                Gesture Name
                            </label>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl p-2 bg-white/5 rounded-lg border border-white/10">
                                    {gesture.emoji}
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    placeholder="Gesture Name"
                                />
                            </div>
                        </div>

                        {/* Current Action Display */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Current action</p>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                                <span className="text-lg">{gesture.emoji}</span>
                                <span className="text-sm text-foreground">
                                    {AVAILABLE_ACTIONS.find(a => a.id === gesture.action)?.label || gesture.action}
                                </span>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="p-6 space-y-3">
                        <p className="text-xs text-muted-foreground">Select new action</p>
                        <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
                            {AVAILABLE_ACTIONS.map((action) => (
                                <motion.button
                                    key={action.id}
                                    onClick={() => setSelectedAction(action.id)}
                                    className={`p-3 rounded-lg flex items-center gap-3 text-left transition-smooth ${(selectedAction) === action.id
                                        ? 'bg-indigo-500/30 border border-indigo-500/50 ring-1 ring-indigo-500/30'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xl">{action.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {action.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {action.shortcut}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    { }
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                        <Button
                            onClick={handleClose}
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!selectedAction || !name.trim() || (selectedAction === currentAction && name === gesture.name)}
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Save Change
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
