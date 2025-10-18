
import React from 'react';

export const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        <path d="M10 3.5a1.5 1.5 0 011.5 1.5v.062A5.518 5.518 0 008.5 9.5v.062A5.518 5.518 0 005.438 13.5H5.5a1.5 1.5 0 010-3h.062A5.518 5.518 0 009.5 6.5h.062A5.518 5.518 0 0013.5 3.5H10z" fillOpacity="0.5"/>
    </svg>
);

export const XPIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.25 5.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM8.5 9.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v3.5a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-3.5z" clipRule="evenodd" />
        <path d="M11.96 13.04a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 10.17l1.54-1.54a1 1 0 111.414 1.414l-2 2z" fillOpacity="0.5" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const StreakIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0zm8 0a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
