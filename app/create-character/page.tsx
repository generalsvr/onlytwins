'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/status-bar';
import { motion } from 'framer-motion';
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function CreateCharacterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState({
    minutes: 24,
    seconds: 59,
    milliseconds: 0,
  });
  const [characterData, setCharacterData] = useState({
    // Style
    style: '',
    // Appearance
    ethnicity: '',
    age: '',
    eyeColor: '',
    hairStyle: '',
    hairColor: '',
    // Body
    bodyType: '',
    breastSize: '',
    buttSize: '',
    // Personality
    personalityType: '',
    occupation: '',
    hobbies: [] as string[],
    relationshipType: '',
    // Generated data
    name: '',
    description: '',
    image: '/ethereal-beauty.png',
  });

  // Countdown timer for special offers
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let newMs = prev.milliseconds - 10;
        let newSec = prev.seconds;
        let newMin = prev.minutes;

        if (newMs < 0) {
          newMs = 990;
          newSec -= 1;
        }

        if (newSec < 0) {
          newSec = 59;
          newMin -= 1;
        }

        if (newMin < 0) {
          clearInterval(timer);
          return { minutes: 0, seconds: 0, milliseconds: 0 };
        }

        return { minutes: newMin, seconds: newSec, milliseconds: newMs };
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const updateCharacterData = (data: Partial<typeof characterData>) => {
    setCharacterData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (step < 10) {
      setStep(step + 1);
    } else {
      // Generate name and description based on selections
      const names = [
        'Sophia',
        'Emma',
        'Olivia',
        'Ava',
        'Isabella',
        'Mia',
        'Amelia',
        'Harper',
        'Evelyn',
        'Abigail',
        'Luna',
        'Aria',
        'Ella',
        'Gianna',
        'Lily',
        'Zoe',
        'Nora',
        'Layla',
        'Hazel',
        'Camila',
        'Yuki',
        'Mei',
        'Aiko',
        'Sakura',
        'Hina',
        'Yuna',
        'Rin',
        'Akira',
        'Haruka',
        'Mizuki',
        'Valentina',
        'Isabella',
        'Camila',
        'Sofia',
        'Lucia',
        'Elena',
        'Gabriela',
        'Mariana',
        'Adriana',
        'Natalia',
      ];

      const randomName = names[Math.floor(Math.random() * names.length)];

      // Generate description based on personality and appearance
      let description = '';
      if (characterData.personalityType === 'Flirty') {
        description = `I'm ${randomName}, your playful tease who loves to flirt and keep you guessing. Let's have some fun together?`;
      } else if (characterData.personalityType === 'Shy') {
        description = `Hi, I'm ${randomName}... a bit shy at first, but I open up when I feel comfortable. Would you like to get to know me?`;
      } else if (characterData.personalityType === 'Dominant') {
        description = `I'm ${randomName}, and I know exactly what I want. Follow my lead and you won't be disappointed.`;
      } else if (characterData.personalityType === 'Sweet') {
        description = `I'm ${randomName}, your sweet companion who loves to make you smile. Let's create beautiful memories together!`;
      } else {
        description = `I'm ${randomName}, a ${characterData.bodyType.toLowerCase()} ${characterData.ethnicity.toLowerCase()} beauty with ${characterData.hairColor.toLowerCase()} ${characterData.hairStyle.toLowerCase()} hair. Let's connect!`;
      }

      updateCharacterData({
        name: randomName,
        description,
      });

      setStep(11); // Move to result
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/');
    }
  };

  // Options for each step
  const styleOptions = [
    { value: 'Realistic', label: 'Realistic', image: '/claire-party.jpeg' },
    {
      value: 'Anime',
      label: 'Anime',
      image: '/hana-new-profile.png',
      locked: false,
    },
  ];

  const ethnicityOptions = [
    { value: 'Caucasian', label: 'Caucasian', image: '/claire-party.jpeg' },
    { value: 'Latina', label: 'Latina', image: '/valeria-camila-new.png' },
    { value: 'Asian', label: 'Asian', image: '/lee-new-profile.png' },
    {
      value: 'Black',
      label: 'Black',
      image: '/beautiful-black-woman.png',
      locked: true,
    },
    {
      value: 'Middle Eastern',
      label: 'Middle Eastern',
      image: '/placeholder.svg?key=7mmmd',
      locked: true,
    },
  ];

  const ageOptions = [
    { value: '18+', label: 'Teen(18+)' },
    { value: '20s', label: '20s' },
    { value: '30s', label: '30s', locked: true },
    { value: '40s', label: '40s', locked: true },
  ];

  const eyeColorOptions = [
    { value: 'Brown', label: 'Brown', image: '/placeholder.svg?key=xdlzi' },
    { value: 'Blue', label: 'Blue', image: '/placeholder.svg?key=0l32p' },
    {
      value: 'Green',
      label: 'Green',
      image: '/placeholder.svg?key=9wk82',
      locked: true,
    },
  ];

  const hairStyleOptions = [
    {
      value: 'Straight',
      label: 'Straight',
      image: '/placeholder.svg?key=pyva3',
    },
    {
      value: 'Curly',
      label: 'Curly',
      image: '/placeholder.svg?height=200&width=200&query=curly%20hair%20woman',
      locked: true,
    },
    {
      value: 'Short',
      label: 'Short',
      image: '/placeholder.svg?height=200&width=200&query=short%20hair%20woman',
    },
    {
      value: 'Long',
      label: 'Long',
      image: '/placeholder.svg?height=200&width=200&query=long%20hair%20woman',
    },
    {
      value: 'Ponytail',
      label: 'Ponytail',
      image: '/placeholder.svg?height=200&width=200&query=ponytail%20woman',
      locked: true,
    },
    {
      value: 'Braids',
      label: 'Braids',
      image:
        '/placeholder.svg?height=200&width=200&query=braided%20hair%20woman',
      locked: true,
    },
  ];

  const hairColorOptions = [
    { value: 'Blonde', label: 'Blonde', color: 'bg-yellow-300' },
    { value: 'Brunette', label: 'Brunette', color: 'bg-amber-800' },
    { value: 'Black', label: 'Black', color: 'bg-black' },
    { value: 'Red', label: 'Red', color: 'bg-red-500', locked: true },
    { value: 'Pink', label: 'Pink', color: 'bg-pink-400', locked: true },
  ];

  const bodyTypeOptions = [
    {
      value: 'Slim',
      label: 'Slim',
      image: '/placeholder.svg?height=200&width=200&query=slim%20woman%20body',
    },
    {
      value: 'Athletic',
      label: 'Athletic',
      image:
        '/placeholder.svg?height=200&width=200&query=athletic%20woman%20body',
    },
    {
      value: 'Curvy',
      label: 'Curvy',
      image: '/placeholder.svg?height=200&width=200&query=curvy%20woman',
      locked: true,
    },
    {
      value: 'Voluptuous',
      label: 'Voluptuous',
      image: '/placeholder.svg?height=200&width=200&query=voluptuous%20woman',
      locked: true,
    },
  ];

  const breastSizeOptions = [
    {
      value: 'Small',
      label: 'Small',
      image: '/placeholder.svg?height=200&width=200&query=small%20bust%20woman',
      locked: true,
    },
    {
      value: 'Medium',
      label: 'Medium',
      image:
        '/placeholder.svg?height=200&width=200&query=medium%20bust%20woman',
    },
    {
      value: 'Large',
      label: 'Large',
      image: '/placeholder.svg?height=200&width=200&query=large%20bust%20woman',
    },
    {
      value: 'Huge',
      label: 'Huge',
      image: '/placeholder.svg?height=200&width=200&query=huge%20bust%20woman',
      locked: true,
    },
  ];

  const buttSizeOptions = [
    {
      value: 'Small',
      label: 'Small',
      image: '/placeholder.svg?height=200&width=200&query=small%20butt%20woman',
      locked: true,
    },
    {
      value: 'Medium',
      label: 'Medium',
      image:
        '/placeholder.svg?height=200&width=200&query=medium%20butt%20woman',
    },
    {
      value: 'Large',
      label: 'Large',
      image: '/placeholder.svg?height=200&width=200&query=large%20butt%20woman',
      locked: true,
    },
  ];

  const personalityOptions = [
    {
      value: 'Flirty',
      label: 'Flirty',
      icon: '💋',
      description: 'Playful and teasing',
    },
    {
      value: 'Shy',
      label: 'Shy',
      icon: '🌸',
      description: 'Reserved but sweet',
    },
    {
      value: 'Dominant',
      label: 'Dominant',
      icon: '👑',
      description: 'Takes control',
    },
    {
      value: 'Sweet',
      label: 'Sweet',
      icon: '🍬',
      description: 'Kind and caring',
    },
    {
      value: 'Jester',
      label: 'Jester',
      icon: '🃏',
      description: 'Funny and witty',
      locked: true,
    },
    {
      value: 'Intellectual',
      label: 'Intellectual',
      icon: '🧠',
      description: 'Smart and thoughtful',
      locked: true,
    },
  ];

  const relationshipOptions = [
    { value: 'Stranger', label: 'Stranger', icon: '🎭' },
    { value: 'School Mate', label: 'School Mate', icon: '🎓' },
    { value: 'Colleague', label: 'Colleague', icon: '💼' },
    { value: 'Mentor', label: 'Mentor', icon: '💎' },
    { value: 'Girlfriend', label: 'Girlfriend', icon: '❤️' },
    { value: 'Sex Friend', label: 'Sex Friend', icon: '⚤', locked: true },
    { value: 'Wife', label: 'Wife', icon: '💍', locked: true },
    { value: 'Mistress', label: 'Mistress', icon: '👑', locked: true },
    { value: 'Friend', label: 'Friend', icon: '✋' },
    { value: 'Best Friend', label: 'Best Friend', icon: '🤝' },
    { value: 'Step Sister', label: 'Step Sister', icon: '💕', locked: true },
    { value: 'Step Mom', label: 'Step Mom', icon: '❤️‍🔥', locked: true },
  ];

  const renderStepContent = () => {
    const renderOptions = (
      options: any[],
      selectedValue: string,
      onSelect: (value: string) => void,
      imageSize = 'h-24 w-24'
    ) => {
      return (
        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => (
            <div key={option.value} className="relative">
              <button
                className={`w-full rounded-xl overflow-hidden ${option.locked ? 'opacity-60' : ''} ${
                  selectedValue === option.value ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => !option.locked && onSelect(option.value)}
                disabled={option.locked}
              >
                {option.image ? (
                  <div className={`relative ${imageSize} mx-auto`}>
                    <Image
                      src={option.image || '/placeholder.svg'}
                      alt={option.label}
                      fill
                      className="object-cover rounded-xl"
                    />
                    {option.locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="bg-white/20 rounded-full p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ) : option.color ? (
                  <div
                    className={`${option.color} h-16 w-16 rounded-full mx-auto`}
                  ></div>
                ) : option.icon ? (
                  <div className="h-16 w-16 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto text-2xl">
                    {option.icon}
                  </div>
                ) : null}

                <div
                  className={`mt-2 py-1 px-2 rounded-full bg-zinc-700 text-white text-sm ${
                    selectedValue === option.value ? 'bg-pink-500' : ''
                  }`}
                >
                  {option.label}
                </div>

                {option.description && (
                  <div className="text-xs text-zinc-400 mt-1">
                    {option.description}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      );
    };

    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Style*</h2>
            {renderOptions(
              styleOptions,
              characterData.style,
              (value) => updateCharacterData({ style: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Ethnicity*</h2>
            {renderOptions(
              ethnicityOptions,
              characterData.ethnicity,
              (value) => updateCharacterData({ ethnicity: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Age*</h2>
            <div className="grid grid-cols-2 gap-3">
              {ageOptions.map((option) => (
                <div key={option.value} className="relative">
                  <button
                    className={`w-full py-4 rounded-xl ${option.locked ? 'bg-zinc-800 opacity-60' : 'bg-zinc-800'} ${
                      characterData.age === option.value ? 'bg-pink-500' : ''
                    }`}
                    onClick={() =>
                      !option.locked &&
                      updateCharacterData({ age: option.value })
                    }
                    disabled={option.locked}
                  >
                    <div className="text-lg font-bold">{option.label}</div>

                    {option.locked && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Eye Color*</h2>
            {renderOptions(
              eyeColorOptions,
              characterData.eyeColor,
              (value) => updateCharacterData({ eyeColor: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Hair Style*</h2>
            {renderOptions(
              hairStyleOptions,
              characterData.hairStyle,
              (value) => updateCharacterData({ hairStyle: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Hair Color*</h2>
            {renderOptions(hairColorOptions, characterData.hairColor, (value) =>
              updateCharacterData({ hairColor: value })
            )}
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Body Type*</h2>
            {renderOptions(
              bodyTypeOptions,
              characterData.bodyType,
              (value) => updateCharacterData({ bodyType: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 8:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Breast Size*</h2>
            {renderOptions(
              breastSizeOptions,
              characterData.breastSize,
              (value) => updateCharacterData({ breastSize: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 9:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Butt Size*</h2>
            {renderOptions(
              buttSizeOptions,
              characterData.buttSize,
              (value) => updateCharacterData({ buttSize: value }),
              'h-32 w-full'
            )}
          </div>
        );
      case 10:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Relationship*</h2>
            <div className="grid grid-cols-3 gap-3">
              {relationshipOptions.map((option) => (
                <div key={option.value} className="relative">
                  <button
                    className={`w-full p-4 rounded-xl bg-zinc-900 border ${option.locked ? 'opacity-60' : ''} ${
                      characterData.relationshipType === option.value
                        ? 'border-pink-500 ring-2 ring-pink-500'
                        : 'border-zinc-800'
                    }`}
                    onClick={() =>
                      !option.locked &&
                      updateCharacterData({ relationshipType: option.value })
                    }
                    disabled={option.locked}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="text-sm">{option.label}</div>

                    {option.locked && (
                      <div className="absolute right-2 top-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 11:
        // Summary page
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Summary</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-zinc-400 mb-2">Style</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.style && (
                    <>
                      <Image
                        src={
                          styleOptions.find(
                            (o) => o.value === characterData.style
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=person'
                        }
                        alt={characterData.style}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.style}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Ethnicity</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.ethnicity && (
                    <>
                      <Image
                        src={
                          ethnicityOptions.find(
                            (o) => o.value === characterData.ethnicity
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=person'
                        }
                        alt={characterData.ethnicity}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.ethnicity}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Age</h3>
                <div className="h-24 w-full rounded-xl bg-zinc-900 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {characterData.age || 'Not selected'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Eyes Color</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.eyeColor && (
                    <>
                      <Image
                        src={
                          eyeColorOptions.find(
                            (o) => o.value === characterData.eyeColor
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=eye'
                        }
                        alt={characterData.eyeColor}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.eyeColor}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Hair Style</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.hairStyle && (
                    <>
                      <Image
                        src={
                          hairStyleOptions.find(
                            (o) => o.value === characterData.hairStyle
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=hair'
                        }
                        alt={characterData.hairStyle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.hairStyle}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Hair Color</h3>
                <div className="h-24 w-full rounded-xl bg-zinc-900 flex flex-col items-center justify-center">
                  {characterData.hairColor && (
                    <>
                      <div
                        className={`${hairColorOptions.find((o) => o.value === characterData.hairColor)?.color || 'bg-gray-500'} h-12 w-12 rounded-full mb-2`}
                      ></div>
                      <span>{characterData.hairColor}</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Body Type</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.bodyType && (
                    <>
                      <Image
                        src={
                          bodyTypeOptions.find(
                            (o) => o.value === characterData.bodyType
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=body'
                        }
                        alt={characterData.bodyType}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.bodyType}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Breast Size</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.breastSize && (
                    <>
                      <Image
                        src={
                          breastSizeOptions.find(
                            (o) => o.value === characterData.breastSize
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=person'
                        }
                        alt={characterData.breastSize}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.breastSize}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Butt Size</h3>
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900">
                  {characterData.buttSize && (
                    <>
                      <Image
                        src={
                          buttSizeOptions.find(
                            (o) => o.value === characterData.buttSize
                          )?.image ||
                          '/placeholder.svg?height=96&width=96&query=person'
                        }
                        alt={characterData.buttSize}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2 text-center">
                        {characterData.buttSize}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Personality</h3>
                <div className="h-24 w-full rounded-xl bg-zinc-900 flex flex-col items-center justify-center">
                  {characterData.personalityType ? (
                    <>
                      <div className="text-2xl mb-1">
                        {personalityOptions.find(
                          (o) => o.value === characterData.personalityType
                        )?.icon || '🙂'}
                      </div>
                      <span>{characterData.personalityType}</span>
                    </>
                  ) : (
                    <span>Not selected</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-zinc-400 mb-2">Relationship</h3>
                <div className="h-24 w-full rounded-xl bg-zinc-900 flex flex-col items-center justify-center">
                  {characterData.relationshipType ? (
                    <>
                      <div className="text-2xl mb-1">
                        {relationshipOptions.find(
                          (o) => o.value === characterData.relationshipType
                        )?.icon || '👋'}
                      </div>
                      <span>{characterData.relationshipType}</span>
                    </>
                  ) : (
                    <span>Not selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Character Created!</h3>
                    <p>Your AI companion is ready to chat</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-zinc-800 rounded-xl flex items-center"
                >
                  <Pencil size={18} className="mr-2" /> Edit
                </button>

                <a
                  href="https://t.me/onlytwins_app_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-pink-500 rounded-xl font-bold"
                >
                  Start Chatting
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.main
      className="flex min-h-screen flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StatusBar />

      {/* Special offer banner */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/placeholder.svg?height=32&width=32&query=purple%20diamond"
            alt="Diamond"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="font-bold text-white">UP TO 70% OFF</span>
        </div>

        <div className="flex space-x-2 text-white">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs text-pink-300">Min</span>
          </div>
          <div className="text-lg font-bold">|</div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-pink-300">Sec</span>
          </div>
          <div className="text-lg font-bold">|</div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">
              {String(Math.floor(timeLeft.milliseconds / 10)).padStart(2, '0')}
            </span>
            <span className="text-xs text-pink-300">Ms</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center mb-6">
          <button onClick={prevStep} className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <Pencil size={20} className="mr-2" />
            <h1 className="text-2xl font-bold">Create my AI</h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center relative z-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  i + 1 < step
                    ? 'bg-pink-500'
                    : i + 1 === step
                      ? 'bg-white'
                      : 'bg-zinc-700'
                }`}
              >
                {i + 1 < step && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="absolute top-3 left-0 right-0 h-0.5 bg-zinc-700"></div>
          <div
            className="absolute top-3 left-0 h-0.5 bg-pink-500 transition-all duration-300"
            style={{ width: `${((step - 1) / 9) * 100}%` }}
          ></div>
        </div>

        {/* Step content */}
        <div className="bg-zinc-900 rounded-xl p-6 flex-1">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        {step < 11 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-zinc-800 rounded-xl flex items-center"
            >
              <ChevronLeft size={18} className="mr-2" /> Previous
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-3 bg-pink-500 rounded-xl flex items-center font-bold"
              disabled={
                (step === 1 && !characterData.style) ||
                (step === 2 && !characterData.ethnicity) ||
                (step === 3 && !characterData.age) ||
                (step === 4 && !characterData.eyeColor) ||
                (step === 5 && !characterData.hairStyle) ||
                (step === 6 && !characterData.hairColor) ||
                (step === 7 && !characterData.bodyType) ||
                (step === 8 && !characterData.breastSize) ||
                (step === 9 && !characterData.buttSize) ||
                (step === 10 && !characterData.relationshipType)
              }
            >
              Next <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </motion.main>
  );
}
