import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    AuthErrorCodes
} from 'firebase/auth';
import * as firestoreService from '../services/firestoreService';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const playErrorSound = useSound('error');
    const playLoginSound = useSound('login');
    const auth = getAuth();

    const signInOrSignUp = async () => {
        const email = `${username.toLowerCase()}@brain.heist`; // Construct an email from username
        setLoading(true);
        setError('');

        try {
            // Try to sign in first
            await signInWithEmailAndPassword(auth, email, password);
            playLoginSound();
        } catch (signInError: any) {
            // If user not found, try to create a new account
            if (signInError.code === AuthErrorCodes.USER_DELETED) {
                 try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    // Create a profile in Firestore for the new user
                    await firestoreService.createUserProfile(userCredential.user.uid, username, username);
                    playLoginSound();
                 } catch (signUpError: any) {
                    setError(signUpError.message);
                    playErrorSound();
                 }
            } else {
                 setError("Invalid credentials or network error.");
                 playErrorSound();
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            playErrorSound();
            return;
        }
        await signInOrSignUp();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `radial-gradient(circle, rgba(7,16,32,0.8) 0%, var(--bg) 70%)`}}>
            <div className="w-full max-w-md">
                <div className="relative p-px rounded-xl bg-[var(--panel)]">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-pink)] opacity-50 blur-xl" style={{zIndex: -1}}></div>
                    <div className="relative bg-[var(--panel)] rounded-[11px] p-8 shadow-2xl">
                        <h1 className="text-4xl font-bold text-center mb-2 font-orbitron neon-text">
                            BRAIN <span className="text-[var(--neon-pink)]">HEIST</span>
                        </h1>
                        <p className="text-center text-gray-400 mb-8">Secure login required.</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                                    Agent Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g., Sobbi"
                                    className="w-full bg-[var(--bg)] border border-[var(--glass-border)] rounded-lg py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="************"
                                    className="w-full bg-[var(--bg)] border border-[var(--glass-border)] rounded-lg py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}

                            <div className="flex items-center justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full font-bold py-3 px-6 rounded-lg text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 btn-neon hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {loading ? 'Authenticating...' : 'Access System'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
