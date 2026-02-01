
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import Logger from "./logger";

// Estos valores deben ser configurados en .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let auth: any;
let googleProvider: any;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  Logger.error("Firebase Initialization Failed. check your .env.local settings.", error);
  // Mocking auth for development if needed
  auth = {
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    signOut: () => Promise.resolve(),
    currentUser: null
  };
  // Better mock for GoogleAuthProvider to avoid crashes in signInWithPopup
  googleProvider = class MockProvider {};
}

export { auth, googleProvider };
