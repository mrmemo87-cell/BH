// Fix: Create firebase.ts to initialize and configure Firebase.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Using placeholder values for a mock setup.
const firebaseConfig = {
  apiKey: "AIzaSyABC..._example_key",
  authDomain: "brainheist-game.firebaseapp.com",
  projectId: "brainheist-game",
  storageBucket: "brainheist-game.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:123456abcdef123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
