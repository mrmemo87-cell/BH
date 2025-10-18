// Fix: Create missing TaskDetailPanel component.
import React from 'react';
import { FullUserTask } from '../types';
import NeonCard from './NeonCard';
import { CoinIcon, XPIcon } from './icons';
import TaskProgressBar from './TaskProgressBar';
import TaskActionButton from './TaskActionButton';
import { useSound } from '../hooks/useSound';
import AIAssistedTaskPanel from './AIAssistedTaskPanel';

interface TaskDetailPanelProps {
    task?: FullUserTask;
    onAccept: (taskId: string) => void;
    onClaim: (taskId: string) => void;
    onCompleteAITask: (taskId: string) => void;
    loadingAction: string | null;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onAccept, onClaim, onCompleteAITask, loadingAction }) => {
    const playAcceptSound = useSound('accept');
    const playClaimSound = useSound('claim');

    if (!task) {
        return (
            <div className="p-8 flex items-center justify-center h-full text-gray-500">
                <p>Select a task to view details.</p>
            </div>
        );
    }

    const handleAccept = () => {
        playAcceptSound();
        onAccept(task.id);
    }

    const handleClaim = () => {
        playClaimSound();
        onClaim(task.id);
    }

    const isAITask = task.template.title === 'Science Whiz' || task.template.title === 'Math Problem';

    const renderActionArea = () => {
        const isLoading = loadingAction?.includes(task.id);
        
        if (isAITask && task.status === 'in_progress') {
            return (
                <div className="mt-auto">
                    <AIAssistedTaskPanel task={task} onComplete={onCompleteAITask} />
                </div>
            );
        }

        const actionButton = () => {
             switch (task.status) {
                case 'available':
                    return <TaskActionButton onClick={handleAccept} label="Accept Task" loading={!!isLoading} />;
                case 'in_progress':
                     return <TaskActionButton onClick={() => {}} label="In Progress" loading={false} disabled={true} />;
                case 'completed':
                    return <TaskActionButton onClick={handleClaim} label="Claim Reward" loading={!!isLoading} />;
                case 'claimed':
                    return <TaskActionButton onClick={() => {}} label="Reward Claimed" loading={false} success={true} />;
                default:
                    return <TaskActionButton onClick={() => {}} label={task.status.toUpperCase()} loading={false} disabled={true} />;
            }
        };

        return (
            <>
                 <div className="mb-6">
                    <h4 className="font-bold mb-2 text-gray-300">Progress:</h4>
                    <TaskProgressBar current={task.progress.current} needed={task.progress.needed} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-[var(--glass)] p-4 rounded-lg text-center">
                        <p className="text-xs text-gray-400">COINS</p>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                            <CoinIcon className="h-6 w-6 text-yellow-400" />
                            <span className="text-xl font-bold">{task.template.reward_coins}</span>
                        </div>
                    </div>
                     <div className="bg-[var(--glass)] p-4 rounded-lg text-center">
                        <p className="text-xs text-gray-400">XP</p>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                            <XPIcon className="h-6 w-6 text-purple-400" />
                            <span className="text-xl font-bold">{task.template.reward_xp}</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-auto">
                   {actionButton()}
                </div>
            </>
        )
    };


    return (
        <div className="p-6 h-full flex flex-col">
            <NeonCard accentColor="purple" className="flex-grow">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[var(--neon-purple)] text-black shadow-lg">
                            {task.template.task_type.toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold font-orbitron mb-2">{task.template.title}</h2>
                    <p className="text-gray-400 mb-6 flex-grow">{task.template.description}</p>
                    
                    {renderActionArea()}
                </div>
            </NeonCard>
        </div>
    );
};

export default TaskDetailPanel;