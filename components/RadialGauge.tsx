import React, { useEffect, useState } from 'react';

interface RadialGaugeProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    label: string;
    color?: string;
}

const RadialGauge: React.FC<RadialGaugeProps> = ({
    value,
    max,
    size = 80,
    strokeWidth = 6,
    label,
    color = 'var(--neon-cyan)'
}) => {
    // Ensure value doesn't exceed max for visual correctness
    const clampedValue = Math.min(value, max);
    
    const [displayValue, setDisplayValue] = useState(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = max > 0 ? (clampedValue / max) : 0;
    const offset = circumference * (1 - progress);

    // Animate the number counting up/down
    useEffect(() => {
        if (displayValue !== clampedValue) {
            const step = clampedValue > displayValue ? 1 : -1;
            const timer = setTimeout(() => {
                setDisplayValue(v => v + step);
            }, 30);
            return () => clearTimeout(timer);
        }
    }, [displayValue, clampedValue]);


    return (
        <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--glass-border)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Foreground circle (progress) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-700 ease-in-out"
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-orbitron font-bold neon-text" style={{ color }}>{displayValue}</span>
                 <span className="text-xs text-gray-400 -mt-1">{label}</span>
            </div>
        </div>
    );
};

export default RadialGauge;
