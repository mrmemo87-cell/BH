import { useCallback } from 'react';

// Switched to reliable, CORS-friendly URLs to fix audio loading errors.
const soundMap: Record<string, string> = {
    click: 'https://actions.google.com/sounds/v1/ui/ui_pop.ogg',
    accept: 'https://actions.google.com/sounds/v1/positive/success_chime.ogg',
    claim: 'https://actions.google.com/sounds/v1/coins/coin_drop.ogg',
    hack: 'https://actions.google.com/sounds/v1/scifi/electronic_watch_digital_beeps.ogg',
    error: 'https://actions.google.com/sounds/v1/negative/failure_beeps.ogg',
};

let audioContext: AudioContext | null = null;
const audioBuffers: Record<string, AudioBuffer> = {};

const getAudioContext = () => {
    if (!audioContext) {
        // Create audio context on user interaction (or lazy-load) to comply with browser autoplay policies
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
        }
    }
    return audioContext;
};

const loadSound = async (name: string, url: string) => {
    if (audioBuffers[name]) {
        return audioBuffers[name];
    }
    try {
        const context = getAudioContext();
        if (!context) return null;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        audioBuffers[name] = audioBuffer;
        return audioBuffer;
    } catch (e) {
        console.error(`Failed to load sound: ${name}`, e);
        return null;
    }
};

// Preload sounds
Object.entries(soundMap).forEach(([name, url]) => {
    // We can lazily load them on first play, or preload them like this.
    // Preloading can be intensive, so let's ensure it doesn't block.
    loadSound(name, url);
});

export const useSound = (soundName: string, options?: { volume?: number }) => {
    const play = useCallback(() => {
        const context = getAudioContext();
        if (!context) return;
        
        // Resume context if it's suspended (e.g., due to autoplay policy)
        if (context.state === 'suspended') {
            context.resume();
        }
        
        const buffer = audioBuffers[soundName];
        
        if (buffer) {
            const source = context.createBufferSource();
            source.buffer = buffer;
            
            const gainNode = context.createGain();
            gainNode.gain.setValueAtTime(options?.volume ?? 0.3, context.currentTime); // Lowered default volume
            
            source.connect(gainNode);
            gainNode.connect(context.destination);
            source.start(0);
        } else {
             // If not preloaded, try loading on demand
             loadSound(soundName, soundMap[soundName]).then(loadedBuffer => {
                 if (loadedBuffer) {
                     const source = context.createBufferSource();
                     source.buffer = loadedBuffer;
                     const gainNode = context.createGain();
                     gainNode.gain.setValueAtTime(options?.volume ?? 0.3, context.currentTime);
                     source.connect(gainNode);
                     gainNode.connect(context.destination);
                     source.start(0);
                 } else {
                     console.log(`🔊 Sound not ready or context failed: ${soundName}`);
                 }
             });
        }
    }, [soundName, options]);

    return play;
};
