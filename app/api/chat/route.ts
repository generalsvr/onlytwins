import { NextResponse } from 'next/server';

// Хранилище сообщений (в памяти, для примера)
let messages: { user: string; text: string; timestamp: string }[] = [];

export async function POST(request: Request) {
    const { user, text } = await request.json();

    if (!user || !text) {
        return NextResponse.json({ error: 'User and text are required' }, { status: 400 });
    }

    const message = {
        user,
        text,
        timestamp: new Date().toISOString(),
    };

    messages.push(message);
    return NextResponse.json({ message: 'Message sent' });
}