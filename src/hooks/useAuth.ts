import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const AUTH_KEY = 'spop-user-auth';
const AUTH_VERSION = '1.0';

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user
    const storedData = localStorage.getItem(AUTH_KEY);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.version === AUTH_VERSION && parsed.user) {
          setUser(parsed.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = (userData: { name: string; email: string; password: string }) => {
    const newUser: UserData = {
      ...userData,
      createdAt: new Date().toISOString(),
    };

    const authData = {
      version: AUTH_VERSION,
      user: newUser,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const login = (email: string, password: string): boolean => {
    if (!user) return false;
    
    if (user.email === email && user.password === password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Don't remove user data, just set authenticated to false
  };

  const resetAccount = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signUp,
    login,
    logout,
    resetAccount,
  };
}
