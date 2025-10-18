// Fix: Create types.ts to define all shared types.
export interface Badge {
    id: string;
    title: string;
    icon: string;
    color: 'cyan' | 'pink' | 'lime' | 'purple' | 'yellow' | 'orange';
}

export interface Effect {
    id: string;
    name: string;
    description: string;
    value: number;
    expires_at: string; // ISO string
    duration_hours: number;
}

export interface ItemEffect {
    name: string;
    description: string;
    value: number;
    duration_hours: number;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    icon: string;
    cost: number;
    effects: ItemEffect[];
}

export interface Profile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    level: number;
    xp: number;
    coins: number;
    rank_badge: string;
    badges: Badge[];
    inventory: Item[];
    active_effects: Effect[];
    hacking_skill: number;
    security_level: number;
    stamina: number;
    stamina_max: number;
}

export type TaskStatus = 'available' | 'in_progress' | 'completed' | 'claimed' | 'expired' | 'failed' | 'accepted';

export interface TaskTemplate {
    id: string;
    title: string;
    description: string;
    task_type: 'daily' | 'weekly' | 'challenge' | 'batch' | 'oneoff';
    reward_coins: number;
    reward_xp: number;
    needed_for_completion: number;
}

export interface FullUserTask {
    id: string;
    user_id: string;
    template: TaskTemplate;
    status: TaskStatus;
    progress: {
        current: number;
        needed: number;
    };
    accepted_at: string | null;
    completed_at: string | null;
}

export interface HackAttempt {
    id: string;
    attacker: { id: string; username: string };
    defender: { id: string; username: string };
    win: boolean;
    created_at: string; // ISO string
    loot?: {
        coins: number;
        xp: number;
    };
}

export interface LiveFeedEvent {
    id: string;
    type: 'hack' | 'task_complete' | 'purchase' | 'level_up';
    timestamp: string; // ISO string
    message: string;
}
