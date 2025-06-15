import axios, { AxiosError, AxiosInstance } from 'axios';
import humps from 'humps';
import { CustomAxiosRequestConfig } from '@/lib/types/axios';
import { getTokens, clearTokens, setTokens } from '@/lib/utils';
import { TokenResponse } from '@/lib/types/auth';

const publicApi: AxiosInstance = axios.create({
  baseURL: '/api/public',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Bearer token and transform keys
publicApi.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
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
publicApi.interceptors.response.use((response) => {
  if (response.data) {
    response.data = humps.camelizeKeys(response.data);
  }
  return response;
});

export { publicApi, setTokens, clearTokens };
