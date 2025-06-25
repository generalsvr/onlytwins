export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  userId: number;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  telegramId: number;
  telegramUsername: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  balances: {
    oTT: number;
    uSD: number;
  };
}

export interface AuthResponse {
  token: TokenResponse;
  user: UserResponse;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TelegramAuthRequest {
  initData?: string;
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  authDate: number;
  hash: string;
}

export interface ValidationError {
  detail: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}
export interface AuthError {
  message: string;
  status?: number;
  type?: string;
  details?: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}
