// pages/api/auth/signup.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serialize } from 'cookie';

// Input validation schema
const tokenRequestSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    ref: z.string().optional(),
});

// Mock user data for response
const mockUser = {
    id: 'mock-user-123',
    email: '',
    name: 'Mock User',
    credits: 100,
    isPremium: false,
    platform: 'web' as const,
};

// Generate a fake JWT-like token (not cryptographically secure, for testing only)
const generateFakeToken = (userId: string, type: 'access' | 'refresh'): string => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
    const exp = type === 'access' ? Math.floor(Date.now() / 1000) + 15 * 60 : Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const payload = Buffer.from(JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000), exp, type })).toString('base64');
    return `${header}.${payload}.mock-signature`;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, ref } = tokenRequestSchema.parse(body);

        // Simulate user existence check (mock failure case)
        if (email === 'taken@example.com') {
            return NextResponse.json(
                { message: 'Email already exists', code: 'USER_EXISTS' },
                { status: 400 }
            );
        }

        // Simulate authentication failure
        if (password === 'wrongpassword') {
            return NextResponse.json(
                { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
                { status: 401 }
            );
        }

        // Create mock user response
        const user = { ...mockUser, email };
        const accessToken = generateFakeToken(user.id, 'access');
        const refreshToken = generateFakeToken(user.id, 'refresh');

        // Устанавливаем HttpOnly cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/',
        };

        // Создаем массив строк для Set-Cookie
        const cookies = [
            serialize('accessToken', accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60, // 15 минут для accessToken
            }),
            serialize('refreshToken', refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60, // 7 дней для refreshToken
            }),
        ];

        // Создаем ответ
        const response = NextResponse.json(
            {
                user,
                message: 'Registration successful',
            },
            { status: 200 }
        );

        // Устанавливаем заголовок Set-Cookie
        response.headers.set('Set-Cookie', cookies.join(', '));

        return response;
    } catch (error) {
        console.error('Signup API error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: 'Invalid input data',
                    code: 'INVALID_INPUT',
                    errors: error.errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'Failed to register user',
                code: 'SERVER_ERROR',
            },
            { status: 500 }
        );
    }
}