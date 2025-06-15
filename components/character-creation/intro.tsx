'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

interface CharacterCreationIntroProps {
  onNext: () => void;
  onBack: () => void;
}

export default function CharacterCreationIntro({
  onNext,
  onBack,
}: CharacterCreationIntroProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 flex flex-col h-full">
      <button onClick={onBack} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <h1 className="text-4xl font-bold mb-6">{t('character.create.title')}</h1>

      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
        <Image
          src="/cybernetic-explorer.png"
          alt="Character Creation"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <h2 className="text-2xl font-bold text-white">
            {t('character.create.designCompanion')}
          </h2>
        </div>
      </div>

      <div className="bg-zinc-900/80 rounded-xl p-6 mb-6">
        <p className="text-lg mb-4">{t('character.create.customCharacters')}</p>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">1</span>
            </div>
            <p>{t('character.create.step1')}</p>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">2</span>
            </div>
            <p>{t('character.create.step2')}</p>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">3</span>
            </div>
            <p>{t('character.create.step3')}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onNext}
          className="w-full bg-pink-400 text-white py-4 rounded-xl text-xl"
        >
          {t('common.getStarted')}
        </button>
      </div>
    </div>
  );
}
