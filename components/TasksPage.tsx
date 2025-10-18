import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FullUserTask } from '../types';
import * as taskService from '../services/taskService';
import TasksSummaryBar from './TasksSummaryBar';
import TasksFilterBar, { TaskFilter } from './TasksFilterBar';
import TaskList from './TaskList';
import TaskDetailPanel from './TaskDetailPanel';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<FullUserTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<FullUserTask | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const userTasks = await taskService.getTasksForUser('current_user');
            setTasks(userTasks);
            setError(null);
        } catch (err) {
            setError('Failed to load tasks.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAcceptTask = async (taskId: string) => {
        setLoadingAction(`accept-${taskId}`);
        try {
            // Optimistic update
            const originalTasks = tasks;
            const taskToAccept = tasks.find(t => t.id === taskId);
            if (taskToAccept) {
                 const optimisticTask: FullUserTask = {
                    ...taskToAccept,
                    status: 'accepted',
                    accepted_at: new Date().toISOString(),
                    progress: { current: 0, needed: taskToAccept.template.slug.includes('login') ? 1 : taskToAccept.template.slug.includes('hack-2') ? 2 : 5 }
                };
                 if (optimisticTask.template.slug === 'daily-login') {
                    optimisticTask.status = 'completed';
                    optimisticTask.completed_at = new Date().toISOString();
                }

                setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? optimisticTask : t));
                if (selectedTask?.id === taskId) {
                    setSelectedTask(optimisticTask);
                }
            }

            const updatedTask = await taskService.acceptTask(taskId);
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
             if (selectedTask?.id === taskId) {
                setSelectedTask(updatedTask);
            }
        } catch (err) {
            console.error('Failed to accept task', err);
            // Rollback on error
            fetchTasks();
        } finally {
            setLoadingAction(null);
        }
    };

    const handleClaimReward = async (taskId: string) => {
        setLoadingAction(`claim-${taskId}`);
        try {
            // Optimistic update
            const originalTasks = tasks;
            const taskToClaim = tasks.find(t => t.id === taskId);
            if (taskToClaim) {
                const optimisticTask: FullUserTask = {...taskToClaim, status: 'claimed' };
                setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? optimisticTask : t));
                if (selectedTask?.id === taskId) {
                    setSelectedTask(optimisticTask);
                }
            }
            
            const { task: updatedTask } = await taskService.claimTaskReward(taskId);
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
             if (selectedTask?.id === taskId) {
                setSelectedTask(updatedTask);
            }
        } catch (err) {
            console.error('Failed to claim reward', err);
            fetchTasks(); // Rollback
        } finally {
            setLoadingAction(null);
        }
    };
    
    const sortedTasks = useMemo(() => {
        const statusOrder: Record<string, number> = { available: 1, accepted: 2, in_progress: 3, completed: 4, claimed: 5, failed: 6, expired: 7 };
        return [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [tasks]);


    const filteredTasks = useMemo(() => {
        if (activeFilter === 'all') return sortedTasks;
        return sortedTasks.filter(task => task.template.task_type === activeFilter);
    }, [sortedTasks, activeFilter]);
    
    const summaryStats = useMemo(() => {
        return tasks.reduce((acc, task) => {
            if (task.status === 'claimed' && task.template.task_type === 'daily') {
                acc.coinsToday += task.template.reward_coins;
                acc.xpToday += task.template.reward_xp;
            }
            if (task.status === 'claimed' && task.template.task_type === 'daily' && task.streak_day) {
                 acc.streak = Math.max(acc.streak, task.streak_day);
            }
            return acc;
        }, { coinsToday: 0, xpToday: 0, streak: 1 });
    }, [tasks]);
    
    const dailyProgress = useMemo(() => {
        const dailyTasks = tasks.filter(t => t.template.task_type === 'daily');
        const completedDailies = dailyTasks.filter(t => t.status === 'completed' || t.status === 'claimed').length;
        return { current: completedDailies, max: dailyTasks.length };
    }, [tasks]);


    return (
        <div className="container mx-auto mt-4">
            <TasksSummaryBar
                coinsToday={summaryStats.coinsToday}
                xpToday={summaryStats.xpToday}
                streak={summaryStats.streak}
                dailyProgress={dailyProgress}
            />
            <TasksFilterBar 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                disabled={!!loadingAction}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 250px)'}}>
                <div className="md:col-span-1 bg-[var(--panel)] rounded-lg border border-[var(--glass-border)] h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">Loading tasks...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            onSelectTask={setSelectedTask}
                            selectedTaskId={selectedTask?.id}
                            disabled={!!loadingAction}
                        />
                    )}
                </div>
                <div className="md:col-span-2 bg-[var(--panel)] rounded-lg border border-[var(--glass-border)] h-full">
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
