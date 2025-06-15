'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

export default function GiftsPage() {
  const { t } = useLanguage();

  const gifts = [
    {
      id: 1,
      nameKey: 'gifts.flowers',
      emoji: '💐',
      price: 9,
      image: '/red-roses-bouquet.jpeg',
    },
    {
      id: 2,
      nameKey: 'gifts.necklace',
      emoji: '💎',
      price: 29,
      image: '/sparkling-diamond-necklace.png',
    },
    {
      id: 3,
      nameKey: 'gifts.designerPurse',
      emoji: '👜',
      price: 19,
      image: '/scarlet-structured-tote.png',
    },
    {
      id: 4,
      nameKey: 'gifts.rolexWatch',
      emoji: '⌚',
      price: 39,
      image: '/elegant-gold-watch.png',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">{t('gifts.title')}</h1>
      <div className="grid grid-cols-2 gap-4">
        {gifts.map((gift) => (
          <div key={gift.id} className="bg-zinc-900 rounded-xl overflow-hidden">
            <div className="p-3">
              <h3 className="text-xl font-bold mb-1">
                {t(gift.nameKey)} <span>{gift.emoji}</span>
              </h3>
            </div>
            <div className="relative h-48">
              <Image
                src={
                  gift.image
                    ? gift.image
                    : `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(t(gift.nameKey))}`
                }
                alt={t(gift.nameKey)}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800/80 rounded-full px-6 py-2 flex items-center gap-2">
                <span className="text-red-500">💋</span>
                <span>{gift.price}</span>
              </div>
              <button className="w-full bg-pink-400 text-white py-2 rounded-md mt-4">
                {t('common.unlock')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
