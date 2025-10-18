import { FullUserTask, TaskTemplate } from '../types';

let MOCK_TASKS: FullUserTask[] = [];

// This function initializes the mock tasks for a user.
// It sets up different states to demonstrate the UI.
const initializeTasks = (userId: string) => {
    const taskTemplates: TaskTemplate[] = [
        { id: 't-1', title: 'Science Whiz', description: 'Answer a complex science question.', task_type: 'daily', reward_coins: 75, reward_xp: 120, needed_for_completion: 1 },
        { id: 't-2', title: 'Weekly Raid', description: 'Successfully hack 3 rival agents this week.', task_type: 'weekly', reward_coins: 400, reward_xp: 600, needed_for_completion: 3 },
        { id: 't-3', title: 'Gear Up', description: 'Purchase any item from the Arsenal.', task_type: 'challenge', reward_coins: 100, reward_xp: 50, needed_for_completion: 1 },
        { id: 't-4', title: 'Math Problem', description: 'Solve a tough math problem.', task_type: 'daily', reward_coins: 75, reward_xp: 120, needed_for_completion: 1 },
    ];

    MOCK_TASKS = taskTemplates.map((t, i) => ({
        id: t.id,
        user_id: userId,
        template: t,
        // Pre-set statuses for demonstration purposes
        status: i === 0 ? 'completed' : 'available',
        progress: i === 0 ? { current: 1, needed: 1 } : { current: 0, needed: t.needed_for_completion },
        accepted_at: i === 0 ? new Date(Date.now() - 3600000).toISOString() : null,
        completed_at: i === 0 ? new Date().toISOString() : null,
        // Add other potential statuses for variety
        ...(i === 2 && { status: 'in_progress', accepted_at: new Date().toISOString() }),
    }));
};


export const getTasksForUser = async (userId: string): Promise<FullUserTask[]> => {
    // Initialize tasks if they haven't been for the current session.
    if (MOCK_TASKS.length === 0 || MOCK_TASKS[0].user_id !== userId) {
        initializeTasks(userId);
    }
    return JSON.parse(JSON.stringify(MOCK_TASKS)); // Return deep copy to prevent direct mutation
};

export const acceptTask = async (taskId: string): Promise<FullUserTask | null> => {
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex > -1 && MOCK_TASKS[taskIndex].status === 'available') {
        MOCK_TASKS[taskIndex].status = 'in_progress';
        MOCK_TASKS[taskIndex].accepted_at = new Date().toISOString();
        return JSON.parse(JSON.stringify(MOCK_TASKS[taskIndex]));
    }
    return null;
};

export const completeTask = async (taskId: string): Promise<FullUserTask | null> => {
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex > -1 && MOCK_TASKS[taskIndex].status === 'in_progress') {
        MOCK_TASKS[taskIndex].status = 'completed';
        MOCK_TASKS[taskIndex].progress.current = MOCK_TASKS[taskIndex].progress.needed;
        MOCK_TASKS[taskIndex].completed_at = new Date().toISOString();
        return JSON.parse(JSON.stringify(MOCK_TASKS[taskIndex]));
    }
    return null;
}

export const claimTaskReward = async (taskId: string): Promise<{ coins: number, xp: number, task: FullUserTask } | null> => {
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex > -1 && MOCK_TASKS[taskIndex].status === 'completed') {
        MOCK_TASKS[taskIndex].status = 'claimed';
        const task = MOCK_TASKS[taskIndex];
        return {
            coins: task.template.reward_coins,
            xp: task.template.reward_xp,
            task: JSON.parse(JSON.stringify(task))
        };
    }
    return null;
};