import { NextResponse } from 'next/server';
import { parse } from 'cookie';

// Mock user data (same as in signup)
const mockUser = {
    id: 'mock-user-123',
    email: 'mock@example.com',
    name: 'Mock User',
    credits: 100,
    isPremium: false,
    platform: 'web' as const,
};

// Функция для проверки токена (имитация декодирования JWT)
const verifyFakeToken = (token: string): { sub: string; type: string; exp: number } | null => {
    try {
        // Разделяем токен на части (header.payload.signature)
        const [payloadBase64] = token.split('.');
        const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

        // Проверяем, истек ли токен
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return null; // Токен истек
        }

        return payload; // Возвращаем декодированный payload
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

export async function GET(request: Request) {
    try {
        // Парсим cookies из заголовка
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json(
                { message: 'No cookies provided', code: 'NO_TOKEN' },
                { status: 401 }
            );
        }

        const cookies = parse(cookieHeader);
        const accessToken = cookies.accessToken;

        if (!accessToken) {
            return NextResponse.json(
                { message: 'Access token missing', code: 'NO_TOKEN' },
                { status: 401 }
            );
        }

        // Проверяем токен
        const tokenPayload = verifyFakeToken(accessToken);
        if (!tokenPayload || tokenPayload.type !== 'access' || tokenPayload.sub !== mockUser.id) {
            return NextResponse.json(
                { message: 'Invalid or expired access token', code: 'INVALID_TOKEN' },
                { status: 401 }
            );
        }

        // Возвращаем данные пользователя
        return NextResponse.json(
            {
                user: mockUser,
                message: 'User data retrieved successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Auth/me API error:', error);

        return NextResponse.json(
            {
                message: 'Failed to retrieve user data',
                code: 'SERVER_ERROR',
            },
            { status: 500 }
        );
    }
}