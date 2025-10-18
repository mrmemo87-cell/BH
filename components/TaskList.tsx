import React from 'react';
import { FullUserTask } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
    tasks: FullUserTask[];
    onSelectTask: (task: FullUserTask) => void;
    selectedTaskId?: string;
    disabled?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, selectedTaskId, disabled }) => {
    if (tasks.length === 0) {
        return <div className="text-center py-10 text-gray-500">No tasks available for this filter.</div>;
    }

    return (
        <div className={`space-y-3 p-4 overflow-y-auto h-full transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => onSelectTask(task)}
                    isSelected={task.id === selectedTaskId}
                />
            ))}
        </div>
    );
};

export default TaskList;
