'use client';

import { useState, useEffect } from 'react';
import SafeImage from './safe-image';
import { useLanguage } from '@/contexts/language-context';

export default function StorePage() {
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

  const packages = [
    { id: 1, tokens: 540, price: 38, image: '/540-tt.png' },
    { id: 2, tokens: 1360, price: 79, image: '/1360-tt.png' },
    { id: 3, tokens: 2720, price: 141, image: '/2720-tt.png' },
    { id: 4, tokens: 210, price: 18, image: '/210-tt.png' },
    { id: 5, tokens: 5000, price: 200, image: '/5000-tt.png' },
    { id: 6, tokens: 85, price: 3.95, image: '/85-tt.png' },
  ];

  return (
    <div className={`${isMobile ? 'p-4' : 'pt-20 px-8 max-w-6xl mx-auto'}`}>
      <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold mb-6`}>
        {t('store.title') || 'Store'}
      </h1>

      <div
        className={`bg-gradient-to-r from-black to-pink-900/30 rounded-xl p-4 mb-6 flex ${isMobile ? 'items-center' : 'items-start'}`}
      >
        <div className={`${isMobile ? 'mr-4' : 'mr-6'}`}>
          <div
            className={`relative ${isMobile ? 'w-20 h-20' : 'w-32 h-32'} flex justify-center items-center`}
          >
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"></div>
            <div className="relative h-full w-full flex items-center justify-center">
              <SafeImage
                src="/unlimited-energy.png"
                alt="Energy"
                width={isMobile ? 80 : 128}
                height={isMobile ? 80 : 128}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2
            className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}
          >
            {t('store.unlimitedEnergy') || 'Unlimited Energy'}
          </h2>
          <p className={`text-zinc-400 mb-3 ${isMobile ? '' : 'text-lg'}`}>
            {t('store.breakObstacles') || 'Break down the obstacles.'}
            <br />
            {t('store.unlockVitality') || 'Unlock boundless vitality!'}
          </p>
          <button
            className={`${isMobile ? 'w-full' : 'px-8'} bg-pink-400 text-white py-2 rounded-md`}
          >
            {t('common.recharge') || 'Recharge'}
          </button>
        </div>
      </div>

      <div
        className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-4 gap-6'}`}
      >
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-gradient-to-b from-zinc-900 to-pink-900/20 rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition-shadow"
          >
            <div
              className={`relative ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} mb-2 flex justify-center items-center`}
            >
              <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <SafeImage
                  src={pkg.image || '/placeholder.svg'}
                  alt={`${pkg.tokens} Tokens`}
                  width={isMobile ? 64 : 96}
                  height={isMobile ? 64 : 96}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-zinc-400 mb-1">{pkg.tokens} TT</div>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
              ${pkg.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
