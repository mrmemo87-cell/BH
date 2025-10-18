import React from 'react';
import { FullInventoryRow } from '../types';
import NeonCard from './NeonCard';

const InventoryPanel: React.FC<{ inventory: FullInventoryRow[] }> = ({ inventory }) => {
    return (
        <NeonCard>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-pink">Inventory</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {inventory.map(item => (
                        <div key={item.id} className="group relative bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg p-2 flex flex-col items-center justify-center aspect-square text-center">
                            <div className="absolute top-1 right-1 bg-black/50 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {item.qty}
                            </div>
                            <div className="text-3xl mb-1">📦</div>
                            <p className="text-xs font-semibold leading-tight">{item.shop_item.title}</p>
                            
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs bg-[var(--neon-cyan)] text-black font-bold py-1 px-3 rounded">
                                    Activate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </NeonCard>
    );
};

export default InventoryPanel;