'use client';

import { useState, useEffect } from 'react';
import { Zap, ImageIcon, Brain, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface PlanPageProps {
  onUpgradeClick: () => void;
}

export default function PlanPage({ onUpgradeClick }: PlanPageProps) {
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

  const plans = [
    {
      id: 1,
      name: '1 Year',
      price: 49.95,
      period: 'year',
      tokens: 699,
      selected: true,
    },
    {
      id: 2,
      name: '1 Month',
      price: 4.95,
      period: 'month',
      tokens: 33,
      selected: false,
    },
    {
      id: 3,
      name: '3 Months',
      price: 11.95,
      period: '3 months',
      tokens: 99,
      selected: false,
    },
  ];

  const benefits = [
    {
      id: 1,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      text: 'Infinite energy',
    },
    {
      id: 2,
      icon: <Coins className="w-6 h-6 text-pink-400" />,
      text: '99 TwinTokens for shopping',
    },
    {
      id: 3,
      icon: <Brain className="w-6 h-6 text-pink-500" />,
      text: 'Our most advanced AI engine',
    },
    {
      id: 4,
      icon: <ImageIcon className="w-6 h-6 text-pink-300" />,
      text: 'Unlimited photo generation',
    },
  ];

  const handlePlanSelect = (planId: number) => {
    // In a real app, this would update the selected plan
    // For now, we'll just navigate to the payment page
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { page: 'payment' } })
    );
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'pt-20 px-8 max-w-3xl mx-auto'}`}>
      <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold mb-6`}>
        {t('plan.title') || 'Plan'}
      </h1>

      {isMobile ? (
        // Mobile layout
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {plans.slice(0, 2).map((plan) => (
              <div
                key={plan.id}
                className={`bg-zinc-900 rounded-xl p-4 relative ${plan.selected ? 'border border-pink-400' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <h2 className="text-xl font-bold text-pink-400 mb-1">
                  {plan.name}
                </h2>
                <div className="flex items-center mb-4">
                  <span className="text-zinc-400 mr-1">+</span>
                  <span className="text-red-500 mr-1">💋</span>
                  <span className="text-zinc-400">{plan.tokens} TT</span>
                </div>
                <div className="text-2xl font-bold">
                  ${plan.price}{' '}
                  <span className="text-sm text-zinc-400">/ {plan.period}</span>
                </div>
                {plan.selected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-pink-400 flex items-center justify-center">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  </div>
                )}
                {!plan.selected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-zinc-600"></div>
                )}
              </div>
            ))}
          </div>

          <div
            className="bg-zinc-900 rounded-xl p-4 mb-6 relative"
            onClick={() => handlePlanSelect(plans[2].id)}
          >
            <h2 className="text-xl font-bold text-pink-400 mb-1">
              {plans[2].name}
            </h2>
            <div className="flex items-center mb-4">
              <span className="text-zinc-400 mr-1">+</span>
              <span className="text-red-500 mr-1">💋</span>
              <span className="text-zinc-400">{plans[2].tokens} TT</span>
            </div>
            <div className="text-2xl font-bold">
              ${plans[2].price}{' '}
              <span className="text-sm text-zinc-400">/ {plans[2].period}</span>
            </div>
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-zinc-600"></div>
          </div>
        </>
      ) : (
        // Desktop layout
        <div className="grid grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-zinc-900 rounded-xl p-6 relative ${
                plan.selected
                  ? 'border-2 border-pink-400'
                  : 'border border-zinc-800'
              } hover:border-pink-400 transition-colors cursor-pointer`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <h2 className="text-2xl font-bold text-pink-400 mb-2">
                {plan.name}
              </h2>
              <div className="flex items-center mb-4">
                <span className="text-zinc-400 mr-1">+</span>
                <span className="text-red-500 mr-1">💋</span>
                <span className="text-zinc-400">{plan.tokens} TT</span>
              </div>
              <div className="text-3xl font-bold mb-4">
                ${plan.price}{' '}
                <span className="text-sm text-zinc-400">/ {plan.period}</span>
              </div>
              {plan.selected && (
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-pink-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                </div>
              )}
              {!plan.selected && (
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-zinc-600"></div>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        className={`space-y-4 mb-6 ${isMobile ? '' : 'bg-zinc-900 rounded-xl p-6 border border-zinc-800'}`}
      >
        <h3 className={isMobile ? 'sr-only' : 'text-xl font-bold mb-4'}>
          Plan Benefits
        </h3>
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center">
            {benefit.icon}
            <span className={`ml-3 ${isMobile ? '' : 'text-lg'}`}>
              {benefit.text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => handlePlanSelect(1)}
        className={`w-full bg-pink-400 text-white py-4 rounded-xl text-xl hover:bg-pink-500 transition-colors`}
      >
        {t('common.upgrade') || 'Upgrade'}
      </button>
    </div>
  );
}
