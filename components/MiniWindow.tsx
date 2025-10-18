import React from 'react';
import { User } from '../types';
import NeonCard from './NeonCard';
import RadialGauge from './RadialGauge';
import HackButton from './HackButton';

interface MiniWindowProps {
    user: User;
    onClose: () => void;
}

const MiniWindow: React.FC<MiniWindowProps> = ({ user, onClose }) => {
    // State to simulate cooldown
    const [isCooldown, setIsCooldown] = React.useState(false);

    const handleHack = () => {
        // Here you would call the hacking RPC
        console.log(`Hacking ${user.username}`);
        setIsCooldown(true);
        // Simulate cooldown period
        setTimeout(() => setIsCooldown(false), 5000); // 5 second cooldown for demo
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div onClick={e => e.stopPropagation()}>
                <NeonCard accentColor="pink">
                    <div className="w-full max-w-lg bg-[var(--panel)] rounded-lg p-6 relative">
                        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-white text-2xl">&times;</button>
                        <div className="flex space-x-6">
                            <div className="flex-shrink-0">
                                <img src={user.avatar_url} alt={user.username} className="w-32 h-32 rounded-full border-2 border-[var(--neon-pink)]"/>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-3xl font-bold font-orbitron">{user.display_name}</h2>
                                <p className="text-gray-400">{user.username}</p>
                                <p className="text-sm mt-2 text-gray-300 italic">"{user.bio}"</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                             <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-2 flex flex-col items-center justify-center">
                                 <RadialGauge value={user.hacking_skill} max={100} label="Hacking" color="var(--neon-pink)" size={100} strokeWidth={8} />
                             </div>
                             <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-2 flex flex-col items-center justify-center">
                                 <RadialGauge value={user.security_level} max={100} label="Security" color="var(--neon-cyan)" size={100} strokeWidth={8} />
                             </div>
                        </div>

                        <div className="mt-6">
                            <HackButton onHack={handleHack} isCooldown={isCooldown} />
                        </div>
                    </div>
                </NeonCard>
            </div>
        </div>
    );
};

export default MiniWindow;