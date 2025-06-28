'use server';
// lib/api/server-api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import humps from 'humps';
import { cookies } from 'next/headers';
import { CustomAxiosRequestConfig } from '@/lib/types/axios';

const serverApi: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverApi.interceptors.request.use(
  async (config) => {
    const isPrivateRoute = !config.url?.includes('/public/');

    if (isPrivateRoute) {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('access_token')?.value;

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

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

serverApi.interceptors.response.use(
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
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Обновляем токены через отдельный запрос
        const response = await serverApi.post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              ServerAction: 'true',
            },
          }
        );
        response.data = humps.camelizeKeys(response.data);
        const { accessToken } = response.data;
        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return serverApi(originalRequest);
      } catch (refreshError) {
        // Очищаем токены при ошибке
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { serverApi };
