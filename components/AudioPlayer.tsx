import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer: React.FC = () => {
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('musicMuted') === 'true';
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audioElement = document.getElementById('background-music') as HTMLAudioElement;
        if (audioElement) {
            audioRef.current = audioElement;
            audioElement.volume = 0.1;
            if (!isMuted) {
                audioElement.play().catch(e => console.log("Audio autoplay was prevented."));
            }
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (!isMuted) {
                 audioRef.current.play().catch(e => console.log("Audio play was prevented."));
            }
        }
        localStorage.setItem('musicMuted', String(isMuted));
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors" title={isMuted ? 'Unmute Music' : 'Mute Music'}>
            {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l4-4m0 4l-4-4" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            )}
        </button>
    );
};

export default AudioPlayer;