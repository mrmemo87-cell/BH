
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FullUserTask, Profile } from '../types';
import * as taskService from '../services/taskService';
import * as profileService from '../services/profileService';
import TasksSummaryBar from './TasksSummaryBar';
import TasksFilterBar, { TaskFilter } from './TasksFilterBar';
import TaskList from './TaskList';
import TaskDetailPanel from './TaskDetailPanel';

interface TasksPageProps {
    user: Profile;
    onProfileUpdate: () => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ user, onProfileUpdate }) => {
    const [tasks, setTasks] = useState<FullUserTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const [selectedTask, setSelectedTask] = useState<FullUserTask | undefined>(undefined);
    const [loadingAction, setLoadingAction] = useState<string | null>(null); // e.g., "accept-task-1"

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        const userTasks = await taskService.getTasksForUser(user.id);
        setTasks(userTasks);
        if (!selectedTask && userTasks.length > 0) {
            setSelectedTask(userTasks[0]);
        } else if (selectedTask) {
            // Reselect the task to get its updated state
            setSelectedTask(userTasks.find(t => t.id === selectedTask.id));
        }
        setLoading(false);
    }, [user.id, selectedTask]);

    useEffect(() => {
        fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAcceptTask = async (taskId: string) => {
        setLoadingAction(`accept-${taskId}`);
        const updatedTask = await taskService.acceptTask(taskId);
        if (updatedTask) {
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
            setSelectedTask(updatedTask);
        }
        setLoadingAction(null);
    };

    const handleClaimReward = async (taskId: string) => {
        setLoadingAction(`claim-${taskId}`);
        const result = await taskService.claimTaskReward(taskId);
        if (result) {
            await profileService.updateCurrentUserRewards(result.coins, result.xp);
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? result.task : t));
            setSelectedTask(result.task);
            onProfileUpdate(); // Notify App.tsx to refetch profile
        }
        setLoadingAction(null);
    };
    
    const filteredTasks = useMemo(() => {
        if (activeFilter === 'all') return tasks;
        return tasks.filter(task => task.template.task_type === activeFilter);
    }, [tasks, activeFilter]);

    // Dummy data for summary bar
    const summaryData = {
        coinsToday: 150,
        xpToday: 300,
        streak: 5,
        dailyProgress: {
            current: tasks.filter(t => t.template.task_type === 'daily' && t.status === 'claimed').length,
            max: tasks.filter(t => t.template.task_type === 'daily').length
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <TasksSummaryBar {...summaryData} />
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 min-h-0">
                <div className="md:col-span-1 flex flex-col border-r border-r-[var(--glass-border)] min-h-0">
                    <TasksFilterBar 
                        activeFilter={activeFilter} 
                        setActiveFilter={setActiveFilter} 
                        disabled={loading}
                    />
                    <div className="flex-grow min-h-0">
                        {loading ? (
                            <div className="text-center py-10">Loading tasks...</div>
                        ) : (
                            <TaskList
                                tasks={filteredTasks}
                                onSelectTask={setSelectedTask}
                                selectedTaskId={selectedTask?.id}
                                disabled={loadingAction !== null}
                            />
                        )}
                    </div>
                </div>
                <div className="md:col-span-2 min-h-0">
                     <TaskDetailPanel
                        task={selectedTask}
                        onAccept={handleAcceptTask}
                        onClaim={handleClaimReward}
                        loadingAction={loadingAction}
                    />
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
