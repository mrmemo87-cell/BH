
import { useCallback, useMemo } from 'react';

// A map of sound names to their file paths
// Using publicly available sound files to avoid pathing issues.
const soundFiles: Record<string, string> = {
    accept: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/confirm_1--_gb_1.mp3',
    claim: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/coin--_gb_1.mp3',
    error: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/error--_gb_1.mp3',
    login: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/whoosh--_gb_1.mp3',
    hack: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/technological_1--_gb_1.mp3',
    purchase: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/confirm_2--_gb_1.mp3',
};

// Cache Audio objects to avoid creating them on every render
const audioCache: Record<string, HTMLAudioElement> = {};

export const useSound = (soundName: keyof typeof soundFiles) => {
    const audio = useMemo(() => {
        if (audioCache[soundName]) {
            return audioCache[soundName];
        }
        const newAudio = new Audio(soundFiles[soundName]);
        newAudio.volume = 0.3; // Set a reasonable volume
        audioCache[soundName] = newAudio;
        return newAudio;
    }, [soundName]);

    const play = useCallback(() => {
        audio.currentTime = 0;
        audio.play().catch(e => console.error(`Could not play sound ${soundName}:`, e));
    }, [audio, soundName]);

    return play;
};
