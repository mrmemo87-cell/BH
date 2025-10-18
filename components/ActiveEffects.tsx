
import React from 'react';
import { Effect } from '../types';
import NeonCard from './NeonCard';
import { ClockIcon } from './icons';

const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return "Expired";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
};


const ActiveEffects: React.FC<{ effects: Effect[] }> = ({ effects }) => {
    return (
        <NeonCard accentColor="lime">
            <div className="p-4">
                <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-lime">Active Effects</h3>
                {effects.length > 0 ? (
                    <div className="space-y-3">
                        {effects.map(effect => (
                            <div key={effect.id} className="p-3 bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-white">{effect.name}</p>
                                        <p className="text-xs text-gray-400">{effect.description}</p>
                                    </div>
                                     <div className="flex items-center text-xs text-[var(--neon-lime)]">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        {getTimeRemaining(effect.expires_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-sm text-gray-500 text-center py-2">No active effects.</p>
                )}
            </div>
        </NeonCard>
    );
};

export default ActiveEffects;
