import { cookies } from 'next/headers';
import { UserResponse } from '@/lib/types/auth';
import { getCurrentUser } from '@/lib/services/v1/server/auth';

interface AuthServerResponse {
  user: UserResponse | null;
  isAuthenticated: boolean;
  needsRefresh: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
  }
}

export default async function getAuthState(): Promise<AuthServerResponse> {

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!accessToken && !refreshToken) {
      return {
        user: null,
        isAuthenticated: false,
        needsRefresh: false,
      };
    }

    if (!accessToken && refreshToken) {
      return {
        user: null,
        isAuthenticated: true,
        needsRefresh: true
      };
    }
    const user = await getCurrentUser();
    return {
      user,
      isAuthenticated: true,
      needsRefresh: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: Error) {
    return {
      user: null,
      isAuthenticated: false,
      needsRefresh: false,
    };
  }
}
