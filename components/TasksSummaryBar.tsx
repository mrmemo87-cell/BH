import React from 'react';
import { CoinIcon, XPIcon, StreakIcon } from './icons';
import RadialGauge from './RadialGauge';

interface TasksSummaryBarProps {
    coinsToday: number;
    xpToday: number;
    streak: number;
    dailyProgress: { current: number, max: number };
}

const SummaryItem: React.FC<{ icon: React.ReactNode; value: string | number; label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center space-x-3 bg-[var(--glass)] px-4 py-2 rounded-lg border border-[var(--glass-border)]">
        <div className="text-[var(--neon-cyan)]">{icon}</div>
        <div>
            <div className="text-lg font-bold font-orbitron">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
        </div>
    </div>
);


const TasksSummaryBar: React.FC<TasksSummaryBarProps> = ({ coinsToday, xpToday, streak, dailyProgress }) => {
    return (
        <div className="p-4 bg-[var(--panel)] border-b border-[var(--glass-border)]">
            <div className="flex items-center justify-around">
                <SummaryItem icon={<CoinIcon className="h-8 w-8" />} value={coinsToday} label="Coins Today" />
                <SummaryItem icon={<XPIcon className="h-8 w-8" />} value={xpToday} label="XP Today" />
                <RadialGauge 
                    value={dailyProgress.current}
                    max={dailyProgress.max}
                    label="Dailies"
                />
                <SummaryItem icon={<StreakIcon className="h-8 w-8" />} value={`${streak} Days`} label="Daily Streak" />
            </div>
        </div>
    );
};

export default TasksSummaryBar;
