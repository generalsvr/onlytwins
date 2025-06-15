import axios from 'axios';
import { redirect } from 'next/navigation';

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    const tokenURL = 'https://api.twitter.com/2/oauth2/token';

    const response = await axios.post(
      tokenURL,
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.X_CLIENT_ID || '',
        redirect_uri: 'https://onlytwins.jundev.tech/api/auth/x/callback',
        code_verifier: 'challenge', // Должен совпадать с code_challenge
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    // Установка cookies
    const cookieOptions = {
      httpOnly: true, // Защита от XSS (доступ только на сервере)
      secure: process.env.NODE_ENV === 'production', // Только по HTTPS в продакшене
      sameSite: 'strict', // Защита от CSRF
      path: '/', // Доступны на всем сайте
      maxAge: expires_in, // Время жизни access_token
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // Например, 30 дней для refresh_token
    };

    // Создаем объект Headers
    const responseHeaders = new Headers({
      Location: 'https://onlytwins.jundev.tech/',
    });
    // Добавляем cookies через append
    responseHeaders.append(
      'Set-Cookie',
      `access_token=${access_token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/; Max-Age=${expires_in}`
    );
    responseHeaders.append(
      'Set-Cookie',
      `refresh_token=${refresh_token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`
    );
    return new Response(null, {
      status: 302,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch access token' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
