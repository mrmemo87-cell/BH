import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from './types';
// FIX: The 'firebase/auth' module is not resolving correctly. Switched to 'firebase/auth/lite'
import { onAuthStateChanged, User } from 'firebase/auth/lite';
import { auth } from './firebase';
import * as firestoreService from './services/firestoreService';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import TasksPage from './components/TasksPage';
import ActivityPage from './components/ActivityPage';
import ShopPage from './components/ShopPage';
import LeaderboardPage from './components/LeaderboardPage';
import HomePage from './components/HomePage';
import { useSound } from './hooks/useSound';
import AudioPlayer from './components/AudioPlayer';
import { seedDatabase } from './services/seedDatabase';

type Page = 'home' | 'profile' | 'tasks' | 'activity' | 'shop' | 'leaderboard';

const App: React.FC = () => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activePage, setActivePage] = useState<Page>('home');
    const playLogoutSound = useSound('error'); // Re-using sound

    useEffect(() => {
        // This effect runs only once on initial mount to seed the DB
        const initializeApp = async () => {
            await seedDatabase();
        };
        initializeApp();
    }, []);

    const fetchProfile = useCallback(async (user: User) => {
        setIsLoading(true);
        const profile = await firestoreService.getUserProfile(user.uid);
        setCurrentUserProfile(profile);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFirebaseUser(user);
                fetchProfile(user);
            } else {
                setFirebaseUser(null);
                setCurrentUserProfile(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [fetchProfile]);

    const handleLogout = async () => {
        playLogoutSound();
        await auth.signOut();
        setActivePage('home');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[var(--bg)] text-white flex items-center justify-center font-orbitron">Loading System Mainframe...</div>;
    }

    if (!firebaseUser || !currentUserProfile) {
        return <LoginPage onLoginSuccess={() => {}} />;
    }
    
    const NavLink: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
        <button
            onClick={() => setActivePage(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === page ? 'bg-[var(--neon-cyan)] text-black' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    const renderPage = () => {
        switch(activePage) {
            case 'home': return <HomePage />;
            case 'profile': return <ProfilePage user={currentUserProfile} onProfileUpdate={() => fetchProfile(firebaseUser)} />;
            case 'tasks': return <TasksPage user={currentUserProfile} onProfileUpdate={() => fetchProfile(firebaseUser)} />;
            case 'activity': return <ActivityPage currentUser={currentUserProfile} onProfileUpdate={() => fetchProfile(firebaseUser)} />;
            case 'shop': return <ShopPage onPurchase={() => fetchProfile(firebaseUser)} />;
            case 'leaderboard': return <LeaderboardPage currentUser={currentUserProfile} />;
            default: return <HomePage />;
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-white font-sans">
            <nav className="bg-[var(--panel)] border-b border-[var(--glass-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                         <div className="flex items-center">
                            <span className="font-orbitron font-bold text-xl neon-text">BRAIN<span className="text-[var(--neon-pink)]">HEIST</span></span>
                            <div className="hidden md:block ml-10 space-x-4">
                               <NavLink page="home" label="Home" />
                               <NavLink page="profile" label="Profile" />
                               <NavLink page="tasks" label="Tasks" />
                               <NavLink page="activity" label="Activity" />
                               <NavLink page="shop" label="Shop" />
                               <NavLink page="leaderboard" label="Leaderboard" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <span className="text-gray-400">Agent:</span> <span className="font-bold">{currentUserProfile.display_name}</span>
                            </div>
                             <AudioPlayer />
                            <button onClick={handleLogout} className="text-sm font-semibold bg-red-600/50 hover:bg-red-500/80 px-3 py-2 rounded-md transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                {renderPage()}
            </main>
        </div>
    );
};

export default App;