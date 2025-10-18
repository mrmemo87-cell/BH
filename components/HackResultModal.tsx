import React from 'react';
import NeonCard from './NeonCard';
import { CoinIcon } from './icons';
import { useSound } from '../hooks/useSound';

interface HackResultModalProps {
    result: { success: boolean; loot?: { coins: number }; penalty?: number };
    targetName: string;
    attackerName: string;
    onClose: () => void;
}

const HackResultModal: React.FC<HackResultModalProps> = ({ result, targetName, attackerName, onClose }) => {
    const playSuccessSound = useSound('claim');
    const playFailSound = useSound('error');

    React.useEffect(() => {
        if(result.success) {
            playSuccessSound();
        } else {
            playFailSound();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const title = result.success ? 'BREACH SUCCESSFUL' : 'ACCESS DENIED';
    const message = result.success
        ? `You successfully breached ${targetName}'s firewall.`
        : `${targetName}'s defenses were too strong. Your attack failed.`;
    const coinMessage = result.success
        ? `You stole ${result.loot?.coins} coins.`
        : `You paid a penalty of ${result.penalty} coins to ${targetName}.`;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <NeonCard accentColor={result.success ? 'lime' : 'pink'}>
                <div className="p-8 text-center w-96">
                    <h2 className={`text-3xl font-bold font-orbitron mb-4 ${result.success ? 'neon-text-lime' : 'neon-text-pink'}`}>
                        {title}
                    </h2>
                    <p className="text-gray-300 mb-2">{message}</p>
                    <div className="flex items-center justify-center text-lg mb-6">
                         <CoinIcon className={`h-6 w-6 mr-2 ${result.success ? 'text-yellow-400' : 'text-red-400'}`} />
                         <span className={result.success ? 'text-white' : 'text-red-300'}>
                            {coinMessage}
                         </span>
                    </div>
                    <button onClick={onClose} className="font-bold py-3 px-8 rounded-lg text-black btn-neon hover:scale-105 transition-transform">
                        Continue
                    </button>
                </div>
            </NeonCard>
        </div>
    );
};

export default HackResultModal;
