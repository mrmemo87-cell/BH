
import React, { useEffect, useState } from 'react';

const HackingAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState('Initializing...');
    
    const messages = [
        'Bypassing firewall...',
        'Decrypting security layers...',
        'Searching for vulnerabilities...',
        'Injecting payload...',
        'Covering tracks...'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    setText('Access granted.');
                    setTimeout(onComplete, 500);
                    return 100;
                }
                const newProgress = Math.min(oldProgress + Math.random() * 10, 100);
                setText(messages[Math.floor(newProgress / 20) % messages.length]);
                return newProgress;
            });
        }, 300);

        return () => {
            clearInterval(timer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-[var(--neon-lime)] font-mono">
            <p className="text-2xl mb-4">[ HACK IN PROGRESS ]</p>
            <div className="w-1/2 bg-gray-800 rounded-full h-4 border-2 border-[var(--neon-lime)]">
                <div 
                    className="bg-[var(--neon-lime)] h-full rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="mt-4 text-center w-2/3">{text}</p>
        </div>
    );
};

export default HackingAnimation;
