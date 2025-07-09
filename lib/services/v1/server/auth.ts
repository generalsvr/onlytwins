import { UserResponse } from '@/lib/types/auth';
import { serverApi } from '@/lib/serverApi';
import { cache } from 'react';


export const getCurrentUser = cache(async (): Promise<UserResponse> => {
  const response = await serverApi.get<UserResponse>('/auth/me');
  return response.data;
});
