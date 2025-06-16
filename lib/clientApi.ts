import axios, { AxiosError, AxiosInstance } from 'axios';
import humps from 'humps';
import { CustomAxiosRequestConfig } from '@/lib/types/axios';
import { getTokens, clearTokens, setTokens } from '@/lib/utils';
import { TokenResponse } from '@/lib/types/auth';

const clientApi: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Bearer token and transform keys
clientApi.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    let { accessToken, refreshToken, expiresIn } = getTokens();
    const isPrivateRoute = !config.url?.includes('/public/')

    if (config.data) {
      config.data = humps.decamelizeKeys(config.data);
    }
    if (config.params) {
      config.params = humps.decamelizeKeys(config.params);
    }

    if (isPrivateRoute) {
      if (accessToken && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      if (
        !accessToken &&
        refreshToken &&
        config.url?.includes('/auth/refresh')
      ) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Transform keys and handle token refresh
clientApi.interceptors.response.use(
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
        const response = await clientApi.post<TokenResponse>(
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
        return clientApi(originalRequest);
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

export { clientApi, setTokens, clearTokens };
