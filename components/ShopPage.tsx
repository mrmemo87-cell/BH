import React, { useState, useEffect } from 'react';
import { ShopItem } from '../types';
import * as gameService from '../services/gameService';
import NeonCard from './NeonCard';
import { CoinIcon } from './icons';
import { useSound } from '../hooks/useSound';

const ShopPage: React.FC = () => {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const playBuySound = useSound('claim');

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const shopItems = await gameService.getShopItems();
            setItems(shopItems);
            setLoading(false);
        };
        fetchItems();
    }, []);

    const handleBuy = (item: ShopItem) => {
        console.log(`Buying ${item.title}`);
        playBuySound();
        // Here you would call an RPC to handle the purchase
    };

    if (loading) {
        return <div className="text-center p-8">Loading shop items...</div>;
    }

    return (
        <div className="container mx-auto p-4">
             <header className="text-center my-6">
                <h1 className="text-4xl font-extrabold font-orbitron neon-text">THE ARSENAL</h1>
                <p className="text-md text-gray-400 mt-1">Spend your coins on upgrades and cosmetics.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <NeonCard key={item.id} accentColor={item.item_type === 'cosmetic' ? 'pink' : 'cyan'}>
                        <div className="p-5 flex flex-col h-full">
                            <div className="flex-grow">
                                <div className="text-5xl mb-4 text-center">{item.icon}</div>
                                <h3 className="font-bold text-xl text-center font-orbitron">{item.title}</h3>
                                <p className="text-sm text-gray-400 text-center my-2 h-16">{item.description}</p>
                            </div>
                            <div className="mt-4">
                                <button 
                                    onClick={() => handleBuy(item)}
                                    className="w-full btn-neon font-bold py-3 px-4 rounded-lg text-black flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                                >
                                    <CoinIcon className="h-5 w-5" />
                                    <span>Buy for {item.price}</span>
                                </button>
                            </div>
                        </div>
                    </NeonCard>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;