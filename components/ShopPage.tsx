import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import * as firestoreService from '../services/firestoreService';
import { auth } from '../firebase';
import NeonCard from './NeonCard';
import { CoinIcon } from './icons';
import { useSound } from '../hooks/useSound';

interface ShopPageProps {
    onPurchase: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onPurchase }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const playPurchaseSound = useSound('purchase');
    const playErrorSound = useSound('error');

    useEffect(() => {
        const fetchItems = async () => {
            const shopItems = await firestoreService.getShopItems();
            setItems(shopItems);
        };
        fetchItems();
    }, []);

    const handlePurchase = async (item: Item) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        setLoading(item.id);
        setFeedback(null);
        
        try {
            await firestoreService.buyItem(userId, item);
            setFeedback({ type: 'success', message: `Successfully purchased ${item.name}!` });
            playPurchaseSound();
            onPurchase(); // Notify app to update profile
        } catch (e: any) {
             setFeedback({ type: 'error', message: e.message || 'Purchase failed.' });
             playErrorSound();
        }

        setLoading(null);
        setTimeout(() => setFeedback(null), 3000);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold font-orbitron text-center my-6 neon-text">THE ARSENAL</h1>
            {feedback && (
                <div className={`text-center p-2 rounded-lg mb-4 ${feedback.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-400'}`}>
                    {feedback.message}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <NeonCard key={item.id}>
                        <div className="p-4 flex flex-col h-full">
                            <div className="text-5xl text-center mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-center">{item.name}</h3>
                            <p className="text-sm text-gray-400 text-center flex-grow my-2">{item.description}</p>
                            <div className="my-4">
                                {item.effects.map((effect, i) => (
                                    <p key={i} className="text-xs text-center text-[var(--neon-lime)]">{effect.name}</p>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePurchase(item)}
                                disabled={!!loading}
                                className="w-full mt-auto font-bold py-3 px-6 rounded-lg text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 btn-neon hover:scale-105 disabled:opacity-50"
                            >
                                {loading === item.id ? 'Processing...' : (
                                    <div className="flex items-center justify-center">
                                        <CoinIcon className="h-5 w-5 mr-2" />
                                        {item.cost.toLocaleString()}
                                    </div>
                                )}
                            </button>
                        </div>
                    </NeonCard>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
