import React from 'react';

export type TaskFilter = 'all' | 'daily' | 'weekly' | 'challenge';

interface TasksFilterBarProps {
    activeFilter: TaskFilter;
    setActiveFilter: (filter: TaskFilter) => void;
    disabled?: boolean;
}

const filters: { id: TaskFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'challenge', label: 'Challenges' },
];

const TasksFilterBar: React.FC<TasksFilterBarProps> = ({ activeFilter, setActiveFilter, disabled }) => {
    return (
        <div className={`flex justify-center p-4 border-b border-[var(--glass-border)] transition-opacity ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex space-x-2 bg-[var(--panel)] p-1 rounded-lg">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        disabled={disabled}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none ${
                            activeFilter === filter.id
                                ? 'bg-[var(--neon-cyan)] text-black neon-shadow-cyan'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        } ${disabled ? 'cursor-not-allowed' : ''}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TasksFilterBar;
