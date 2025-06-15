import { NextResponse } from 'next/server';

// Инициализация messages внутри модуля
let messages: { user: string; text: string; timestamp: string }[] = [];

export async function GET() {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    };

    const stream = new ReadableStream({
        start(controller) {
            // Проверка, что messages определён
            if (!Array.isArray(messages)) {
                messages = []; // Инициализация, если не определён
            }

            // Отправляем существующие сообщения
            messages.forEach((msg) => {
                const data = `data: ${JSON.stringify(msg)}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
            });

            // Проверка новых сообщений
            let lastMessageCount = messages.length;
            const checkNewMessages = () => {
                if (messages.length > lastMessageCount) {
                    const newMessages = messages.slice(lastMessageCount);
                    newMessages.forEach((msg) => {
                        const data = `data: ${JSON.stringify(msg)}\n\n`;
                        controller.enqueue(new TextEncoder().encode(data));
                    });
                    lastMessageCount = messages.length;
                }
            };

            const interval = setInterval(checkNewMessages, 1000);

            // Очистка при закрытии
            return () => {
                clearInterval(interval);
                controller.close();
            };
        },
    });

    return new NextResponse(stream, { headers });
}