
import { UserResponse } from '@/lib/types/auth';
import { serverApi } from '@/lib/serverApi';


export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await serverApi.get<UserResponse>('/auth/me');
  return response.data;
}