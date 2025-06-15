// pages/api/auth/logout.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    try {
        // Устанавливаем cookies с истекшим сроком действия для удаления
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/',
            maxAge: 0, // Устанавливаем maxAge в 0, чтобы cookie истекли немедленно
        };

        const cookies = [
            serialize('accessToken', '', cookieOptions),
            serialize('refreshToken', '', cookieOptions),
        ];

        // Создаем ответ
        const response = NextResponse.json(
            {
                message: 'Logout successful',
            },
            { status: 200 }
        );

        // Устанавливаем заголовок Set-Cookie для удаления cookies
        response.headers.set('Set-Cookie', cookies.join(', '));

        return response;
    } catch (error) {
        console.error('Logout API error:', error);

        return NextResponse.json(
            {
                message: 'Failed to logout',
                code: 'SERVER_ERROR',
            },
            { status: 500 }
        );
    }
}
