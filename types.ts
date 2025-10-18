import { Profiler } from "react";


export type TaskType = 'daily' | 'weekly' | 'oneoff' | 'challenge' | 'batch';
export type UserTaskStatus = 'available' | 'accepted' | 'in_progress' | 'completed' | 'claimed' | 'failed' | 'expired';

export interface TaskTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  task_type: TaskType;
  reward_coins: number;
  reward_xp: number;
  reward_items?: any[];
  difficulty?: number;
  cooldown_seconds?: number;
  duration_seconds?: number;
  conditions?: Record<string, any>;
  enabled: boolean;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_template_id: string;
  status: UserTaskStatus;
  accepted_at?: string;
  completed_at?: string;
  claimed_at?: string;
  expires_at?: string;
  progress?: {
    current: number;
    needed: number;
  };
  streak_day?: number;
  attempts?: number;
  metadata?: any;
}

export interface FullUserTask extends UserTask {
  template: TaskTemplate;
}


// --- Profile & User Types ---

export type Profile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  coins: number;
  xp: number;
  level: number;
  stamina: number;
  stamina_max: number;
  hacking_skill: number;
  security_level: number;
  last_online_at?: string;
  badges: Array<{id:string, title:string, icon:string, color?:string}>;
  rank_badge: string;
};

export interface User extends Profile {
  email: string;
  batch: string;
  password?: string;
}

// --- Shop & Inventory Types ---

export type ShopItemType = 'consumable' | 'booster' | 'cosmetic';

export type ShopItem = {
    id:string;
    slug:string;
    title:string;
    description: string;
    price: number;
    item_type: ShopItemType;
    payload:any;
    icon: string;
}

export type InventoryRow = {
  id:string;
  item_id:string;
  qty:number;
  activated:boolean;
  activated_until?:string;
};

export interface FullInventoryRow extends InventoryRow {
    shop_item: ShopItem;
}

// --- Gameplay Types ---

export type ActiveEffect = {
    id: string;
    key: string;
    value: number;
    expires_at: string;
    source: string;
}

export type HackAttempt = {
    id: string;
    attacker: { id: string, username: string };
    defender: { id: string, username: string };
    win: boolean;
    loot: { coins: number, xp: number } | null;
    created_at: string;
}

export type LeaderboardEntry = {
    rank: number;
    user: User;
}