
import React from 'react';
import { FullUserTask } from '../types';
import NeonCard from './NeonCard';
import { CoinIcon, XPIcon, ClockIcon } from './icons';
import TaskProgressBar from './TaskProgressBar';
import TaskActionButton from './TaskActionButton';
import { useSound } from '../hooks/useSound';

interface TaskDetailPanelProps {
    task?: FullUserTask;
    onAccept: (taskId: string) => Promise<void>;
    onClaim: (taskId: string) => Promise<void>;
    loadingAction: string | null;
}

const TaskTypeBadge: React.FC<{ type: string }> = ({ type }) => {
    const typeStyles: Record<string, string> = {
        daily: 'border-[var(--neon-cyan)] text-[var(--neon-cyan)]',
        weekly: 'border-[var(--neon-lime)] text-[var(--neon-lime)]',
        challenge: 'border-[var(--neon-pink)] text-[var(--neon-pink)]',
        batch: 'border-[var(--neon-purple)] text-[var(--neon-purple)]',
        oneoff: 'border-gray-500 text-gray-300',
    };
    return (
        <span className={`px-3 py-1 text-xs font-bold border rounded-full ${typeStyles[type] || 'border-gray-500'}`}>
            {type.toUpperCase()}
        </span>
    );
};

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onAccept, onClaim, loadingAction }) => {
    const playAcceptSound = useSound('accept');
    const playClaimSound = useSound('claim');

    if (!task) {
        return (
            <div className="flex items-center justify-center h-full text-gray-600">
                <p>Select a task to see details</p>
            </div>
        );
    }
    
    const handleAccept = async () => {
        await onAccept(task.id);
        playAcceptSound();
    };

    const handleClaim = async () => {
        await onClaim(task.id);
        playClaimSound();
    };

    const isActionLoading = (action: string) => loadingAction === `${action}-${task.id}`;

    const renderAction = () => {
        switch (task.status) {
            case 'available':
                return <TaskActionButton onClick={handleAccept} label="Accept Task" loading={isActionLoading('accept')} />;
            case 'completed':
                return <TaskActionButton onClick={handleClaim} label="Claim Reward" loading={isActionLoading('claim')} />;
            case 'claimed':
                // Fix: Added missing required 'loading' prop.
                return <TaskActionButton onClick={() => {}} label="Claimed" disabled={true} success={true} loading={false} />;
             default:
                // Fix: Added missing required 'loading' prop.
                return <TaskActionButton onClick={() => {}} label="In Progress" disabled={true} loading={false} />;
        }
    };


    return (
        <div className="p-4 h-full">
            <NeonCard className="h-full">
                <div className="p-6 flex flex-col h-full overflow-y-auto">
                    <header className="border-b border-b-[var(--glass-border)] pb-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                             <h2 className="text-2xl font-bold font-orbitron neon-text">{task.template.title}</h2>
                             <TaskTypeBadge type={task.template.task_type} />
                        </div>
                        {/* Fix: Changed status check from 'accepted' to 'in_progress' to match the type definition. */}
                        {task.template.duration_seconds && task.status === 'in_progress' && (
                             <div className="flex items-center text-sm text-[var(--neon-pink)]">
                                <ClockIcon className="h-4 w-4 mr-2"/>
                                Time limited
                             </div>
                        )}
                    </header>

                    <div className="flex-grow">
                        <p className="text-gray-300 mb-6">{task.template.description}</p>
                        
                        {task.progress && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Progress</h4>
                                <TaskProgressBar current={task.progress.current} needed={task.progress.needed} />
                            </div>
                        )}
                        
                        <div>
                            <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Rewards</h4>
                            <div className="flex space-x-4">
                                <div className="flex items-center p-3 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)]">
                                    <CoinIcon className="h-8 w-8 text-yellow-400 mr-3"/>
                                    <div>
                                        <div className="text-xl font-bold">{task.template.reward_coins}</div>
                                        <div className="text-xs text-gray-400">Coins</div>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)]">
                                    <XPIcon className="h-8 w-8 text-purple-400 mr-3"/>
                                    <div>
                                        <div className="text-xl font-bold">{task.template.reward_xp}</div>
                                        <div className="text-xs text-gray-400">XP</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <footer className="mt-6 pt-6 border-t border-t-[var(--glass-border)]">
                       {renderAction()}
                    </footer>
                </div>
            </NeonCard>
        </div>
    );
};

export default TaskDetailPanel;
