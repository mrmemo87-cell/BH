import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, Item } from '../types';

const MOCK_USERS: Profile[] = [
    {
        id: 'glitch',
        username: 'glitch',
        display_name: 'Glitch',
        avatar_url: `https://i.pravatar.cc/150?u=glitch`,
        level: 15, xp: 35000, coins: 12500,
        rank_badge: 'Adept Hacker',
        badges: [{ id: 'b1', title: 'First Hack', icon: '🎯', color: 'cyan' }],
        inventory: [], active_effects: [], hacking_skill: 75, security_level: 60, stamina: 80, stamina_max: 100,
    },
    {
        id: 'cipher',
        username: 'cipher',
        display_name: 'Cipher',
        avatar_url: `https://i.pravatar.cc/150?u=cipher`,
        level: 12, xp: 22000, coins: 8000,
        rank_badge: 'Data Thief',
        badges: [], inventory: [], active_effects: [], hacking_skill: 60, security_level: 70, stamina: 100, stamina_max: 100,
    },
    {
        id: 'byte',
        username: 'byte',
        display_name: 'Byte',
        avatar_url: `https://i.pravatar.cc/150?u=byte`,
        level: 8, xp: 9500, coins: 4500,
        rank_badge: 'Script Kiddie',
        badges: [], inventory: [], active_effects: [], hacking_skill: 40, security_level: 50, stamina: 100, stamina_max: 100,
    },
    {
        id: 'proxy',
        username: 'proxy',
        display_name: 'Proxy',
        avatar_url: `https://i.pravatar.cc/150?u=proxy`,
        level: 20, xp: 65000, coins: 25000,
        rank_badge: 'Master Infiltrator',
        badges: [{ id: 'b2', title: 'Top Rank', icon: '🏆', color: 'yellow' }],
        inventory: [], active_effects: [], hacking_skill: 85, security_level: 80, stamina: 100, stamina_max: 100,
    }
];

const MOCK_SHOP_ITEMS: Omit<Item, 'id'>[] = [
    { name: 'Firewall Booster', description: 'Increases security by 10 for 1 hour.', icon: '🛡️', cost: 500, effects: [{ name: '+10 Security', description: 'Boosts defense', value: 10, duration_hours: 1 }] },
    { name: 'Advanced Targeting AI', description: 'Increases hacking by 10 for 1 hour.', icon: '🎯', cost: 500, effects: [{ name: '+10 Hacking', description: 'Boosts offense', value: 10, duration_hours: 1 }] },
    { name: 'Stamina Pack', description: 'Instantly restores 25 stamina.', icon: '⚡', cost: 1000, effects: [{ name: '+25 Stamina', description: 'Recovers stamina', value: 25, duration_hours: 0 }] },
    { name: 'XP Doubler (30min)', description: 'Doubles XP gain for 30 minutes.', icon: '✨', cost: 2500, effects: [{ name: '2x XP Gain', description: 'Doubles XP rewards', value: 2, duration_hours: 0.5 }] },
];


const seedUsers = async () => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    if (snapshot.empty) {
        console.log(`Seeding 'users' collection...`);
        const batch = writeBatch(db);
        MOCK_USERS.forEach((user) => {
            const docRef = doc(db, 'users', user.id);
            batch.set(docRef, user);
        });
        await batch.commit();
        console.log(`'users' collection seeded.`);
    } else {
        console.log(`'users' collection already has data. Skipping seed.`);
    }
};

const seedShopItems = async () => {
    const itemsRef = collection(db, 'shopItems');
    const snapshot = await getDocs(itemsRef);

    if (snapshot.empty) {
        console.log(`Seeding 'shopItems' collection...`);
        const batch = writeBatch(db);
        MOCK_SHOP_ITEMS.forEach((item) => {
            const docRef = doc(collection(db, 'shopItems'));
            batch.set(docRef, item);
        });
        await batch.commit();
        console.log(`'shopItems' collection seeded.`);
    } else {
        console.log(`'shopItems' collection already has data. Skipping seed.`);
    }
};

export const seedDatabase = async () => {
    console.log("Checking if database needs seeding...");
    await Promise.all([
        seedUsers(),
        seedShopItems()
    ]);
    console.log("Seeding check complete.");
};