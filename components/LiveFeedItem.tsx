// Fix: Create the LiveFeedItem component to be used by LiveFeed.
import React from 'react';
import { LiveFeedEvent } from '../types';

const getIconForType = (type: LiveFeedEvent['type']) => {
    switch (type) {
        case 'hack': return '💥';
        case 'task': return '✅';
        case 'purchase': return '🛒';
        case 'level_up': return '🚀';
        default: return '➡️';
    }
};

const LiveFeedItem: React.FC<{ event: LiveFeedEvent }> = ({ event }) => {
    const timeAgo = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="p-2 bg-[var(--glass)] rounded-md text-sm flex items-start">
            <span className="mr-3 text-lg">{getIconForType(event.type)}</span>
            <div className="flex-grow">
                <p className="text-gray-300">{event.message}</p>
                <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
        </div>
    );
};

export default LiveFeedItem;
