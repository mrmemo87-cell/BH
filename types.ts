// Fix: Create type definitions used throughout the application.

export interface Badge {
    id: string;
    title: string;
    icon: string;
    color: 'cyan' | 'pink' | 'lime' | 'purple';
}

export interface Effect {
    id: string;
    name: string;
    description: string;
    expires_at: string; // ISO string
    value?: number;
    duration_hours?: number;
}

export interface ItemEffect {
    name: string;
    description: string;
    value?: number;
    duration_hours?: number;
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

export interface TaskTemplate {
    id: string;
    title: string;
    description: string;
    task_type: 'daily' | 'weekly' | 'challenge' | 'batch' | 'oneoff';
    reward_coins: number;
    reward_xp: number;
    needed_for_completion: number;
    duration_seconds?: number;
}

export interface TaskProgress {
    current: number;
    needed: number;
}

export interface FullUserTask {
    id: string;
    user_id: string;
    template: TaskTemplate;
    status: 'available' | 'in_progress' | 'completed' | 'claimed' | 'expired' | 'failed';
    progress: TaskProgress | null;
    accepted_at: string | null;
    completed_at: string | null;
}

export interface HackParticipant {
    id: string;
    username: string;
}

export interface Loot {
    coins: number;
    xp: number;
}

export interface HackAttempt {
    id: string;
    attacker: HackParticipant;
    defender: HackParticipant;
    win: boolean;
    created_at: string; // ISO string
    loot?: Loot;
}

export interface LiveFeedEvent {
    id: string;
    type: 'hack' | 'task' | 'purchase' | 'level_up';
    timestamp: string;
    message: string;
}
