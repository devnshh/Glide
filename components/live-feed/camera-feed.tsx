import { useState, useEffect, useRef } from 'react';
import { VideoOff, Camera, Loader2 } from 'lucide-react';
import { GlassCard } from '../core/glass-card';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraFeedProps {
  className?: string;
}

export function CameraFeed({ className }: CameraFeedProps) {
  const { state } = useApp();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedUrl, setFeedUrl] = useState<string | null>(null);
  const isCameraOn = state.systemStatus.camera === 'on';
  const mountId = useRef(Date.now());

  useEffect(() => {
    // Generate a new mount ID each time this effect runs
    const id = Date.now();
    mountId.current = id;

    if (!isCameraOn) {
      setFeedUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setFeedUrl(null);

    const connectTimer = setTimeout(() => {
      if (mountId.current === id) {
        setFeedUrl(`${API_URL}/video_feed?t=${id}`);
      }
    }, 200);

    const loadingTimer = setTimeout(() => {
      if (mountId.current === id) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(loadingTimer);
      setFeedUrl(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn]);

  // Also reconnect on every fresh mount (handles page navigation)
  useEffect(() => {
    if (!isCameraOn) return;

    const id = Date.now();
    mountId.current = id;

    setLoading(true);
    setError(false);

    const connectTimer = setTimeout(() => {
      if (mountId.current === id) {
        setFeedUrl(`${API_URL}/video_feed?t=${id}`);
      }
    }, 200);

    const loadingTimer = setTimeout(() => {
      if (mountId.current === id) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(loadingTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    if (isCameraOn) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <GlassCard className={cn("relative p-0 h-full min-h-[400px] flex flex-col items-center justify-center overflow-hidden bg-black", className)}>
      <AnimatePresence mode="wait">
        {isCameraOn && !error ? (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            {feedUrl && (
              <img
                key={feedUrl}
                src={feedUrl}
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center justify-center gap-4 text-muted-foreground p-8 h-full w-full"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              {error ? <VideoOff className="w-10 h-10 relative z-10" /> : <Camera className="w-10 h-10 relative z-10" />}
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg text-foreground">
                {error ? "Camera Unavailable" : "Camera is Off"}
              </p>
              {error && (
                <p className="text-sm">Ensure the backend server is running.</p>
              )}
              {!error && !isCameraOn && (
                <p className="text-sm">Enable the camera to start gesture recognition.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCameraOn && !error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 px-2 py-1 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center gap-2 z-10 shadow-lg border border-red-400/20"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
        </motion.div>
      )}
    </GlassCard>
  );
}
