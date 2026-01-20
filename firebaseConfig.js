import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvYE3ZApemLjdwUoHQaXLpdOO3Yu2FxOQ",
    authDomain: "luna-1ec03.firebaseapp.com",
    projectId: "luna-1ec03",
    storageBucket: "luna-1ec03.firebasestorage.app",
    messagingSenderId: "954083602003",
    appId: "1:954083602003:web:cba02aabad304b69eb20a6",
    measurementId: "G-NNV9QZ87VH"
};

// 2. Initialize Core Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 3. Handle App ID (Environment safe)
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// 4. Shared Auth Helper
export const initAuth = async () => {
    try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("Auth failed:", error);
        throw error; // Re-throw to handle in UI
    }
};