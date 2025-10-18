import React, { useState, useEffect } from 'react';
import { ActiveEffect } from '../types';
import NeonCard from './NeonCard';
import { ClockIcon } from './icons';

const formatDuration = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

const EffectItem: React.FC<{ effect: ActiveEffect }> = ({ effect }) => {
    const calculateRemaining = () => Math.round((new Date(effect.expires_at).getTime() - Date.now()) / 1000);
    const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateRemaining();
            setRemainingSeconds(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [effect.expires_at]);

    return (
        <div className="flex justify-between items-center text-sm p-2 bg-[var(--glass)] rounded-md">
            <div>
                <span className="font-bold text-white capitalize">{effect.key.replace('_', ' ')}</span>
                <span className="text-gray-400 text-xs ml-2">({effect.source})</span>
            </div>
            <div className="flex items-center font-mono text-xs text-[var(--neon-lime)]">
                <ClockIcon className="h-3 w-3 mr-1" />
                {formatDuration(remainingSeconds)}
            </div>
        </div>
    );
};

const ActiveEffects: React.FC<{ effects: ActiveEffect[] }> = ({ effects }) => {
    return (
        <NeonCard>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-pink">Active Effects</h3>
                {effects.length > 0 ? (
                    <div className="space-y-2">
                        {effects.map(effect => <EffectItem key={effect.id} effect={effect} />)}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">No active effects.</p>
                )}
            </div>
        </NeonCard>
    );
};

export default ActiveEffects;