import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: { name: string; price: number; quantity: number }) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${request.headers.get('origin')}?payment=success`,
            cancel_url: `${request.headers.get('origin')}?payment=failed`,
        });

        return NextResponse.json({ id: session.id });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}