import React from 'react';

interface XPProgressBarProps {
    xp: number;
    level: number;
    className?: string;
}

// Formula from spec: xp_required(level) = floor(100 * level^1.6)
const xpForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.6));

const XPProgressBar: React.FC<XPProgressBarProps> = ({ xp, level, className = '' }) => {
    const currentLevelXP = xpForLevel(level);
    const nextLevelXP = xpForLevel(level + 1);
    
    const xpIntoLevel = xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    const percentage = xpNeededForLevel > 0 ? (xpIntoLevel / xpNeededForLevel) * 100 : 0;

    return (
        <div className={`w-full ${className}`}>
             <div className="text-xs text-gray-400 mb-1 flex justify-between">
                <span>LEVEL {level}</span>
                <span>{xpIntoLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP</span>
            </div>
            <div className={`w-full bg-black/20 rounded-full h-4 relative overflow-hidden border border-white/5`}>
                <div
                    className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default XPProgressBar;