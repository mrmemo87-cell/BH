// Fix: Create missing LiveFeedItem.tsx component.
import React from 'react';
import { LiveFeedEvent } from '../types';
import { CheckIcon, XPIcon } from './icons';

const getIconForType = (type: LiveFeedEvent['type']) => {
    switch (type) {
        case 'hack':
            return '🎯';
        case 'task_complete':
            return <CheckIcon className="h-4 w-4 text-green-400" />;
        case 'purchase':
            return '🛒';
        case 'level_up':
            return <XPIcon className="h-4 w-4 text-purple-400" />;
        default:
            return '•';
    }
};

const LiveFeedItem: React.FC<{ event: LiveFeedEvent }> = ({ event }) => {
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="flex items-start p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-center w-6 h-6 mr-3 text-lg shrink-0">
                {getIconForType(event.type)}
            </div>
            <div className="flex-grow">
                <p className="text-sm text-gray-300 leading-tight">{event.message}</p>
                <p className="text-xs text-gray-500">{timeAgo(event.timestamp)}</p>
            </div>
        </div>
    );
};

export default LiveFeedItem;
