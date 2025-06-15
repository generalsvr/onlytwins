'use client';
import { ArrowLeft, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useState, useEffect } from 'react';

import SafeImage from '@/components/safe-image';
import { useRouter } from 'next/navigation';

interface CharacterDetailProps {
  character: {
    id: number;
    name: string;
    emoji: string;
    description: string;
    image: string;
    profileImage: string;
    additionalImages?: string[];
    about: string;
    interests: string[];
    relationshipLevel: string;
    progress: number;
    agentId?: string;
  };
  onBack: () => void;
}

export default function CharacterDetail({
  character,
  onBack,
}: CharacterDetailProps) {
  const { t } = useLanguage();
  const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState(false);
  const router = useRouter();

  // If this is Hana, redirect to her dedicated profile page
  useEffect(() => {
    if (character.id === 5) {
      router.push('/character/hana');
    }
  }, [character.id]);

  const handleVoiceCallClick = () => {
    setIsVoiceCallModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 pb-24">
        <h1 className="text-5xl font-bold mb-4">
          {character.name} <span>{character.emoji}</span>
        </h1>

        <div className="relative w-full h-[450px] rounded-xl overflow-hidden mb-6">
          <SafeImage
            src={
              character.profileImage
                ? character.profileImage
                : character.image
                  ? character.image
                  : null
            }
            alt={character.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl mb-2">
            {t('character.aboutMe')} <span className="text-white">💭</span>
          </h2>
          <p className="text-zinc-300 leading-relaxed">{character.about}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl mb-2">
            {t('character.interests')} <span className="text-white">💝</span>
          </h2>
          <p className="text-zinc-300">{character.interests.join(', ')}</p>
        </div>

        <div className="bg-zinc-900/80 rounded-xl p-4 mb-6">
          <h2 className="text-2xl mb-2">
            {t('character.relationshipLevel')}{' '}
            <span className="text-white">{character.relationshipLevel}</span>
          </h2>
          <div className="flex items-center mb-2">
            <span className="text-zinc-400 mr-2">
              {t('character.progressBar')}
            </span>
            <span className="text-white">{character.progress}/100</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-4">
            <div
              className="bg-[#c2c96c] h-4 rounded-full"
              style={{ width: `${character.progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleVoiceCallClick}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl text-xl text-center mb-3 transition-all flex items-center justify-center"
        >
          <Phone className="w-5 h-5 mr-2" />
          {t('common.voiceCall')}
        </button>

        <a
          href="https://t.me/onlytwins_app_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-pink-400 text-white py-4 rounded-xl text-xl text-center block"
        >
          {t('common.chatNow')}
        </a>
      </div>


    </div>
  );
}
