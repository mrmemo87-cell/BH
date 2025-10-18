import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as gameService from '../services/gameService';
import NeonCard from './NeonCard';
import MiniWindow from './MiniWindow';
import { useSound } from '../hooks/useSound';

interface ActivityPageProps {
    currentUser: User;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ currentUser }) => {
    const [batchUsers, setBatchUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const playClickSound = useSound('click');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const users = await gameService.getUsersByBatch(currentUser.batch);
            // Filter out the current user from the list
            setBatchUsers(users.filter(u => u.id !== currentUser.id));
            setLoading(false);
        };
        fetchUsers();
    }, [currentUser.batch, currentUser.id]);

    const handleUserClick = (user: User) => {
        playClickSound();
        setSelectedUser(user);
    };
    
    const handleCloseMiniWindow = () => {
        setSelectedUser(null);
    };

    if (loading) {
        return <div className="text-center p-8">Loading agents in your batch...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <header className="text-center my-6">
                <h1 className="text-4xl font-extrabold font-orbitron neon-text">ACTIVITY FEED</h1>
                <p className="text-md text-gray-400 mt-1">Agents in your batch: <span className="font-bold text-[var(--neon-cyan)]">{currentUser.batch}</span></p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {batchUsers.map(user => (
                    <NeonCard key={user.id} accentColor="cyan">
                        <div 
                            className="p-4 text-center cursor-pointer group"
                            onClick={() => handleUserClick(user)}
                        >
                            <img src={user.avatar_url} alt={user.username} className="w-24 h-24 rounded-full mx-auto border-2 border-[var(--glass-border)] group-hover:border-[var(--neon-cyan)] transition-all" />
                            <h3 className="mt-3 font-bold text-lg font-orbitron">{user.display_name}</h3>
                            <p className="text-sm text-gray-400">{user.username}</p>
                            <span className="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                                {user.rank_badge}
                            </span>
                        </div>
                    </NeonCard>
                ))}
            </div>
            {selectedUser && (
                <MiniWindow 
                    user={selectedUser}
                    onClose={handleCloseMiniWindow}
                />
            )}
        </div>
    );
};

export default ActivityPage;