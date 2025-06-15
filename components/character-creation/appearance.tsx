'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';

interface CharacterAppearanceProps {
  step: number;
  characterData: any;
  updateCharacterData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CharacterAppearance({
  step,
  characterData,
  updateCharacterData,
  onNext,
  onBack,
}: CharacterAppearanceProps) {
  const { t } = useLanguage();

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectStyle')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 'Realistic',
                  translationKey: 'character.create.realistic',
                  descKey: 'character.create.realisticDesc',
                },
                {
                  id: 'Anime',
                  translationKey: 'character.create.anime',
                  descKey: 'character.create.animeDesc',
                },
              ].map((style) => (
                <button
                  key={style.id}
                  className={`p-6 rounded-xl ${
                    characterData.style === style.id
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ style: style.id })}
                >
                  <div className="text-xl font-bold mb-2">
                    {t(style.translationKey)}
                  </div>
                  <div className="text-sm opacity-80">{t(style.descKey)}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectEthnicity')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {['White', 'Latina', 'Middle East', 'Asian', 'Black'].map(
                (ethnicity) => (
                  <button
                    key={ethnicity}
                    className={`p-4 rounded-xl ${
                      characterData.ethnicity === ethnicity
                        ? 'bg-pink-400 text-white'
                        : 'bg-zinc-800 text-zinc-100'
                    }`}
                    onClick={() => updateCharacterData({ ethnicity })}
                  >
                    <div className="text-lg font-bold">{ethnicity}</div>
                  </button>
                )
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectAge')}
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>18</span>
                <span>{characterData.age}</span>
                <span>70</span>
              </div>
              <input
                type="range"
                min="18"
                max="70"
                value={characterData.age}
                onChange={(e) =>
                  updateCharacterData({ age: Number.parseInt(e.target.value) })
                }
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-center">
              <div className="text-4xl font-bold mb-2">{characterData.age}</div>
              <div className="text-zinc-400">
                {t('character.create.yearsOld')}
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectEyeColor')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Brown', color: 'bg-amber-800' },
                { name: 'Blue', color: 'bg-blue-500' },
                { name: 'Green', color: 'bg-green-500' },
              ].map((eye) => (
                <button
                  key={eye.name}
                  className={`p-4 rounded-xl ${
                    characterData.eyeColor === eye.name
                      ? 'ring-2 ring-pink-400'
                      : ''
                  } bg-zinc-800 text-zinc-100`}
                  onClick={() => updateCharacterData({ eyeColor: eye.name })}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${eye.color} mx-auto mb-2`}
                  ></div>
                  <div className="text-lg font-bold">{eye.name}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectHairType')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Straight',
                'Curly',
                'Pony Tail',
                'Braids',
                'Messy Bun',
                'Pixie',
              ].map((hairType) => (
                <button
                  key={hairType}
                  className={`p-4 rounded-xl ${
                    characterData.hairType === hairType
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ hairType })}
                >
                  <div className="text-lg font-bold">{hairType}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectHairColor')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Black', color: 'bg-black' },
                { name: 'Blonde', color: 'bg-yellow-300' },
                { name: 'Brown', color: 'bg-amber-700' },
                { name: 'Pink', color: 'bg-pink-400' },
                { name: 'Red', color: 'bg-red-500' },
              ].map((hair) => (
                <button
                  key={hair.name}
                  className={`p-4 rounded-xl ${
                    characterData.hairColor === hair.name
                      ? 'ring-2 ring-pink-400'
                      : ''
                  } bg-zinc-800 text-zinc-100`}
                  onClick={() => updateCharacterData({ hairColor: hair.name })}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${hair.color} mx-auto mb-2`}
                  ></div>
                  <div className="text-lg font-bold">{hair.name}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 7:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectVoice')}
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>1</span>
                <span>{characterData.voice}</span>
                <span>6</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={characterData.voice}
                onChange={(e) =>
                  updateCharacterData({
                    voice: Number.parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 1, desc: 'Soft & Sweet' },
                { value: 2, desc: 'Sultry & Deep' },
                { value: 3, desc: 'Bubbly & Energetic' },
                { value: 4, desc: 'Mature & Confident' },
                { value: 5, desc: 'Shy & Gentle' },
                { value: 6, desc: 'Playful & Teasing' },
              ].map((voice) => (
                <button
                  key={voice.value}
                  className={`p-4 rounded-xl ${
                    characterData.voice === voice.value
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ voice: voice.value })}
                >
                  <div className="text-lg font-bold">Voice {voice.value}</div>
                  <div className="text-sm opacity-80">{voice.desc}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 8:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectBodyType')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {['Petite', 'Slim', 'Athletic', 'Voluptuous', 'Curvy'].map(
                (bodyType) => (
                  <button
                    key={bodyType}
                    className={`p-4 rounded-xl ${
                      characterData.bodyType === bodyType
                        ? 'bg-pink-400 text-white'
                        : 'bg-zinc-800 text-zinc-100'
                    }`}
                    onClick={() => updateCharacterData({ bodyType })}
                  >
                    <div className="text-lg font-bold">{bodyType}</div>
                  </button>
                )
              )}
            </div>
          </>
        );
      case 9:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectBreastSize')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {['Flat', 'Small', 'Medium', 'Large', 'Huge'].map((size) => (
                <button
                  key={size}
                  className={`p-4 rounded-xl ${
                    characterData.breastSize === size
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ breastSize: size })}
                >
                  <div className="text-lg font-bold">{size}</div>
                </button>
              ))}
            </div>
          </>
        );
      case 10:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {t('character.create.selectButtSize')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {['Small', 'Athletic', 'Medium', 'Large', 'Huge'].map((size) => (
                <button
                  key={size}
                  className={`p-4 rounded-xl ${
                    characterData.buttSize === size
                      ? 'bg-pink-400 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                  onClick={() => updateCharacterData({ buttSize: size })}
                >
                  <div className="text-lg font-bold">{size}</div>
                </button>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Animation variants for step transitions
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <button onClick={onBack} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">
            {t('character.create.appearance')}
          </h1>
          <div className="text-zinc-400">Step {step}/10</div>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <motion.div
            className="bg-pink-400 h-2 rounded-full"
            initial={{ width: `${((step - 1) / 10) * 100}%` }}
            animate={{ width: `${(step / 10) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        className="flex-1 mb-6"
        key={`appearance-step-${step}`}
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
          (step === 1 && !characterData.style) ||
          (step === 2 && !characterData.ethnicity) ||
          (step === 4 && !characterData.eyeColor) ||
          (step === 5 && !characterData.hairType) ||
          (step === 6 && !characterData.hairColor) ||
          (step === 8 && !characterData.bodyType) ||
          (step === 9 && !characterData.breastSize) ||
          (step === 10 && !characterData.buttSize)
        }
      >
        {step === 10
          ? t('character.create.nextPersonality')
          : t('common.continue')}
      </button>
    </div>
  );
}
