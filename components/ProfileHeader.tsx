import React from 'react';
import { Profile } from '../types';
import NeonCard from './NeonCard';

const ProfileHeader: React.FC<{ profile: Profile, isCurrentUser?: boolean }> = ({ profile, isCurrentUser }) => {
    return (
        <NeonCard>
            <div className="p-6 flex items-center space-x-6">
                <img
                    src={profile.avatar_url}
                    alt={`${profile.display_name}'s avatar`}
                    className="w-28 h-28 rounded-full border-2 border-[var(--neon-cyan)] shadow-lg neon-shadow-cyan"
                />
                <div className="flex-grow">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-bold font-orbitron neon-text">{profile.display_name}</h1>
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                            {profile.rank_badge}
                        </span>
                    </div>
                    <p className="text-md text-gray-400">{profile.username}</p>
                    <div className="mt-3 flex items-center space-x-2">
                        {profile.badges.map(badge => (
                            <span
                                key={badge.id}
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{ backgroundColor: `var(--neon-${badge.color})`, color: 'black' }}
                            >
                                {badge.icon} {badge.title}
                            </span>
                        ))}
                    </div>
                </div>
                {isCurrentUser && (
                    <div>
                         <button className="font-bold py-2 px-5 rounded-lg text-black btn-neon hover:scale-105 transition-transform">
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </NeonCard>
    );
};

export default ProfileHeader;