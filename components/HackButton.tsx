import React from 'react';
import { useSound } from '../hooks/useSound';

interface HackButtonProps {
    onHack: () => void;
    isCooldown: boolean;
}

const HackButton: React.FC<HackButtonProps> = ({ onHack, isCooldown }) => {
    const playHackSound = useSound('hack');

    const handleClick = () => {
        if (!isCooldown) {
            playHackSound();
            onHack();
        }
    };
    
    const buttonClasses = `w-full text-center font-extrabold py-4 px-6 rounded-lg text-lg transition-all duration-300 focus:outline-none flex items-center justify-center space-x-2 font-orbitron`;
    
    if (isCooldown) {
        return (
            <button
                disabled
                className={`${buttonClasses} bg-gray-800 border-2 border-gray-700 text-gray-500 cursor-not-allowed`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>SYSTEM COOLING DOWN</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`${buttonClasses} bg-red-900 border-2 border-red-600 text-red-100 hover:bg-red-700 hover:border-red-400 hover:text-white hover:scale-105 transform`}
            style={{
                boxShadow: '0 0 15px rgba(255, 0, 0, 0.4), inset 0 0 5px rgba(255, 100, 100, 0.3)'
            }}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>INITIATE HACK</span>
        </button>
    );
};

export default HackButton;