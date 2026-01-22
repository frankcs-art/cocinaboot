import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from '../firebase';
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

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      Logger.success('Login successful');
    } catch (error) {
      Logger.error('Login failed', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Logger.info('User logged out');
    } catch (error) {
      Logger.error('Logout failed', error);
    }
  };

  return { user, loading, login: handleLogin, logout: handleLogout };
}
