import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/lib/services/v1/auth';
import { AuthError } from '@/lib/types/auth';
import { UserResponse, AuthResponse, UpdateProfileRequest, TelegramAuthRequest } from '@/lib/types/auth';
import { clearTokens } from '@/lib/utils';

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  credits: number;
  platform: string;
  error: AuthError | null;
  setUser: (user: UserResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  setPlatform: (platform: string) => void;
  setError: (error: AuthError | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, refCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  telegramAuth: (data: TelegramAuthRequest) => Promise<void>;
}

const FREE_CREDITS = 100;

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      credits: 0,
      platform: 'web',
      error: null,

      setUser: (user) =>
        set({
          user,
          credits: FREE_CREDITS,
          isAuthenticated: !!user,
          error: null,
        }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setPlatform: (platform) => set({ platform }),

      setError: (error) => set({ error }),

      login: async (email: string, password: string) => {
        const { setUser, setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          const response: AuthResponse = await authService.login({ email, password });
          setUser(response.user);
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Authentication failed',
            status: error.response?.status,
            type: error.response?.status === 422 ? 'validation_error' : 'authentication_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Login error:', authError);
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },

      signup: async (email: string, password: string, firstName: string, lastName: string, refCode?: string) => {
        const { setUser, setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          const response: AuthResponse = await authService.register({ email, password, firstName, lastName, refCode });
          setUser(response.user);
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Registration failed',
            status: error.response?.status,
            type: error.response?.status === 422 ? 'validation_error' : 'authentication_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Signup error:', authError);
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },

      logout: async () => {
        const { setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, credits: 0, error: null });
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Logout failed',
            status: error.response?.status,
            type: 'logout_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Logout error:', authError);
          set({ user: null, isAuthenticated: false, credits: 0, error: null });
        } finally {
          setIsLoading(false);
        }
      },

      getCurrentUser: async () => {
        const { setUser, setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          const user: UserResponse = await authService.getCurrentUser()

          setUser(user);
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Failed to fetch user',
            status: error.response?.status,
            type: error.response?.status === 401 ? 'authentication_error' : 'api_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Get current user error:', authError);
          set({ user: null, isAuthenticated: false, credits: 0 });
          clearTokens();
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        const { setUser, setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          const user: UserResponse = await authService.updateProfile(data);
          setUser(user);
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Failed to update profile',
            status: error.response?.status,
            type: error.response?.status === 422 ? 'validation_error' : 'api_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Update profile error:', authError);
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          await authService.changePassword({ currentPassword, newPassword });
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Failed to change password',
            status: error.response?.status,
            type: error.response?.status === 422 ? 'validation_error' : 'api_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Change password error:', authError);
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },

      telegramAuth: async (data: TelegramAuthRequest) => {
        const { setUser, setIsLoading, setError } = get();
        setIsLoading(true);
        setError(null);

        try {
          const response: AuthResponse = await authService.telegramAuth(data);
          setUser(response.user);
        } catch (error) {
          const authError: AuthError = {
            message: error.response?.data?.detail || error.message || 'Telegram authentication failed',
            status: error.response?.status,
            type: error.response?.status === 422 ? 'validation_error' : 'authentication_error',
            details: error.response?.data?.detail,
          };
          setError(authError);
          console.error('Telegram auth error:', authError);
          throw authError;
        } finally {
          setIsLoading(false);
        }
      },
    }),
    { name: 'auth-store' } // Имя стора для Redux DevTools
  )
);