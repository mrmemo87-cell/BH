
import { useCallback } from 'react';

// In a real app, this would use a library like Howler.js and load actual audio files.
// For this environment, we'll just log to the console to show the hook is being called.

export const useSound = (soundName: string, options?: { volume?: number }) => {
    const play = useCallback(() => {
        console.log(`🔊 Playing sound: ${soundName} at volume ${options?.volume ?? 1}`);
        // Example: new Audio(`/sfx/${soundName}.mp3`).play();
    }, [soundName, options]);

    return play;
};
