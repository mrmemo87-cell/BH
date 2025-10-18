
import React from 'react';

interface TaskProgressBarProps {
    current: number;
    needed: number;
    className?: string;
}

const TaskProgressBar: React.FC<TaskProgressBarProps> = ({ current, needed, className = '' }) => {
    const percentage = needed > 0 ? (current / needed) * 100 : 0;

    return (
        <div className={`w-full bg-black/20 rounded-full h-3.5 relative overflow-hidden border border-white/5 ${className}`}>
            <div
                className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-pink)] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white/90 drop-shadow-lg" style={{textShadow: '0 0 2px black'}}>
                    {current} / {needed}
                </span>
            </div>
        </div>
    );
};

export default TaskProgressBar;
