"use server"

import { cookies } from 'next/headers';

export async function refreshTokenAction(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set('access_token', accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  });
}