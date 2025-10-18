
import React from 'react';
import TasksPage from './components/TasksPage';

function App() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-gray-200">
            <header className="p-4 border-b border-b-[var(--glass-border)]">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-orbitron neon-text">
                        BRAIN <span className="text-[var(--neon-pink)]">HEIST</span>
                    </h1>
                    <nav className="flex items-center space-x-6">
                        <a href="#" className="text-sm font-medium hover:text-[var(--neon-cyan)] transition-colors">Profile</a>
                        <a href="#" className="text-sm font-medium text-[var(--neon-cyan)] border-b-2 border-[var(--neon-cyan)] pb-1">Tasks</a>
                        <a href="#" className="text-sm font-medium hover:text-[var(--neon-cyan)] transition-colors">Shop</a>
                        <a href="#" className="text-sm font-medium hover:text-[var(--neon-cyan)] transition-colors">Leaderboard</a>
                    </nav>
                </div>
            </header>
            <main>
                <TasksPage />
            </main>
        </div>
    );
}

export default App;
