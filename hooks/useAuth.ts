import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, logout, isFirebaseConfigured } from '../firebase';
import Logger from '../logger';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        Logger.success('User authenticated', { email: currentUser.email });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const result = await signInWithGoogle();
      
      // Handle both real Firebase UserCredential and our custom mock structure
      const signedInUser = result?.user;
      
      if (signedInUser && !isFirebaseConfigured) {
        // If it's a mock login, we manually set the user state since 
        // onAuthStateChanged won't trigger with the mock user
        setUser(signedInUser as User);
        Logger.success('Mock login successful', { email: signedInUser.email });
      } else if (signedInUser) {
        Logger.success('Login successful', { email: signedInUser.email });
      }
    } catch (error) {
      Logger.error('Login failed', error);
      throw error;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      Logger.info('User logged out');
    } catch (error) {
      Logger.error('Logout failed', error);
    }
  }, []);

  return { user, loading, login: handleLogin, logout: handleLogout };
}
