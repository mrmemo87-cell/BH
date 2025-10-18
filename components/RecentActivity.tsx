import React from 'react';
import { HackAttempt } from '../types';
import NeonCard from './NeonCard';
import { CoinIcon, XPIcon } from './icons';

const ActivityItem: React.FC<{ attempt: HackAttempt, currentUserId: string }> = ({ attempt, currentUserId }) => {
    const isAttacker = attempt.attacker.id === currentUserId;
    const opponent = isAttacker ? attempt.defender : attempt.attacker;
    const outcome = (isAttacker && attempt.win) || (!isAttacker && !attempt.win);
    
    const outcomeText = isAttacker
        ? (attempt.win ? `Hacked ${opponent.username}` : `Failed hack on ${opponent.username}`)
        : (attempt.win ? `Hacked by ${opponent.username}` : `Defended against ${opponent.username}`);

    return (
        <div className={`p-3 flex items-center justify-between border-l-4 rounded-r-md ${outcome ? 'border-green-400 bg-green-500/10' : 'border-red-400 bg-red-500/10'}`}>
            <div>
                <p className={`font-semibold ${outcome ? 'text-green-300' : 'text-red-300'}`}>{outcomeText}</p>
                 <p className="text-xs text-gray-400">{new Date(attempt.created_at).toLocaleString()}</p>
            </div>
            {isAttacker && attempt.win && attempt.loot && (
                <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                        <CoinIcon className="h-4 w-4 text-yellow-400" />
                        <span>+{attempt.loot.coins}</span>
                    </div>
                     <div className="flex items-center space-x-1">
                        <XPIcon className="h-4 w-4 text-purple-400" />
                        <span>+{attempt.loot.xp}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const RecentActivity: React.FC<{ activity: HackAttempt[], currentUserId: string }> = ({ activity, currentUserId }) => {
    return (
        <NeonCard>
            <div className="p-4">
                 <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-pink">Recent Activity</h3>
                 {activity.length > 0 ? (
                     <div className="space-y-2">
                        {activity.map(item => <ActivityItem key={item.id} attempt={item} currentUserId={currentUserId} />)}
                     </div>
                 ) : (
                     <p className="text-sm text-gray-500 text-center py-2">No recent activity.</p>
                 )}
            </div>
        </NeonCard>
    );
};

export default RecentActivity;