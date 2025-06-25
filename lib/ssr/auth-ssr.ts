import { cookies } from 'next/headers';
import { camelizeKeys } from 'humps';

export class AuthServerService {
  private baseUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/api`;

  private async getHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: await this.getHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json()



    return camelizeKeys(data)
  }
}

export const authServerService = new AuthServerService();