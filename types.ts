
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
