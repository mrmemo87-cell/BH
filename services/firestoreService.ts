import {
    getDoc,
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    runTransaction,
    Timestamp,
    addDoc,
    orderBy,
    limit,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, Item, FullUserTask, TaskTemplate, LiveFeedEvent, HackAttempt, Effect } from '../types';

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<Profile | null> => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return userDocSnap.data() as Profile;
    }
    return null;
};

export const createUserProfile = async (uid: string, username: string, displayName: string): Promise<Profile> => {
    const newUserProfile: Profile = {
        id: uid,
        username: username,
        display_name: displayName,
        avatar_url: `https://i.pravatar.cc/150?u=${uid}`,
        level: 1,
        xp: 0,
        coins: 500,
        rank_badge: 'Rookie',
        badges: [],
        inventory: [],
        active_effects: [],
        hacking_skill: 10,
        security_level: 10,
        stamina: 100,
        stamina_max: 100,
    };
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
};

export const updateUserRewards = async (userId: string, coins: number, xp: number): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        coins: increment(coins),
        xp: increment(xp)
    });
};

// --- Game & Activity Functions ---

export const getBatchUsers = async (currentUser: Profile): Promise<Profile[]> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("id", "!=", currentUser.id));
    const querySnapshot = await getDocs(q);
    const users: Profile[] = [];
    querySnapshot.forEach((doc) => {
        users.push(doc.data() as Profile);
    });
    return users;
};

export const performHack = async (attacker: Profile, defender: Profile): Promise<{ success: boolean; loot?: { coins: number }; penalty?: number }> => {
    return await runTransaction(db, async (transaction) => {
        const attackerDocRef = doc(db, 'users', attacker.id);
        const defenderDocRef = doc(db, 'users', defender.id);

        const attackerDoc = await transaction.get(attackerDocRef);
        const defenderDoc = await transaction.get(defenderDocRef);

        if (!attackerDoc.exists() || !defenderDoc.exists()) {
            throw new Error("User not found!");
        }

        const attackerData = attackerDoc.data() as Profile;
        const defenderData = defenderDoc.data() as Profile;
        
        if(attackerData.stamina < 10) throw new Error("Not enough stamina!");
        transaction.update(attackerDocRef, { stamina: attackerData.stamina - 10 });

        const attackPower = attackerData.hacking_skill + (attackerData.active_effects.find(e => e.name.includes("Hacking"))?.value || 0);
        const defensePower = defenderData.security_level + (defenderData.active_effects.find(e => e.name.includes("Security"))?.value || 0);
        const z = (attackPower - defensePower) / 10;
        const winProbability = 1 / (1 + Math.exp(-z));
        const success = Math.random() < winProbability;

        let result: { success: boolean; loot?: { coins: number }; penalty?: number } = { success: false };

        if (success) {
            const coinsStolen = Math.max(1, Math.floor(defenderData.coins * 0.1));
            transaction.update(defenderDocRef, { coins: defenderData.coins - coinsStolen });
            transaction.update(attackerDocRef, { coins: attackerData.coins + coinsStolen });
            result = { success: true, loot: { coins: coinsStolen } };
        } else {
            const penalty = 25;
            transaction.update(attackerDocRef, { coins: attackerData.coins - penalty });
            transaction.update(defenderDocRef, { coins: defenderData.coins + penalty });
            result = { success: false, penalty: penalty };
        }

        const hackAttempt: Omit<HackAttempt, 'id'> = {
            attacker: { id: attacker.id, username: attacker.username },
            defender: { id: defender.id, username: defender.username },
            win: success,
            created_at: Timestamp.now().toDate().toISOString(),
            loot: result.loot ? { ...result.loot, xp: 0 } : undefined
        };
        await addDoc(collection(db, 'hackAttempts'), hackAttempt);

        const feedMessage = success
            ? `${attacker.display_name} breached ${defender.display_name} & stole ${result.loot?.coins} coins.`
            : `${defender.display_name} defended vs ${attacker.display_name}. Attacker fined ${result.penalty} coins.`;
            
        const liveFeedEvent: Omit<LiveFeedEvent, 'id'> = {
            type: 'hack',
            timestamp: Timestamp.now().toDate().toISOString(),
            message: feedMessage
        };
        await addDoc(collection(db, 'liveFeed'), liveFeedEvent);

        return result;
    });
};


export const getRecentActivity = async (userId: string): Promise<HackAttempt[]> => {
    const attemptsRef = collection(db, 'hackAttempts');
    const attackerQuery = query(attemptsRef, where("attacker.id", "==", userId), orderBy("created_at", "desc"), limit(10));
    const defenderQuery = query(attemptsRef, where("defender.id", "==", userId), orderBy("created_at", "desc"), limit(10));
    
    const [attackerSnap, defenderSnap] = await Promise.all([getDocs(attackerQuery), getDocs(defenderQuery)]);

    const activityMap = new Map<string, HackAttempt>();
    attackerSnap.forEach(doc => activityMap.set(doc.id, { id: doc.id, ...doc.data() } as HackAttempt));
    defenderSnap.forEach(doc => activityMap.set(doc.id, { id: doc.id, ...doc.data() } as HackAttempt));

    const activity = Array.from(activityMap.values());
    activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return activity.slice(0, 15);
};

// --- Shop & Inventory Functions ---
export const getShopItems = async (): Promise<Item[]> => {
    const itemsRef = collection(db, 'shopItems');
    const querySnapshot = await getDocs(itemsRef);
    
    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Item);
    });
    return items;
};

export const buyItem = async (userId: string, item: Item): Promise<void> => {
     return runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userDocRef);
        if(!userDoc.exists()) throw new Error("User not found!");
        
        const userData = userDoc.data() as Profile;
        if(userData.coins < item.cost) throw new Error("Not enough coins!");

        transaction.update(userDocRef, {
            coins: userData.coins - item.cost,
            inventory: arrayUnion(item)
        });
     });
};

export const activateItem = async (userId: string, item: Item): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
    const effect = item.effects[0];
    if(!effect || !effect.duration_hours) return;

    const newActiveEffect: Effect = {
        id: item.id,
        name: effect.name,
        description: effect.description,
        value: effect.value,
        expires_at: new Date(Date.now() + effect.duration_hours * 60 * 60 * 1000).toISOString(),
        duration_hours: effect.duration_hours
    };
    
    await updateDoc(userDocRef, {
        inventory: arrayRemove(item),
        active_effects: arrayUnion(newActiveEffect)
    });

    const userProfile = await getUserProfile(userId);
    const liveFeedEvent: Omit<LiveFeedEvent, 'id'> = {
        type: 'purchase', // Using purchase type for activation
        timestamp: Timestamp.now().toDate().toISOString(),
        message: `${userProfile?.display_name} activated ${item.name}.`
    };
    await addDoc(collection(db, 'liveFeed'), liveFeedEvent);
};

// --- Leaderboard & Live Feed Functions ---

export const getLeaderboard = async (): Promise<{ user: Profile, rank: number }[]> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('xp', 'desc'));
    const querySnapshot = await getDocs(q);
    const users: Profile[] = [];
    querySnapshot.forEach((doc) => {
        users.push(doc.data() as Profile);
    });
    return users.map((user, index) => ({ user, rank: index + 1 }));
};

export const getLiveFeedEvents = (callback: (events: LiveFeedEvent[]) => void) => {
    const feedRef = collection(db, "liveFeed");
    const q = query(feedRef, orderBy("timestamp", "desc"), limit(20));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const events: LiveFeedEvent[] = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as LiveFeedEvent);
        });
        callback(events);
    });

    return unsubscribe;
};

// --- Tasks (Placeholder, logic is mocked in taskService.ts) ---
export const getTaskTemplates = async (): Promise<TaskTemplate[]> => {
    // In a real app, this would fetch from a 'taskTemplates' collection
    return [
        { id: 't-1', title: 'Science Question', description: 'Answer a science question.', task_type: 'daily', reward_coins: 50, reward_xp: 100, needed_for_completion: 1 },
        { id: 't-2', title: 'Math Challenge', description: 'Solve a math problem.', task_type: 'daily', reward_coins: 50, reward_xp: 100, needed_for_completion: 1 },
    ];
}