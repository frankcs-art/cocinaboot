import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase config is complete
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

let auth: any;
let googleProvider: any;

try {
  if (isFirebaseConfigured) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("✅ Firebase initialized successfully");
  } else {
    console.warn("⚠️ Firebase configuration missing. Authentication will use mock mode.");
    // Initializing with empty config to avoid undefined errors in some SDK parts
    // though it's better to just not use it.
    auth = { onAuthStateChanged: (cb: any) => { cb(null); return () => {}; } };
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  auth = { onAuthStateChanged: (cb: any) => { cb(null); return () => {}; } };
}

export { auth };

export const signInWithGoogle = () => {
  if (!isFirebaseConfigured) {
    console.log("Mocking Google Login...");
    return Promise.resolve({ user: { email: 'test@example.com', displayName: 'Test User' } });
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  if (!isFirebaseConfigured) return Promise.resolve();
  return signOut(auth);
};
