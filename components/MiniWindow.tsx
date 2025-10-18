
import React from 'react';

interface MiniWindowProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const MiniWindow: React.FC<MiniWindowProps> = ({ title, children, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-2xl"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="relative p-px rounded-xl bg-[var(--panel)]">
                     <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-pink)] opacity-50 blur-xl" style={{zIndex: -1}}></div>
                     <div className="relative bg-[var(--panel)] rounded-[11px] shadow-2xl">
                        <header className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center">
                            <h2 className="font-bold font-orbitron neon-text">{title}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>
                        <div className="max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default MiniWindow;
