// Fix: Create firebase.ts to initialize and configure Firebase.
import { initializeApp } from 'firebase/app';
// FIX: The 'firebase/auth' module is not resolving correctly. Switched to 'firebase/auth/lite'
import { getAuth } from 'firebase/auth/lite';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMUEP4tY4MI4RXjVK_UK_nl_YdQnvgHPg",
  authDomain: "copy-of-brain-heist.firebaseapp.com",
  projectId: "copy-of-brain-heist",
  storageBucket: "copy-of-brain-heist.firebasestorage.app",
  messagingSenderId: "79933339835",
  appId: "1:79933339835:web:e085fee5330c4571da919e",
  measurementId: "G-5GZGFVF8PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };