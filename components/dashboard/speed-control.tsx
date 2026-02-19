'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { MagicBentoCard } from '../ui/magic-bento';
import { Zap, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function SpeedControl() {
    const { state, updateSystemStatus } = useApp();

    const [speed, setSpeed] = useState(1.0);

    useEffect(() => {
        if (state.systemStatus.speedFactor !== undefined) {
            setSpeed(state.systemStatus.speedFactor);
        }
    }, [state.systemStatus.speedFactor]);

    const handleSpeedChange = (value: number[]) => {
        const newSpeed = value[0];
        setSpeed(newSpeed);
    };

    const handleSpeedCommit = (value: number[]) => {
        const newSpeed = value[0];
        updateSystemStatus({ speedFactor: newSpeed });
    };

    const getSpeedLabel = (val: number) => {
        if (val < 0.5) return 'Slow';
        if (val < 1.2) return 'Normal';
        if (val < 2.0) return 'Fast';
        return 'Turbo';
    };

    return (
        <MagicBentoCard className="p-4 flex flex-col gap-3" enableTilt={false} enableMagnetism={false} enableHoverAction={false}>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-500">
                    <Gauge className="w-5 h-5" />
                </div>
                <div className="flex flex-1 justify-between items-center">
                    <label className="text-sm font-medium text-foreground">
                        Detection Speed
                    </label>
                    <span className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                        {speed.toFixed(1)}x ({getSpeedLabel(speed)})
                    </span>
                </div>
            </div>

            <Slider
                defaultValue={[1.0]}
                value={[speed]}
                min={0.1}
                max={3.0}
                step={0.1}
                onValueChange={handleSpeedChange}
                onValueCommit={handleSpeedCommit}
                className="py-2 w-full"
            />
        </MagicBentoCard>
    );
}
