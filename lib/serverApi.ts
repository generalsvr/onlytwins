// lib/api/server-api.ts
import axios, { AxiosInstance } from 'axios';
import humps from 'humps';
import { cookies } from 'next/headers';

const serverApi: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverApi.interceptors.request.use(
  async (config) => {
    const isPrivateRoute = !config.url?.includes('/public/')

    if (isPrivateRoute) {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('access_token')?.value;
      console.log(accessToken)
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
  (error) => {
    console.error('Server API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { serverApi };