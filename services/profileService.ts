import { auth } from '../firebase';
import * as firestoreService from './firestoreService';

/**
 * Updates the currently authenticated user's coin and XP values in Firestore.
 * @param coins The amount of coins to add.
 * @param xp The amount of XP to add.
 */
export const updateCurrentUserRewards = async (coins: number, xp: number): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user logged in to update rewards.");
        throw new Error("User not authenticated.");
    }
    await firestoreService.updateUserRewards(user.uid, coins, xp);
};
