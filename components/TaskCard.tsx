
import React from 'react';
import { FullUserTask } from '../types';
import NeonCard from './NeonCard';
import { CoinIcon, XPIcon, CheckIcon } from './icons';

interface TaskCardProps {
    task: FullUserTask;
    onSelect: () => void;
    isSelected: boolean;
}

const taskTypeColors: Record<string, 'cyan' | 'lime' | 'pink' | 'purple'> = {
    daily: 'cyan',
    weekly: 'lime',
    challenge: 'pink',
    batch: 'purple',
    oneoff: 'cyan',
};

const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusStyles: Record<string, string> = {
        available: 'bg-blue-500/20 text-blue-300',
        accepted: 'bg-yellow-500/20 text-yellow-300',
        in_progress: 'bg-yellow-500/20 text-yellow-300',
        completed: 'bg-green-500/20 text-green-300 flex items-center',
        claimed: 'bg-gray-500/20 text-gray-400',
        expired: 'bg-red-500/20 text-red-400',
        failed: 'bg-red-500/20 text-red-400',
    };

    return (
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[status] || 'bg-gray-500/20'}`}>
            {status === 'completed' && <CheckIcon className="h-3 w-3 mr-1" />}
            {status.replace('_', ' ').toUpperCase()}
        </div>
    );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, isSelected }) => {
    const accentColor = taskTypeColors[task.template.task_type];

    return (
        <div onClick={onSelect} className={`cursor-pointer transition-all duration-200 ${isSelected ? 'scale-105' : 'hover:scale-102'}`}>
            <NeonCard accentColor={accentColor} className={isSelected ? 'neon-shadow-cyan' : ''}>
                <div className={`p-4 border-l-4 rounded-lg ${isSelected ? 'border-[var(--neon-cyan)]' : `border-[var(--neon-${accentColor})]`}`}>
                    <div className="flex justify-between items-start">
                        <h3 className="text-md font-bold mb-1">{task.template.title}</h3>
                        <TaskStatusBadge status={task.status} />
                    </div>
                    <p className="text-sm text-gray-400 mb-3 truncate">{task.template.description}</p>
                    <div className="flex items-center space-x-4">
                        <div className="inline-flex items-center space-x-1 text-sm bg-black/20 px-2 py-1 rounded-full">
                            <CoinIcon className="h-4 w-4 text-yellow-400" />
                            <span className="font-semibold">{task.template.reward_coins}</span>
                        </div>
                        <div className="inline-flex items-center space-x-1 text-sm bg-black/20 px-2 py-1 rounded-full">
                            <XPIcon className="h-4 w-4 text-purple-400" />
                            <span className="font-semibold">{task.template.reward_xp}</span>
                        </div>
                    </div>
                </div>
            </NeonCard>
        </div>
    );
};

export default TaskCard;
