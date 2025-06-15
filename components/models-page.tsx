'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function ModelsPage() {
  const { t } = useLanguage();

  const models = [
    {
      id: 1,
      name: 'Claire',
      emoji: '👱‍♀️',
      description:
        "I'm Claire, yogi, adventurer, and your next spontaneous fun. Join me?",
      image: '/claire-additional.png',
    },
    {
      id: 2,
      name: 'JennyPinky',
      emoji: '🌸',
      description:
        "I'm JennyPinky from Guilin, your Fansly temptress of silk, spice, and seduction. Dare to join me?",
      image: '/jennypinky-new-profile.png',
    },
    {
      id: 3,
      name: 'Valeria & Camila',
      emoji: '💞',
      description:
        'Twin goddesses of Caribbean nights, luring the elite with luxury and seductive moonlit dances.',
      image: '/valeria-camila-new.png',
    },
    {
      id: 4,
      name: 'Lee',
      emoji: '👩‍🦰',
      description:
        'Shanghai-born curator and artist seeking beauty, curiosity, and adventure. Join me?',
      image: '/lee-new-profile.png',
    },
    {
      id: 5,
      name: 'Hana',
      emoji: '🌸',
      description:
        'Konnichiwa, senpai! Anime artist, cosplayer, and your IRL waifu—ready for anime nights?',
      image: '/hana-new-profile.png',
    },
    {
      id: 6,
      name: 'Akari',
      emoji: '🔥',
      description:
        "Tokyo's Blue Moon singer by day, detective by night, solving mysteries with allure.",
      image: '/akari-new-profile.png',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">{t('models.title')}</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Create Your Own Character Card */}
        <Link href="/create-character" className="block">
          <div className="bg-gradient-to-br from-zinc-900 to-pink-900/30 rounded-xl overflow-hidden border-2 border-dashed border-pink-400/50">
            <div className="relative h-48 flex items-center justify-center bg-zinc-900/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-pink-400/20 flex items-center justify-center">
                  <Plus className="h-12 w-12 text-pink-400" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="p-3">
              <h3 className="text-xl font-bold mb-1">
                {t('models.createYourOwn')} <span>✨</span>
              </h3>
              <p className="text-sm text-zinc-400">{t('models.createDesc')}</p>
            </div>
          </div>
        </Link>

        {/* Existing Models */}
        {models.map((model) => (
          <Link
            key={model.id}
            href={`/character/${model.id}`}
            className="block"
          >
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={
                    model.image
                      ? model.image
                      : `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(model.name)}`
                  }
                  alt={model.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-3">
                <h3 className="text-xl font-bold mb-1">
                  {model.name} <span>{model.emoji}</span>
                </h3>
                <p className="text-sm text-zinc-400">{model.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
