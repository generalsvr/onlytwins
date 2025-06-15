import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const host = req.headers.get('host');
  const redirectUri = `https://${host}/api/auth/google/callback`
  console.log('redirectUri', redirectUri);
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri:redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('tokenData')
    console.log(tokenData);
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );
    const userData = await userResponse.json();
    console.log('userData')
    console.log(userData);
    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', tokenData.access_token, {
      httpOnly: true, // Защита от XSS
      secure: process.env.NODE_ENV === 'production', // Только HTTPS в продакшене
      sameSite: 'strict', // Защита от CSRF
      path: '/', // Доступно для всего приложения
      maxAge: 60 * 60, // 1 час (настройте под expires_in из tokenData)
    });

    // const backendResponse = await fetch(
    //   'https://your-backend.com/api/auth/google',
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       access_token: tokenData.access_token,
    //       id_token: tokenData.id_token,
    //       user: userData,
    //     }),
    //   }
    // );
    //
    // const backendData = await backendResponse.json();

    // Перенаправление или ответ в зависимости от ответа бэкенда

    return new Response(null, {
      status: 302,
      headers: { Location: 'https://onlytwins.jundev.tech/' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch access token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
