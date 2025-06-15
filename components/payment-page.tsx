'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

interface PaymentPageProps {
  onBack: () => void;
}

export default function PaymentPage({ onBack }: PaymentPageProps) {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(true);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const paymentMethods = [
    { id: 1, name: 'Telegram Stars', selected: true },
    { id: 2, name: 'Pay with Card', selected: false },
  ];

  const handlePayment = () => {
    // In a real app, this would process the payment
    // For now, we'll just go back to the models page
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { page: 'models' } })
    );
  };

  return (
    <div
      className={`${isMobile ? 'p-4 flex flex-col h-full' : 'pt-20 px-8 max-w-3xl mx-auto'}`}
    >
      <button
        onClick={onBack}
        className={`mb-4 flex items-center ${isMobile ? '' : 'text-zinc-400 hover:text-white'}`}
      >
        <ArrowLeft className="h-6 w-6 mr-2" />
        {!isMobile && 'Back'}
      </button>

      <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold mb-6`}>
        {t('payment.title') || 'Payment Method'}
      </h1>

      <div
        className={`bg-zinc-900 rounded-xl p-4 mb-4 flex items-center ${isMobile ? '' : 'p-6'}`}
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image
            src="/brown-haired-anime-girl.png"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
            {t('payment.purchasing') || 'Purchasing a sub for 1 Month'}
          </p>
          <div className="flex items-center">
            <span className="text-zinc-400 mr-1">+</span>
            <span className="text-red-500 mr-1">💋</span>
            <span className="text-zinc-400">33 TT</span>
          </div>
        </div>
        <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
          $4.95
        </div>
      </div>

      <div className={isMobile ? '' : 'grid grid-cols-2 gap-4'}>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-zinc-900 rounded-xl p-4 mb-4 flex justify-between items-center ${
              isMobile
                ? ''
                : method.selected
                  ? 'border-2 border-pink-400'
                  : 'border border-zinc-800'
            } hover:border-pink-400 transition-colors cursor-pointer`}
          >
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
              {method.name}
            </h2>
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                method.selected ? 'border-pink-400' : 'border-zinc-600'
              } flex items-center justify-center`}
            >
              {method.selected && (
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`${isMobile ? 'mt-auto' : 'mt-8'}`}>
        <p className="text-center text-zinc-400 mb-4">
          {t('payment.anonymous') || 'All payments are anonymous and secure.'}
        </p>
        <button
          onClick={handlePayment}
          className={`w-full bg-pink-400 text-white py-4 rounded-xl ${isMobile ? 'text-xl' : 'text-xl font-medium'} hover:bg-pink-500 transition-colors`}
        >
          {t('payment.payNow') || 'Pay Now'}
        </button>
      </div>
    </div>
  );
}
