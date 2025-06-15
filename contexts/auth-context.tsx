'use client';

import { create } from 'zustand';
import { useEffect, type ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';

// Types
type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletAddress?: string;
  telegramId?: string;
  credits: number;
  isPremium: boolean;
  platform: 'web' | 'telegram';
};

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  credits: number;
  platform: 'web' | 'telegram';
  login: (email: string, password: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithTwitter: () => Promise<void>;
  signupWithTelegram: (telegramData?: any) => Promise<void>;
  logout: () => void;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;
  hasEnoughCredits: (amount: number) => boolean;
  shouldShowAuth: () => boolean;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setPlatform: (platform: 'web' | 'telegram') => void;
}

// Initial free credits amount
const FREE_CREDITS = 100;

// Mock Telegram user for mobile
const MOCK_TELEGRAM_USER: AuthUser = {
  id: 'telegram-user',
  name: 'Telegram User',
  email: 'user@telegram.org',
  telegramId: '12345',
  credits: FREE_CREDITS,
  isPremium: false,
  platform: 'telegram',
};

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Zustand store
const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  credits: 0,
  platform: 'web',

  setUser: (user) => set({
    user,
    credits: user?.credits || 0,
    isAuthenticated: !!user
  }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setPlatform: (platform) => set({ platform }),

  login: async (email: string, password: string) => {
    const { platform, setUser, setIsLoading, setIsAuthenticated } = get();
    if (platform !== 'web') return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const newUser: AuthUser = {
        id: response.data.id,
        name: response.data.name || email.split('@')[0],
        email,
        credits: response.data.credits || FREE_CREDITS,
        isPremium: response.data.isPremium || false,
        platform: 'web',
      };

      setUser(newUser);
      localStorage.setItem('onlytwins_user', JSON.stringify(newUser));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  },

  signupWithGoogle: async () => {
    const { setUser, setIsLoading, setIsAuthenticated } = get();
    setIsLoading(true);
    try {
      const response = await api.get('/auth/google');
      const newUser: AuthUser = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        credits: response.data.credits || FREE_CREDITS,
        isPremium: response.data.isPremium || false,
        platform: 'web',
      };

      setUser(newUser);
      localStorage.setItem('onlytwins_user', JSON.stringify(newUser));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google signup error:', error);
      throw new Error('Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  },

  signupWithTwitter: async () => {
    const { setUser, setIsLoading, setIsAuthenticated } = get();
    setIsLoading(true);
    try {
      const response = await api.get('/auth/twitter');
      const newUser: AuthUser = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        credits: response.data.credits || FREE_CREDITS,
        isPremium: response.data.isPremium || false,
        platform: 'web',
      };

      setUser(newUser);
      localStorage.setItem('onlytwins_user', JSON.stringify(newUser));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Twitter signup error:', error);
      throw new Error('Failed to sign up with Twitter');
    } finally {
      setIsLoading(false);
    }
  },

  signupWithTelegram: async (telegramData: any = null) => {
    const { setUser, setIsLoading, setIsAuthenticated } = get();
    setIsLoading(true);
    try {
      let telegramUser: AuthUser;

      if (telegramData) {
        const response = await api.post('/auth/telegram', telegramData);
        telegramUser = {
          id: `telegram-${response.data.id}`,
          name: response.data.first_name || 'Telegram User',
          email: response.data.username
              ? `${response.data.username}@telegram.org`
              : 'user@telegram.org',
          telegramId: response.data.id,
          credits: response.data.credits || FREE_CREDITS,
          isPremium: response.data.isPremium || false,
          platform: 'telegram',
        };
      } else {
        telegramUser = MOCK_TELEGRAM_USER;
      }

      setUser(telegramUser);
      localStorage.setItem('onlytwins_user', JSON.stringify(telegramUser));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Telegram signup error:', error);
      throw new Error('Failed to sign up with Telegram');
    } finally {
      setIsLoading(false);
    }
  },

  logout: () => {
    const { platform, setUser, setIsAuthenticated } = get();
    if (platform === 'web') {
      setUser(null);
      localStorage.removeItem('onlytwins_user');
      setIsAuthenticated(false);
    }
  },

  addCredits: (amount: number) => {
    const { user, setUser } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      credits: user.credits + amount,
    };

    setUser(updatedUser);
    localStorage.setItem('onlytwins_user', JSON.stringify(updatedUser));
  },

  useCredits: (amount: number): boolean => {
    const { user, setUser } = get();
    if (!user || user.credits < amount) return false;

    const updatedUser = {
      ...user,
      credits: user.credits - amount,
    };

    setUser(updatedUser);
    localStorage.setItem('onlytwins_user', JSON.stringify(updatedUser));
    return true;
  },

  hasEnoughCredits: (amount: number): boolean => {
    const { user } = get();
    return !!user && user.credits >= amount;
  },

  shouldShowAuth: (): boolean => {
    const { platform, isAuthenticated } = get();
    return platform === 'web' && !isAuthenticated;
  },
}));

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setIsLoading, setIsAuthenticated, setPlatform } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isMobile = window.innerWidth < 768;
        const detectedPlatform = isMobile ? 'telegram' : 'web';
        setPlatform(detectedPlatform);

        if (detectedPlatform === 'telegram') {
          setUser(MOCK_TELEGRAM_USER);
          localStorage.setItem(
              'onlytwins_user',
              JSON.stringify(MOCK_TELEGRAM_USER)
          );
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const savedUser = localStorage.getItem('onlytwins_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (!parsedUser.hasOwnProperty('credits')) {
            parsedUser.credits = FREE_CREDITS;
          }
          parsedUser.platform = detectedPlatform;
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const newPlatform = isMobile ? 'telegram' : 'web';
      setPlatform(newPlatform);

      const { user } = useAuthStore.getState();
      if (
          newPlatform === 'telegram' &&
          (!user || user.platform !== 'telegram')
      ) {
        setUser(MOCK_TELEGRAM_USER);
        localStorage.setItem(
            'onlytwins_user',
            JSON.stringify(MOCK_TELEGRAM_USER)
        );
        setIsAuthenticated(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setUser, setIsLoading, setIsAuthenticated, setPlatform]);

  return <>{children}</>;
}

// Custom hook to use auth
export function useAuth() {
  return useAuthStore();
}