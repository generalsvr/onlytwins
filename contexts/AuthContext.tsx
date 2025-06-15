// contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isMeLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isMeLoading } = useAuthStore((state) => state);
  return (
    <AuthContext.Provider value={{ isAuthenticated, isMeLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};