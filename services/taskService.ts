
import { FullUserTask, TaskTemplate, UserTask, TaskType } from '../types';

const MOCK_TASK_TEMPLATES: Record<string, TaskTemplate> = {
    't1': { id: 't1', slug: 'daily-hack-2', title: 'Daily Hack: 2 Targets', description: 'Successfully hack 2 other players today.', task_type: 'daily', reward_coins: 100, reward_xp: 50, enabled: true },
    't2': { id: 't2', slug: 'daily-login', title: 'System Check-In', description: 'Log in to claim your daily bonus.', task_type: 'daily', reward_coins: 25, reward_xp: 10, enabled: true },
    't3': { id: 't3', slug: 'weekly-win-streak', title: 'Weekly Dominance', description: 'Achieve a 5-win streak in hacks this week.', task_type: 'weekly', reward_coins: 500, reward_xp: 250, enabled: true },
    't4': { id: 't4', slug: 'challenge-rival', title: 'Challenge: Rival AI', description: 'Defeat the high-security AI training bot.', task_type: 'challenge', reward_coins: 200, reward_xp: 100, enabled: true, duration_seconds: 3600 },
    't5': { id: 't5', slug: 'batch-mission-alpha', title: 'Batch Mission: Alpha', description: 'As a batch, collectively hack 50 targets.', task_type: 'batch', reward_coins: 1000, reward_xp: 500, enabled: true },
    't6': { id: 't6', slug: 'oneoff-tutorial', title: 'First Steps', description: 'Complete the hacking tutorial.', task_type: 'oneoff', reward_coins: 50, reward_xp: 20, enabled: true },
};

let MOCK_USER_TASKS: UserTask[] = [
    { id: 'ut1', user_id: 'current_user', task_template_id: 't1', status: 'in_progress', accepted_at: new Date().toISOString(), progress: { current: 1, needed: 2 } },
    { id: 'ut2', user_id: 'current_user', task_template_id: 't2', status: 'completed', accepted_at: new Date().toISOString(), completed_at: new Date().toISOString(), progress: { current: 1, needed: 1 } },
    { id: 'ut3', user_id: 'current_user', task_template_id: 't3', status: 'accepted', accepted_at: new Date().toISOString(), progress: { current: 2, needed: 5 } },
    { id: 'ut4', user_id: 'current_user', task_template_id: 't6', status: 'claimed', accepted_at: '2023-10-26T10:00:00Z', completed_at: '2023-10-26T11:00:00Z', claimed_at: '2023-10-26T11:05:00Z', progress: { current: 1, needed: 1 } }
];

// Add available tasks that are not yet accepted by the user
const availableTaskTemplates = Object.values(MOCK_TASK_TEMPLATES).filter(
    template => !MOCK_USER_TASKS.some(ut => ut.task_template_id === template.id)
);

availableTaskTemplates.forEach(template => {
    MOCK_USER_TASKS.push({
        id: `ut-avail-${template.id}`,
        user_id: 'current_user',
        task_template_id: template.id,
        status: 'available'
    });
});

const getFullUserTask = (userTask: UserTask): FullUserTask => ({
    ...userTask,
    template: MOCK_TASK_TEMPLATES[userTask.task_template_id],
});

export const getTasksForUser = async (userId: string): Promise<FullUserTask[]> => {
    console.log(`Fetching tasks for user: ${userId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const tasks = MOCK_USER_TASKS
                .filter(task => task.user_id === userId)
                .map(getFullUserTask);
            resolve(tasks);
        }, 500);
    });
};

export const acceptTask = async (taskId: string): Promise<FullUserTask> => {
    console.log(`Accepting task: ${taskId}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const taskIndex = MOCK_USER_TASKS.findIndex(t => t.id === taskId);
            if (taskIndex !== -1 && MOCK_USER_TASKS[taskIndex].status === 'available') {
                MOCK_USER_TASKS[taskIndex] = {
                    ...MOCK_USER_TASKS[taskIndex],
                    status: 'accepted',
                    accepted_at: new Date().toISOString(),
                    progress: { current: 0, needed: MOCK_TASK_TEMPLATES[MOCK_USER_TASKS[taskIndex].task_template_id].slug.includes('login') ? 1 : MOCK_TASK_TEMPLATES[MOCK_USER_TASKS[taskIndex].task_template_id].slug.includes('hack-2') ? 2 : 5 }
                };
                // Fix: Access template via MOCK_TASK_TEMPLATES map instead of directly on UserTask object, which lacks the 'template' property.
                if (MOCK_TASK_TEMPLATES[MOCK_USER_TASKS[taskIndex].task_template_id].slug === 'daily-login') {
                    MOCK_USER_TASKS[taskIndex].status = 'completed';
                    MOCK_USER_TASKS[taskIndex].completed_at = new Date().toISOString();
                }
                resolve(getFullUserTask(MOCK_USER_TASKS[taskIndex]));
            } else {
                reject(new Error('Task not available or already accepted.'));
            }
        }, 300);
    });
};

export const claimTaskReward = async (taskId: string): Promise<{ task: FullUserTask, rewards: { coins: number, xp: number } }> => {
    console.log(`Claiming reward for task: ${taskId}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const taskIndex = MOCK_USER_TASKS.findIndex(t => t.id === taskId);
            if (taskIndex !== -1 && MOCK_USER_TASKS[taskIndex].status === 'completed') {
                MOCK_USER_TASKS[taskIndex].status = 'claimed';
                MOCK_USER_TASKS[taskIndex].claimed_at = new Date().toISOString();
                const updatedTask = getFullUserTask(MOCK_USER_TASKS[taskIndex]);
                resolve({
                    task: updatedTask,
                    rewards: {
                        coins: updatedTask.template.reward_coins,
                        xp: updatedTask.template.reward_xp,
                    }
                });
            } else {
                reject(new Error('Task not completed or reward already claimed.'));
            }
        }, 300);
    });
};
