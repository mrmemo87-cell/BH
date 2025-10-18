import React from 'react';
import { Item } from '../types';
import NeonCard from './NeonCard';

interface InventoryPanelProps {
    inventory: Item[];
    onActivateItem: (item: Item) => void;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, onActivateItem }) => {
    return (
        <NeonCard>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-3 font-orbitron neon-text-purple">Inventory</h3>
                {inventory.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {inventory.map(item => (
                            <div key={item.id} className="p-3 bg-[var(--glass)] border border-[var(--glass-border)] rounded-lg text-center flex flex-col">
                                <div className="text-3xl mb-1">{item.icon}</div>
                                <p className="text-xs font-semibold text-white flex-grow">{item.name}</p>
                                <p className="text-[10px] text-gray-400 truncate mb-2">{item.description}</p>
                                <button
                                    onClick={() => onActivateItem(item)}
                                    className="text-xs font-bold py-1 px-2 rounded-md text-black bg-gradient-to-r from-lime-400 to-green-500 hover:scale-105 transition-transform"
                                >
                                    Activate
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Inventory is empty.</p>
                )}
            </div>
        </NeonCard>
    );
};

export default InventoryPanel;
