import { UserResponse } from '@/lib/types/auth';
import { serverApi } from '@/lib/serverApi';
import { cache } from 'react';

// Вариант 1: Использование React cache (для App Router)
export const getCurrentUser = cache(async (): Promise<UserResponse> => {
  const response = await serverApi.get<UserResponse>('/auth/me');
  return response.data;
});
