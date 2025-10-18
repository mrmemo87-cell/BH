import React from 'react';
import { Profile } from '../types';
import { CoinIcon } from './icons';
import RadialGauge from './RadialGauge';
import XPProgressBar from './XPProgressBar';

const StatBox: React.FC<{ label: string, value: string | number, children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-3 text-center flex-1 flex flex-col justify-center min-h-[96px]">
        <div className="text-xs text-gray-400 uppercase">{label}</div>
        <div className="text-2xl font-bold font-orbitron">{value}</div>
        {children}
    </div>
);

const GaugeBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-2 flex items-center justify-center min-h-[96px]">
        {children}
    </div>
);


const StatsRow: React.FC<{ profile: Profile }> = ({ profile }) => {
    return (
        <div className="flex flex-col gap-4">
            <XPProgressBar xp={profile.xp} level={profile.level} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBox label="Coins" value={profile.coins.toLocaleString()}>
                    <CoinIcon className="h-5 w-5 mx-auto text-yellow-400 mt-1"/>
                </StatBox>
                <GaugeBox>
                     <RadialGauge
                        value={profile.hacking_skill}
                        max={100}
                        label="Hacking"
                        size={80}
                        strokeWidth={6}
                        color="var(--neon-pink)"
                    />
                </GaugeBox>
                <GaugeBox>
                    <RadialGauge
                        value={profile.security_level}
                        max={100}
                        label="Security"
                        size={80}
                        strokeWidth={6}
                        color="var(--neon-cyan)"
                    />
                </GaugeBox>
                 <GaugeBox>
                    <RadialGauge
                        value={profile.stamina}
                        max={profile.stamina_max}
                        label="Stamina"
                        size={80}
                        strokeWidth={6}
                        color="var(--neon-lime)"
                    />
                 </GaugeBox>
            </div>
        </div>
    );
};

export default StatsRow;