import { redirect } from 'next/navigation';

export async function GET(req: Request) {
    const host = req.headers.get('host');
    const redirectUri = `https://${host}/api/auth/google/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

    redirect(googleAuthUrl);
}