import { cookies } from 'next/headers';

export class AuthServerService {
  private baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';

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

    return response.json();
  }
}

export const authServerService = new AuthServerService();