// Fix: Create missing authService.ts.
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

// This file can centralize authentication-related logic.
// The LoginPage component currently handles this logic directly,
// but it could be refactored to use this service.

export const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
};

export const register = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
};

export const logout = () => {
    return signOut(auth);
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
