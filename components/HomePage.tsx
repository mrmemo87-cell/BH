import React from 'react';
import NeonCard from './NeonCard';

const InstructionCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <NeonCard accentColor="cyan">
        <div className="p-6 h-full">
            <div className="flex items-center mb-3">
                <span className="text-3xl mr-4">{icon}</span>
                <h3 className="text-xl font-bold font-orbitron neon-text-pink">{title}</h3>
            </div>
            <p className="text-gray-300 text-sm">{children}</p>
        </div>
    </NeonCard>
);

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <header className="text-center my-8">
                <h1 className="text-5xl font-extrabold font-orbitron neon-text">WELCOME, AGENT</h1>
                <p className="text-lg text-gray-400 mt-2">Your mission, should you choose to accept it...</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InstructionCard title="The Heist" icon="🎯">
                    Navigate to the <strong>Activity</strong> page to see other agents in your batch. Analyze their stats, plan your attack, and initiate hacks to steal coins. Every hack costs stamina, so choose your targets wisely.
                </InstructionCard>
                <InstructionCard title="The Tasks" icon="📝">
                    Visit the <strong>Tasks</strong> page to complete daily and weekly objectives. These are your primary source of coins and XP. Answer questions correctly across various subjects to earn rewards.
                </InstructionCard>
                 <InstructionCard title="The Arsenal" icon="⚙️">
                    The <strong>Shop</strong> is where you convert your stolen coins into power. Purchase items to boost your Hacking and Security skills, or buy cosmetics to customize your profile and stand out.
                </InstructionCard>
                 <InstructionCard title="The Profile" icon="👤">
                    Your <strong>Profile</strong> is your identity. Track your stats, manage your inventory, and see your active effects. A strong profile is a sign of a formidable hacker.
                </InstructionCard>
                 <InstructionCard title="The Ranks" icon="🏆">
                    Climb the <strong>Leaderboard</strong> by gaining XP from completing tasks. Compare your progress against your batch or view the global rankings. Only the most dedicated agents reach the top.
                </InstructionCard>
                 <InstructionCard title="The Rules" icon="📜">
                    You cannot hack yourself or agents from other batches. If you are hacked, you enter a 1-hour cooldown where you cannot be targeted again. Hacking consumes stamina, which regenerates over time.
                </InstructionCard>
            </div>
        </div>
    );
};

export default HomePage;