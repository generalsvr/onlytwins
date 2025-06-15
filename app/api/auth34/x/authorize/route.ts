import { redirect } from 'next/navigation';

export async function GET () {
    const twitterAuthURL = 'https://twitter.com/i/oauth2/authorize';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.X_CLIENT_ID || "",
        redirect_uri: 'https://onlytwins.jundev.tech/api/auth/x/callback',
        scope: 'tweet.read users.read offline.access', // Укажите нужные scope
        state: 'state', // Используйте уникальное значение для защиты от CSRF
        code_challenge: 'challenge', // Используйте PKCE (например, через SHA256)
        code_challenge_method: 'plain', // Или 'S256' для PKCE
    });

    redirect(`${twitterAuthURL}?${params.toString()}`);
}