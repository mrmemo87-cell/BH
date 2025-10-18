
import React from 'react';

interface NeonCardProps {
    children: React.ReactNode;
    className?: string;
    accentColor?: 'cyan' | 'pink' | 'lime' | 'purple';
}

const NeonCard: React.FC<NeonCardProps> = ({ children, className = '', accentColor = 'cyan' }) => {
    const accentStyle: React.CSSProperties = {
        '--accent-color-from': `var(--neon-${accentColor})`,
        '--accent-color-to': accentColor === 'cyan' ? 'var(--neon-pink)' : `var(--neon-${accentColor})`
    } as React.CSSProperties;

    return (
        <div
            className={`relative p-px rounded-xl bg-[var(--panel)] ${className}`}
            style={accentStyle}
        >
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: `linear-gradient(90deg, var(--accent-color-from), var(--accent-color-to))`,
                    filter: 'blur(12px)',
                    opacity: 0.6,
                    zIndex: -1,
                }}
            ></div>
            <div className="relative bg-[var(--panel)] rounded-[11px] h-full w-full">
                {children}
            </div>
        </div>
    );
};

export default NeonCard;
