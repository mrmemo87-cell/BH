// Fix: Create missing gameService.ts.
// This file can be used to store core game logic functions,
// such as calculating XP for levels, battle mechanics, etc.

export const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(level, 1.6));
};
