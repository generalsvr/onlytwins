'use client';

import { ArrowLeft, Heart } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

interface CharacterResultProps {
  characterData: any;
  onBack: () => void;
  onFinish: () => void;
}

export default function CharacterResult({
  characterData,
  onBack,
  onFinish,
}: CharacterResultProps) {
  const { t } = useLanguage();

  // Generate a character image query based on selections
  const generateImageQuery = () => {
    let query = `beautiful ${characterData.ethnicity} woman`;

    if (characterData.age > 40) {
      query += ' mature';
    }

    if (characterData.hairColor) {
      query += ` with ${characterData.hairColor.toLowerCase()} hair`;
    }

    if (characterData.hairType) {
      query += ` ${characterData.hairType.toLowerCase()} hairstyle`;
    }

    if (characterData.bodyType) {
      query += ` ${characterData.bodyType.toLowerCase()} body`;
    }

    if (characterData.style === 'Anime') {
      query += ' anime style digital art';
    } else {
      query += ' photorealistic portrait';
    }

    return query;
  };

  const imageQuery = generateImageQuery();
  const imageUrl = `/placeholder.svg?height=600&width=400&query=${encodeURIComponent(imageQuery)}`;

  return (
    <div className="p-4 flex flex-col h-full">
      <button onClick={onBack} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <h1 className="text-4xl font-bold mb-6">
        {t('character.create.yourCharacter')}
      </h1>

      <div className="bg-zinc-900 rounded-xl overflow-hidden mb-6">
        <div className="relative h-80">
          <Image
            src={
              imageUrl
                ? imageUrl
                : `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(characterData.name || 'character')}`
            }
            alt={characterData.name || 'Character'}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">{characterData.name}</h2>
            <Heart className="h-6 w-6 text-pink-400" />
          </div>
          <p className="text-zinc-400 mb-4">{characterData.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {characterData.hobbies?.map((hobby: string) => (
              <span
                key={hobby}
                className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
              >
                {hobby}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-zinc-400">{t('character.create.age')}</div>
            <div>{characterData.age}</div>

            <div className="text-zinc-400">
              {t('character.create.occupation')}
            </div>
            <div>{characterData.occupation}</div>

            <div className="text-zinc-400">
              {t('character.create.personalityLabel')}
            </div>
            <div>{characterData.personalityType}</div>

            <div className="text-zinc-400">
              {t('character.create.relationship')}
            </div>
            <div>{characterData.relationshipType}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-xl p-4 mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {t('character.create.characterCreated')}
            </h3>
            <p>{t('character.create.readyToChat')}</p>
          </div>
        </div>
      </div>

      <a
        href="https://t.me/onlytwins_app_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-pink-400 text-white py-4 rounded-xl text-xl text-center block"
      >
        {t('character.create.startChatting')}
      </a>
    </div>
  );
}
