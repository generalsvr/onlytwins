'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
interface StripeButtonProps {
  amount: number;
}
export default function StripeCheckoutButton({ amount }: StripeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ name: 'Тестовый продукт', price: amount, quantity: 1 }],
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании сессии');
      }

      const { id } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe не инициализирован');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error('Ошибка при перенаправлении:', error.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="relative flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Загрузка...
        </span>
      ) : (
        <span className="flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Pay with stripe
        </span>
      )}
    </button>
  );
}
