import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import * as firestoreService from '../services/firestoreService';
import NeonCard from './NeonCard';
import LiveFeed from './LiveFeed';
import MiniWindow from './MiniWindow';
import ProfileHeader from './ProfileHeader';
import StatsRow from './StatsRow';

interface LeaderboardPageProps {
    currentUser: Profile;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ currentUser }) => {
    const [leaderboard, setLeaderboard] = useState<{ user: Profile, rank: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingUser, setViewingUser] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            const rankedUsers = await firestoreService.getLeaderboard();
            setLeaderboard(rankedUsers);
            setLoading(false);
        };
        fetchLeaderboard();
    }, []);

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'border-yellow-400 text-yellow-300 neon-shadow-yellow';
        if (rank === 2) return 'border-gray-400 text-gray-300';
        if (rank === 3) return 'border-orange-400 text-orange-300';
        return 'border-[var(--glass-border)]';
    };

    if (loading) {
        return <div className="text-center py-10">Compiling agent rankings...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold font-orbitron text-center my-6 neon-text">LEADERBOARD</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <NeonCard>
                        <div className="p-4">
                            <div className="space-y-2">
                                {leaderboard.map(({ user, rank }) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center p-3 rounded-lg bg-[var(--glass)] border-l-4 transition-all ${getRankColor(rank)} ${user.id === currentUser.id ? 'bg-[var(--neon-cyan)]/20' : ''}`}
                                    >
                                        <button onClick={() => setViewingUser(user)} className="flex items-center w-2/5 text-left hover:opacity-80 transition-opacity">
                                            <span className="font-bold font-orbitron text-lg w-10">{rank}</span>
                                            <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
                                            <div>
                                                <p className="font-semibold">{user.display_name}</p>
                                                <p className="text-xs text-gray-400">@{user.username}</p>
                                            </div>
                                        </button>
                                        <div className="w-1/5 text-center">
                                            <p className="font-semibold">{user.level}</p>
                                            <p className="text-xs text-gray-400">Level</p>
                                        </div>
                                        <div className="w-1/5 text-center">
                                             <p className="font-semibold text-[var(--neon-purple)]">{user.xp.toLocaleString()}</p>
                                             <p className="text-xs text-gray-400">Total XP</p>
                                        </div>
                                        <div className="w-1/5 text-center">
                                            <p className="font-semibold">{user.rank_badge}</p>
                                             <p className="text-xs text-gray-400">Rank</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </NeonCard>
                </div>
                <div className="lg:col-span-1">
                    <LiveFeed />
                </div>
            </div>
            {viewingUser && (
                <MiniWindow title={`${viewingUser.display_name}'s Intel`} onClose={() => setViewingUser(null)}>
                    <ProfileHeader profile={viewingUser} />
                    <div className="p-4">
                        <StatsRow profile={viewingUser} />
                    </div>
                </MiniWindow>
            )}
        </div>
    );
};

export default LeaderboardPage;
