import React from 'react';
import { User, FullInventoryRow, ActiveEffect, HackAttempt } from '../types';
import ProfileHeader from './ProfileHeader';
import StatsRow from './StatsRow';
import InventoryPanel from './InventoryPanel';
import ActiveEffects from './ActiveEffects';
import RecentActivity from './RecentActivity';
import NeonCard from './NeonCard';

// This is now a display component. The data fetching is simulated at a higher level.
const ProfilePage: React.FC<{ user: User }> = ({ user }) => {

    // In a real app, these would be fetched based on the user prop
    const [inventory, setInventory] = React.useState<FullInventoryRow[]>([]);
    const [effects, setEffects] = React.useState<ActiveEffect[]>([]);
    const [activity, setActivity] = React.useState<HackAttempt[]>([]);

    if (!user) {
        return <div className="text-center text-red-500 mt-8">Could not load profile.</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <ProfileHeader profile={user} isCurrentUser={true} />
            <StatsRow profile={user} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <NeonCard>
                         <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 font-orbitron neon-text-pink">Bio</h3>
                            <p className="text-gray-300">{user.bio}</p>
                        </div>
                    </NeonCard>
                    {/* RecentActivity is now on its own page */}
                </div>

                <div className="space-y-4">
                     {/* These would be fetched based on the user. For now, they are empty. */}
                    <ActiveEffects effects={effects} />
                    <InventoryPanel inventory={inventory} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;