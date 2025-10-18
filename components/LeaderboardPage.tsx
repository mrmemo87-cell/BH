import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '../types';
import * as gameService from '../services/gameService';
import NeonCard from './NeonCard';

type LeaderboardFilter = 'global' | 'batch';

const getLastSeenStatus = (lastOnline?: string): { color: string; text: string } => {
    if (!lastOnline) return { color: 'bg-gray-500', text: 'Unknown' };
    const minutesAgo = (Date.now() - new Date(lastOnline).getTime()) / (1000 * 60);
    if (minutesAgo <= 40) return { color: 'bg-green-400 animate-pulse', text: 'Online Recently' };
    if (minutesAgo <= 60) return { color: 'bg-yellow-400', text: 'Idle' };
    return { color: 'bg-red-500', text: 'Offline' };
}

const LeaderboardPage: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<LeaderboardFilter>('global');

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        // Assuming current user is from 'Batch 2025' for batch filter demo
        const data = await gameService.getLeaderboardData(filter, 'Batch 2025');
        setLeaderboard(data);
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);
    
    const rankColors: Record<number, string> = {
        1: 'text-yellow-300 neon-text',
        2: 'text-gray-300 neon-text',
        3: 'text-yellow-600 neon-text'
    }

    return (
        <div className="container mx-auto p-4">
             <header className="text-center my-6">
                <h1 className="text-4xl font-extrabold font-orbitron neon-text">LEADERBOARD</h1>
                <p className="text-md text-gray-400 mt-1">See who dominates the network.</p>
            </header>

            <div className="flex justify-center mb-6">
                 <div className="flex space-x-1 bg-[var(--panel)] p-1 rounded-lg border border-[var(--glass-border)]">
                    <button onClick={() => setFilter('global')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'global' ? 'bg-[var(--neon-cyan)] text-black' : 'hover:bg-white/10'}`}>Global</button>
                    <button onClick={() => setFilter('batch')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'batch' ? 'bg-[var(--neon-cyan)] text-black' : 'hover:bg-white/10'}`}>My Batch</button>
                 </div>
            </div>

            <NeonCard>
                <div className="p-4">
                    {loading ? (
                        <div className="text-center p-8">Loading rankings...</div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map(({ rank, user }) => {
                                const status = getLastSeenStatus(user.last_online_at);
                                return (
                                <div key={user.id} className="flex items-center p-3 bg-[var(--glass)] rounded-lg border border-[var(--glass-border)]">
                                    <div className={`w-10 text-xl font-bold font-orbitron text-center ${rankColors[rank] || ''}`}>{rank}</div>
                                    <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-full mx-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold">{user.display_name} <span className="text-sm text-gray-400">{user.username}</span></h3>
                                        <p className="text-xs text-gray-300">{user.bio}</p>
                                    </div>
                                    <div className="w-40 text-center">
                                         <span className="text-sm font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                                            {user.rank_badge}
                                        </span>
                                    </div>
                                    <div className="w-32 text-center font-bold font-orbitron">{user.xp.toLocaleString()} XP</div>
                                    <div className="w-28 flex items-center justify-center">
                                        <div className={`w-3 h-3 rounded-full ${status.color}`} title={status.text}></div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            </NeonCard>
        </div>
    );
};

export default LeaderboardPage;