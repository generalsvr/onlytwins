import axios, { AxiosError, AxiosInstance } from 'axios';
import humps from 'humps';
import { CustomAxiosRequestConfig } from '@/lib/types/axios';
import { getTokens, clearTokens, setTokens } from '@/lib/utils';
import { TokenResponse } from '@/lib/types/auth';

const privateApi: AxiosInstance = axios.create({
  baseURL: '/api/private',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Bearer token and transform keys
privateApi.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    let { accessToken, refreshToken, expiresIn } = getTokens();

    // Add Authorization header if token exists and not already set
    if (accessToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (!accessToken && refreshToken && config.url?.includes('/auth/refresh')) {
      config.headers['Authorization'] = `Bearer ${refreshToken}`;
    }

    // Transform request data and params
    if (config.data) {
      config.data = humps.decamelizeKeys(config.data);
    }
    if (config.params) {
      config.params = humps.decamelizeKeys(config.params);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Transform keys and handle token refresh
privateApi.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        // Request new tokens using refresh token
        const response = await privateApi.post<TokenResponse>(
          '/api/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn,
          refreshExpiresIn,
        } = response.data;
        setTokens({
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn,
          refreshExpiresIn,
        });

        // Update original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        clearTokens();
        // Optionally redirect to login
        // if (typeof window !== 'undefined') {
        //   window.location.href = '/login';
        // }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { privateApi, setTokens, clearTokens };
