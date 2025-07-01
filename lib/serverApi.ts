'use server';
// lib/api/server-api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import humps from 'humps';
import { cookies } from 'next/headers';
import { CustomAxiosRequestConfig } from '@/lib/types/axios';
import Cookies from 'js-cookie';
import { setCookie } from '@/app/actions/cookies';

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
  }
);

export { serverApi };
