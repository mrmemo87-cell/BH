import React, { useState, useEffect } from 'react';
import NeonCard from './NeonCard';
import LiveFeedItem from './LiveFeedItem';
import { LiveFeedEvent } from '../types';
import * as firestoreService from '../services/firestoreService';

const LiveFeed: React.FC = () => {
    const [events, setEvents] = useState<LiveFeedEvent[]>([]);
    
    useEffect(() => {
        // onSnapshot returns an unsubscribe function.
        // We call it when the component unmounts to prevent memory leaks.
        const unsubscribe = firestoreService.getLiveFeedEvents((newEvents) => {
            setEvents(newEvents);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NeonCard>
            <div className="p-4 h-[400px] flex flex-col">
                <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-purple">Live Feed</h3>
                <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                    {events.map(event => (
                        <LiveFeedItem key={event.id} event={event} />
                    ))}
                     {events.length === 0 && <p className="text-sm text-gray-500 text-center">No recent activity...</p>}
                </div>
            </div>
        </NeonCard>
    );
};

export default LiveFeed;
