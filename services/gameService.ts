import { User, ShopItem, LeaderboardEntry, ActiveEffect, FullInventoryRow, HackAttempt } from '../types';

const MOCK_USERS: User[] = [
    {
        id: 'u1', email: 'zero@cool.com', password: 'password123', username: '@zerocool', display_name: 'Zero Cool', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=zerocool&backgroundColor=0d1420,071020&backgroundRotation=315`,
        bio: 'Hacker, elite. Crashing the planet, one Gibson at a time.', coins: 1337, xp: 4200, level: 12,
        stamina: 85, stamina_max: 100, hacking_skill: 42, security_level: 35, rank_badge: "Net Runner",
        last_online_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        badges: [{ id: 'b1', title: 'Beta Tester', icon: '🧪', color: 'cyan' }]
    },
    {
        id: 'u2', email: 'acid@burn.com', password: 'password123', username: '@acidburn', display_name: 'Acid Burn', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=acidburn&backgroundColor=ff2d91,9d5cff`,
        bio: 'Mess with the best, die like the rest.', coins: 2500, xp: 5100, level: 15,
        stamina: 100, stamina_max: 100, hacking_skill: 55, security_level: 28, rank_badge: "Code Breaker",
        last_online_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        badges: [{ id: 'b2', title: 'Streak King', icon: '🔥', color: 'pink' }]
    },
     {
        id: 'u3', email: 'phantom@phreak.com', password: 'password123', username: '@phantomphreak', display_name: 'Phantom Phreak', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=phantom&backgroundColor=a6ff4d,00d0e8`,
        bio: "The Phantom of the 'net.'", coins: 800, xp: 2300, level: 8,
        stamina: 60, stamina_max: 100, hacking_skill: 25, security_level: 45, rank_badge: "Script Kiddie",
        last_online_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        badges: []
    },
    {
        id: 'u4', email: 'nikon@lord.com', password: 'password123', username: '@lordnikon', display_name: 'Lord Nikon', batch: 'Batch 2026',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=nikon&backgroundColor=071020,ff2d91`,
        bio: 'I have a photographic memory.', coins: 5000, xp: 8200, level: 20,
        stamina: 95, stamina_max: 100, hacking_skill: 60, security_level: 60, rank_badge: "Cyber Ghost",
        last_online_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        badges: [{ id: 'b3', title: 'Legend', icon: '👑', color: 'lime'}]
    },
    {
        id: 'u5', email: 'sobbi@brain.heist', password: 'sobbi-brain', username: '@sobbi', display_name: 'Sobbi', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=sobbi&backgroundColor=ff2d91,071020`,
        bio: 'Just here for the code and chaos.', coins: 1500, xp: 3100, level: 10,
        stamina: 90, stamina_max: 100, hacking_skill: 38, security_level: 40, rank_badge: "Data Miner",
        last_online_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        badges: []
    },
    {
        id: 'u6', email: 'raiana@brain.heist', password: 'raiana', username: '@raiana', display_name: 'Raiana', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=raiana&backgroundColor=00d0e8,9d5cff`,
        bio: 'Breaking firewalls and hearts.', coins: 2100, xp: 4500, level: 13,
        stamina: 75, stamina_max: 100, hacking_skill: 48, security_level: 33, rank_badge: "Net Runner",
        last_online_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        badges: [{ id: 'b4', title: 'Quick Learner', icon: '⚡', color: 'lime' }]
    },
    {
        id: 'u7', email: 'samira@brain.heist', password: 'samira', username: '@samira', display_name: 'Samira', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=samira&backgroundColor=a6ff4d,ff2d91`,
        bio: 'Quietly conquering the system.', coins: 1800, xp: 3800, level: 11,
        stamina: 88, stamina_max: 100, hacking_skill: 40, security_level: 42, rank_badge: "Data Miner",
        last_online_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        badges: []
    },
    {
        id: 'u8', email: 'alikhan@brain.heist', password: 'alikhan', username: '@alikhan', display_name: 'Alikhan', batch: 'Batch 2026',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=alikhan&backgroundColor=0d1420,00d0e8`,
        bio: 'Master of the digital domain.', coins: 3500, xp: 6200, level: 17,
        stamina: 92, stamina_max: 100, hacking_skill: 58, security_level: 50, rank_badge: "Code Breaker",
        last_online_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        badges: [{ id: 'b5', title: 'Top 10', icon: '🏆', color: 'pink' }]
    },
    {
        id: 'u9', email: 'guest@brain.heist', password: 'guest', username: '@guest', display_name: 'Guest', batch: 'Batch 2025',
        avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=guest&backgroundColor=ffffff,000000`,
        bio: 'Just visiting the matrix.', coins: 100, xp: 50, level: 1,
        stamina: 50, stamina_max: 100, hacking_skill: 5, security_level: 5, rank_badge: "Newbie",
        last_online_at: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
        badges: []
    }
];

const MOCK_SHOP_ITEMS: ShopItem[] = [
    { id: 'item1', slug: 'firewall-booster', title: 'Firewall Booster', description: 'Increases Security Level by 20% for 1 hour.', price: 200, item_type: 'consumable', payload: { effect: 'defense_percent', value: 20, duration: 3600 }, icon: '🛡️' },
    { id: 'item2', slug: 'attack-spike', title: 'Attack Spike', description: 'Increases Hacking Skill by 25% for 30 mins.', price: 250, item_type: 'consumable', payload: { effect: 'attack_percent', value: 25, duration: 1800 }, icon: '⚔️' },
    { id: 'item3', slug: 'coin-doubler', title: 'Coin Doubler (1h)', description: 'Doubles all coins earned from tasks for 1 hour.', price: 500, item_type: 'booster', payload: { multiplier: 2, duration: 3600 }, icon: '💰' },
    { id: 'item4', slug: 'stamina-charge', title: 'Stamina Charge', description: 'Instantly refills 50 stamina points.', price: 150, item_type: 'consumable', payload: { stamina_gain: 50 }, icon: '⚡' },
    { id: 'item5', slug: 'leaderboard-glow', title: 'Leaderboard Glow', description: 'Makes your name glow in the leaderboard for a week.', price: 1000, item_type: 'cosmetic', payload: { duration: 604800 }, icon: '✨' },
    { id: 'item6', slug: 'shimmering-profile', title: 'Shimmering Profile', description: 'Adds a shimmering effect to your mini-window.', price: 1200, item_type: 'cosmetic', payload: {}, icon: '💎' },
];


export const login = async (username: string, pass: string): Promise<User | null> => {
    console.log(`Attempting login for: ${username}`);
    // In a real app, this would be a secure API call with hashing.
    // For this mock, we check display_name and plaintext password.
    return new Promise(resolve => {
        setTimeout(() => {
            const user = MOCK_USERS.find(
                u => u.display_name.toLowerCase() === username.toLowerCase() && u.password === pass
            );
            resolve(user || null);
        }, 500);
    });
};

export const getUsersByBatch = async (batch: string): Promise<User[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_USERS.filter(u => u.batch === batch));
        }, 300);
    });
};

export const getShopItems = async (): Promise<ShopItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SHOP_ITEMS), 200));
}

export const getLeaderboardData = async(filter: 'global' | 'batch', batchName?: string): Promise<LeaderboardEntry[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let usersToShow = MOCK_USERS;
            if (filter === 'batch' && batchName) {
                usersToShow = MOCK_USERS.filter(u => u.batch === batchName);
            }
            const sorted = [...usersToShow].sort((a, b) => b.xp - a.xp);
            const ranked: LeaderboardEntry[] = sorted.map((user, index) => ({
                rank: index + 1,
                user,
            }));
            resolve(ranked);
        }, 400);
    });
}