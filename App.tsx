import React, { useState, useCallback } from 'react';
import TasksPage from './components/TasksPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ActivityPage from './components/ActivityPage';
import ShopPage from './components/ShopPage';
import LeaderboardPage from './components/LeaderboardPage';
import AudioPlayer from './components/AudioPlayer';
import * as gameService from './services/gameService';
import { User } from './types';

type Page = 'home' | 'profile' | 'tasks' | 'activity' | 'shop' | 'leaderboard';

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activePage, setActivePage] = useState<Page>('home');

    const handleLogin = useCallback(async (email: string, pass: string): Promise<boolean> => {
        const user = await gameService.login(email, pass);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }, []);

    const handleLogout = () => {
        setCurrentUser(null);
        setActivePage('home');
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const NavLink: React.FC<{ page: Page, children: React.ReactNode }> = ({ page, children }) => {
        const isActive = activePage === page;
        return (
            <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActivePage(page); }}
                className={`text-sm font-medium transition-colors ${isActive ? 'text-[var(--neon-cyan)] border-b-2 border-[var(--neon-cyan)] pb-1' : 'hover:text-[var(--neon-cyan)]'}`}
            >
                {children}
            </a>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-gray-200">
            <header className="p-4 border-b border-b-[var(--glass-border)] sticky top-0 bg-[var(--bg)]/80 backdrop-blur-sm z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" onClick={(e) => {e.preventDefault(); setActivePage('home')}} className="text-2xl font-bold font-orbitron neon-text cursor-pointer">
                        BRAIN <span className="text-[var(--neon-pink)]">HEIST</span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLink page="home">Home</NavLink>
                        <NavLink page="activity">Activity</NavLink>
                        <NavLink page="tasks">Tasks</NavLink>
                        <NavLink page="shop">Shop</NavLink>
                        <NavLink page="leaderboard">Leaderboard</NavLink>
                        <NavLink page="profile">Profile</NavLink>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <AudioPlayer />
                        <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Logout</button>
                    </div>
                </div>
            </header>
            <main>
                {activePage === 'home' && <HomePage />}
                {activePage === 'tasks' && <TasksPage />}
                {activePage === 'profile' && <ProfilePage user={currentUser} />}
                {activePage === 'activity' && <ActivityPage currentUser={currentUser} />}
                {activePage === 'shop' && <ShopPage />}
                {activePage === 'leaderboard' && <LeaderboardPage />}
            </main>
        </div>
    );
}

export default App;