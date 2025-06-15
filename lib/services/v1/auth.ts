import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest, TelegramAuthRequest, TokenResponse,
  UpdateProfileRequest,
  UserResponse,
} from '@/lib/types/auth';
import { clearTokens, setTokens } from '@/lib/utils';
import { privateApi } from '@/lib/privateApi';
import { publicApi } from '@/lib/publicApi';

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await publicApi.post<AuthResponse>('/auth/login', data);
    setTokens({
      accessToken: response.data.token.accessToken,
      refreshToken: response.data.token.refreshToken,
      expiresIn: response.data.token.expiresIn,
      refreshExpiresIn: response.data.token.refreshExpiresIn,
    });
    return response.data;
  },

  // Register
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await publicApi.put<AuthResponse>('/auth/register', data);
    setTokens({
      accessToken: response.data.token.accessToken,
      refreshToken: response.data.token.refreshToken,
      expiresIn: response.data.token.expiresIn,
      refreshExpiresIn: response.data.token.refreshExpiresIn,
    });
    return response.data;
  },

  // Get current user info
  async getCurrentUser(): Promise<UserResponse> {
    const response = await privateApi.get<UserResponse>('/auth/me');
    return response.data;
  },

  // Update current user profile
  async updateProfile(data: UpdateProfileRequest): Promise<UserResponse> {
    const response = await privateApi.patch<UserResponse>('/auth/me', data);
    return response.data;
  },

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<string> {
    const response = await privateApi.post<string>('/auth/change-password', data);
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<TokenResponse> {
    const response = await privateApi.post<TokenResponse>('/auth/refresh', {});
    setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      refreshExpiresIn: response.data.refreshExpiresIn,
    });
    return response.data;
  },

  // Logout
  async logout(): Promise<string> {
    const response = await privateApi.post<string>('/auth/logout', {});
    clearTokens();
    return response.data;
  },

  // Telegram authentication
  async telegramAuth(data: TelegramAuthRequest): Promise<AuthResponse> {
    const response = await publicApi.put<AuthResponse>('/auth/telegram', data);
    setTokens({
      accessToken: response.data.token.accessToken,
      refreshToken: response.data.token.refreshToken,
      expiresIn: response.data.token.expiresIn,
      refreshExpiresIn: response.data.token.refreshExpiresIn,
    });
    return response.data;
  },
};