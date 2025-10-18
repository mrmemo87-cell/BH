import React, { useState, useEffect } from 'react';
import { Profile, Item, HackAttempt } from '../types';
import ProfileHeader from './ProfileHeader';
import StatsRow from './StatsRow';
import InventoryPanel from './InventoryPanel';
import ActiveEffects from './ActiveEffects';
import RecentActivity from './RecentActivity';
import * as firestoreService from '../services/firestoreService';
import { auth } from '../firebase';


interface ProfilePageProps {
    user: Profile;
    onProfileUpdate: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onProfileUpdate }) => {
    const [activity, setActivity] = useState<HackAttempt[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            if (user && user.id) {
                const userActivity = await firestoreService.getRecentActivity(user.id);
                setActivity(userActivity);
            }
        };
        fetchActivity();
    }, [user]);
    
    const handleActivateItem = async (item: Item) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            await firestoreService.activateItem(userId, item);
            onProfileUpdate();
        } catch (e) {
            console.error("Failed to activate item:", e);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <ProfileHeader profile={user} isCurrentUser={true} />
            <StatsRow profile={user} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <InventoryPanel inventory={user.inventory} onActivateItem={handleActivateItem} />
                </div>
                <div>
                    <ActiveEffects effects={user.active_effects} />
                </div>
            </div>
             <div>
                <RecentActivity activity={activity} currentUserId={user.id} />
            </div>
        </div>
    );
};

export default ProfilePage;
