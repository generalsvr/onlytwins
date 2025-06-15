'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

interface EnergyRechargePageProps {
  onBack: () => void;
}

export default function EnergyRechargePage({
  onBack,
}: EnergyRechargePageProps) {
  const { t } = useLanguage();

  const packages = [
    { id: 1, tokens: 540, price: 38, image: '/540-tt.png' },
    { id: 2, tokens: 1360, price: 79, image: '/1360-tt.png' },
    { id: 3, tokens: 2720, price: 141, image: '/2720-tt.png' },
    { id: 4, tokens: 210, price: 18, image: '/210-tt.png' },
    { id: 5, tokens: 5000, price: 200, image: '/5000-tt.png' },
    { id: 6, tokens: 85, price: 3.95, image: '/85-tt.png' },
  ];

  return (
    <div className="p-4 flex flex-col h-full bg-black">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-4xl font-bold">{t('store.title')}</h1>
        <div></div>
      </div>

      <div className="bg-gradient-to-r from-zinc-900 to-pink-900/30 rounded-xl p-4 mb-6 flex items-center">
        <div className="relative w-24 h-24 mr-4">
          <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl"></div>
          <div className="relative h-full w-full">
            <Image
              src="/unlimited-energy.png"
              alt="Energy"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">
            {t('store.unlimitedEnergy')}
          </h2>
          <p className="text-zinc-400 mb-3">
            {t('store.breakObstacles')}
            <br />
            {t('store.unlockVitality')}
          </p>
          <button className="w-full bg-pink-400 text-white py-2 rounded-md">
            {t('common.recharge')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-gradient-to-b from-zinc-900 to-pink-900/20 rounded-xl p-3 flex flex-col items-center"
          >
            <div className="relative w-16 h-16 mb-2">
              <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <Image
                  src={pkg.image || '/placeholder.svg'}
                  alt={`${pkg.tokens} Tokens`}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-zinc-400 mb-1">{pkg.tokens} TT</div>
            <div className="text-xl font-bold">${pkg.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
