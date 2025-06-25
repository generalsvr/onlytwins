import { cookies } from 'next/headers';
import { authServerService } from '@/lib/ssr/auth-ssr';
import { UserResponse } from '@/lib/types/auth';

interface AuthServerResponse {
  user: UserResponse | null;
  isAuthenticated: boolean;
  needsRefresh: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
  }
}

export default async function useAuthServerState(): Promise<AuthServerResponse> {

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

    const user = await authServerService.getCurrentUser();

    return {
      user,
      isAuthenticated: true,
      needsRefresh: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: Error) {
    console.log(error)
    return {
      user: null,
      isAuthenticated: false,
      needsRefresh: false,
    };
  }
}
