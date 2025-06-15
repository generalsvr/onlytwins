'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';

interface CharacterPersonalityProps {
  step: number;
  characterData: any;
  updateCharacterData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CharacterPersonality({
  step,
  characterData,
  updateCharacterData,
  onNext,
  onBack,
}: CharacterPersonalityProps) {
  const { t } = useLanguage();

  // Animation variants for step transitions
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectPersonalityType')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  type: 'Flirty',
                  typeKey: 'character.create.flirty',
                  descKey: 'character.create.flirtyDesc',
                },
                {
                  type: 'Shy',
                  typeKey: 'character.create.shy',
                  descKey: 'character.create.shyDesc',
                },
                {
                  type: 'Dominant',
                  typeKey: 'character.create.dominant',
                  descKey: 'character.create.dominantDesc',
                },
                {
                  type: 'Sweet',
                  typeKey: 'character.create.sweet',
                  descKey: 'character.create.sweetDesc',
                },
                {
                  type: 'Intellectual',
                  typeKey: 'character.create.intellectual',
                  descKey: 'character.create.intellectualDesc',
                },
                {
                  type: 'Adventurous',
                  typeKey: 'character.create.adventurous',
                  descKey: 'character.create.adventurousDesc',
                },
              ].map((personality) => (
                <button
                  key={personality.type}
                  className={`p-4 rounded-xl ${
                    characterData.personalityType === personality.type
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() =>
                    updateCharacterData({ personalityType: personality.type })
                  }
                >
                  <div className="text-lg font-bold">
                    {t(personality.typeKey)}
                  </div>
                  <div className="text-sm opacity-80">
                    {t(personality.descKey)}
                  </div>
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectOccupation')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Student',
                'Model',
                'Artist',
                'Teacher',
                'Nurse',
                'Entrepreneur',
                'Fitness Trainer',
                'Chef',
              ].map((occupation) => (
                <button
                  key={occupation}
                  className={`p-4 rounded-xl ${
                    characterData.occupation === occupation
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ occupation })}
                >
                  <div className="text-lg font-bold">{occupation}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 3:
        const toggleHobby = (hobby: string) => {
          const currentHobbies = [...(characterData.hobbies || [])];
          if (currentHobbies.includes(hobby)) {
            updateCharacterData({
              hobbies: currentHobbies.filter((h) => h !== hobby),
            });
          } else {
            if (currentHobbies.length < 3) {
              updateCharacterData({
                hobbies: [...currentHobbies, hobby],
              });
            }
          }
        };

        return (
          <>
            <h2 className="text-2xl font-bold mb-2">
              {t('character.create.selectHobbies')}
            </h2>
            <p className="text-zinc-400 mb-6">
              {t('character.create.chooseUpTo3')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Reading',
                'Cooking',
                'Yoga',
                'Photography',
                'Dancing',
                'Gaming',
                'Traveling',
                'Painting',
                'Music',
                'Fashion',
              ].map((hobby) => (
                <button
                  key={hobby}
                  className={`p-4 rounded-xl ${
                    characterData.hobbies?.includes(hobby)
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => toggleHobby(hobby)}
                >
                  <div className="text-lg font-bold">{hobby}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectRelationshipType')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  type: 'Casual',
                  typeKey: 'character.create.casual',
                  descKey: 'character.create.casualDesc',
                },
                {
                  type: 'Romantic',
                  typeKey: 'character.create.romantic',
                  descKey: 'character.create.romanticDesc',
                },
                {
                  type: 'Friendship',
                  typeKey: 'character.create.friendship',
                  descKey: 'character.create.friendshipDesc',
                },
                {
                  type: 'Mentor',
                  typeKey: 'character.create.mentor',
                  descKey: 'character.create.mentorDesc',
                },
              ].map((relationship) => (
                <button
                  key={relationship.type}
                  className={`p-4 rounded-xl ${
                    characterData.relationshipType === relationship.type
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() =>
                    updateCharacterData({ relationshipType: relationship.type })
                  }
                >
                  <div className="text-lg font-bold">
                    {t(relationship.typeKey)}
                  </div>
                  <div className="text-sm opacity-80">
                    {t(relationship.descKey)}
                  </div>
                </button>
              ))}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.characterSummary')}
            </h2>
            <div className="bg-zinc-800 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-bold mb-2">
                {t('character.create.appearance')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-zinc-400">
                  {t('character.create.style')}
                </div>
                <div>
                  {characterData.style || t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.ethnicity')}
                </div>
                <div>
                  {characterData.ethnicity || t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">{t('character.create.age')}</div>
                <div>{characterData.age}</div>

                <div className="text-zinc-400">
                  {t('character.create.eyeColor')}
                </div>
                <div>
                  {characterData.eyeColor || t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.hair')}
                </div>
                <div>
                  {characterData.hairColor || t('character.create.notSelected')}{' '}
                  {characterData.hairType || ''}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.bodyType')}
                </div>
                <div>
                  {characterData.bodyType || t('character.create.notSelected')}
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4">
              <h3 className="text-xl font-bold mb-2">
                {t('character.create.personality')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-zinc-400">
                  {t('character.create.personalityLabel')}
                </div>
                <div>
                  {characterData.personalityType ||
                    t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.occupation')}
                </div>
                <div>
                  {characterData.occupation ||
                    t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.hobbies')}
                </div>
                <div>
                  {characterData.hobbies?.join(', ') ||
                    t('character.create.notSelected')}
                </div>

                <div className="text-zinc-400">
                  {t('character.create.relationship')}
                </div>
                <div>
                  {characterData.relationshipType ||
                    t('character.create.notSelected')}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <button onClick={onBack} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">
            {t('character.create.personality')}
          </h1>
          <div className="text-zinc-400">Step {step}/5</div>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <motion.div
            className="bg-pink-400 h-2 rounded-full"
            initial={{ width: `${((step - 1) / 5) * 100}%` }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        className="flex-1 mb-6"
        key={`personality-step-${step}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {renderStepContent()}
      </motion.div>

      <button
        onClick={onNext}
        className="w-full bg-pink-400 text-white py-4 rounded-xl text-xl"
        disabled={
          (step === 1 && !characterData.personalityType) ||
          (step === 2 && !characterData.occupation) ||
          (step === 3 &&
            (!characterData.hobbies || characterData.hobbies.length === 0)) ||
          (step === 4 && !characterData.relationshipType)
        }
      >
        {step === 5 ? t('common.createCharacter') : t('common.continue')}
      </button>
    </div>
  );
}
