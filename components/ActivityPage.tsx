import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../types';
import * as firestoreService from '../services/firestoreService';
import NeonCard from './NeonCard';
import RadialGauge from './RadialGauge';
import HackButton from './HackButton';
import HackingAnimation from './HackingAnimation';
import HackResultModal from './HackResultModal';
import { useSound } from '../hooks/useSound';

interface ActivityPageProps {
    currentUser: Profile;
    onProfileUpdate: () => void;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ currentUser, onProfileUpdate }) => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [hackingTarget, setHackingTarget] = useState<Profile | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hackResult, setHackResult] = useState<{ success: boolean; loot?: { coins: number }; penalty?: number } | null>(null);

    const playHackSound = useSound('hack');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const batchUsers = await firestoreService.getBatchUsers(currentUser);
        setUsers(batchUsers);
        setLoading(false);
    }, [currentUser]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleHackClick = (target: Profile) => {
        setHackingTarget(target);
        setIsAnimating(true);
        playHackSound();
    };

    const handleAnimationComplete = async () => {
        if (!hackingTarget) return;

        try {
            const result = await firestoreService.performHack(currentUser, hackingTarget);
            setHackResult(result);
        } catch(e: any) {
            console.error("Hack failed:", e);
            setHackResult({ success: false }); // Show failed modal on error
        } finally {
            setIsAnimating(false);
            onProfileUpdate(); // Refresh profiles for everyone
        }
    };

    const handleCloseResultModal = () => {
        setHackResult(null);
        setHackingTarget(null);
        fetchUsers(); // Refresh user data after hack
    };


    if (loading) {
        return <div className="text-center py-10">Loading agent data...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold font-orbitron text-center my-6 neon-text">AGENT ACTIVITY</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                    <NeonCard key={user.id} accentColor="pink">
                        <div className="p-4 flex flex-col h-full">
                            <div className="flex items-center space-x-4 mb-4">
                                <img src={user.avatar_url} alt={user.username} className="w-16 h-16 rounded-full border-2 border-[var(--neon-pink)]"/>
                                <div>
                                    <h3 className="text-lg font-bold">{user.display_name}</h3>
                                    <p className="text-sm text-gray-400">@{user.username} | Level {user.level}</p>
                                </div>
                            </div>
                            <div className="flex justify-around items-center mb-4 flex-grow">
                               <RadialGauge value={user.hacking_skill} max={100} label="Hacking" size={70} strokeWidth={5} color="var(--neon-pink)" />
                               <RadialGauge value={user.security_level} max={100} label="Security" size={70} strokeWidth={5} color="var(--neon-cyan)" />
                            </div>
                            <HackButton
                                onClick={() => handleHackClick(user)}
                                isHacking={hackingTarget?.id === user.id && isAnimating}
                                disabled={!!hackingTarget || isAnimating || currentUser.stamina < 10}
                            />
                        </div>
                    </NeonCard>
                ))}
            </div>
            {isAnimating && <HackingAnimation onComplete={handleAnimationComplete} />}
            {hackResult && hackingTarget && <HackResultModal result={hackResult} targetName={hackingTarget.display_name} attackerName={currentUser.display_name} onClose={handleCloseResultModal} />}
        </div>
    );
};

export default ActivityPage;
