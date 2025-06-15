'use client';
import { useState, useEffect } from 'react';
import FullScreenFeed from './full-screen-feed';
import SafeImage from './safe-image';
import Heart from './heart';
import { useRouter } from 'next/navigation';

interface FeedPageProps {
  onCharacterSelect: (characterId: number) => void;
  onOpenChat: (characterId: number) => void;
  isAuthenticated: boolean;
  onAuthRequired: (mode: 'login' | 'signup') => void;
}

// Mock data for characters with multiple images and videos
const CHARACTERS = [
  {
    id: 1,
    name: 'Claire',
    age: 24,
    description: 'Model, Fitness Enthusiast',
    verified: true,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Claire-Qve18drJWyLT2hmeaCLXT2Y5QJUQEP.mp4',
        poster: '/claire-party.jpeg',
      },
      { type: 'image', src: '/claire-party.jpeg' },
      { type: 'image', src: '/claire-couch.jpeg' },
      { type: 'image', src: '/claire-rooftop.jpeg' },
      { type: 'image', src: '/claire-black-outfit.jpeg' },
      { type: 'image', src: '/claire-white-top.jpeg' },
    ],
    isPremium: false,
    profilePath: '/character/claire',
  },
  {
    id: 2,
    name: 'Valeria & Camila',
    age: 25,
    description: 'Twin Sisters, Spanish Models',
    verified: true,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Twin%20Sisters-Nym0PD23BEeJ3Cii0lfQdLoI8aI2KT.mp4',
        poster: '/valeria-camila-new.png',
      },
      { type: 'image', src: '/twins-balcony-bikini.webp' },
      { type: 'image', src: '/twins-red-lingerie.webp' },
      { type: 'image', src: '/twins-cheerleaders.webp' },
      { type: 'image', src: '/valeria-camila-new.png' },
      { type: 'image', src: '/modern-art-gallery.png' },
      { type: 'image', src: '/art-exhibition-gallery.png' },
    ],
    isPremium: false,
    profilePath: '/character/valeria-camila',
  },
  {
    id: 3,
    name: 'Jenny',
    age: 23,
    description: 'Student, Music Lover',
    verified: true,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Jenny-31k4zEjCViaMDt8GbFIxkkHccpbWzt.mp4',
        poster: '/jennypinky-new-profile.png',
      },
      { type: 'image', src: '/jennypinky-new-profile.png' },
      { type: 'image', src: '/jennypinky-profile.png' },
      { type: 'image', src: '/art-exhibition-gallery.png' },
    ],
    isPremium: true,
    profilePath: '/character/jenny',
  },
  {
    id: 4,
    name: 'Lee',
    age: 27,
    description: 'Curator, Artist, Adventurer',
    verified: true,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Lee-3qJSnpL6qlUV7BHWDFEUIAQIHAnKHZ.mp4',
        poster: '/lee-pink-dress.webp',
      },
      { type: 'image', src: '/lee-pink-dress.webp' },
      { type: 'image', src: '/lee-black-lace.webp' },
      { type: 'image', src: '/lee-white-lingerie.webp' },
      { type: 'image', src: '/lee-nurse.webp' },
      { type: 'image', src: '/lee-crop-top.webp' },
      { type: 'image', src: '/lee-new-profile.png' },
    ],
    isPremium: true,
    profilePath: '/character/lee',
  },
  {
    id: 5,
    name: 'Hana',
    age: 23,
    description: 'Model, Fitness Enthusiast, Anime Lover',
    verified: true,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Hana-zZMG1laNVW2gRlxYks48IfZqPMSGyA.mp4',
        poster: '/hana-black-lingerie.webp',
      },
      { type: 'image', src: '/hana-black-lingerie.webp' },
      { type: 'image', src: '/hana-white-dress.webp' },
      { type: 'image', src: '/hana-beach-dress.webp' },
      { type: 'image', src: '/hana-electric-town-hoodie.webp' },
      { type: 'image', src: '/hana-lingerie-couch.webp' },
      { type: 'image', src: '/hana-sports-bra.webp' },
    ],
    isPremium: false,
    profilePath: '/character/hana',
  },
  {
    id: 6,
    name: 'Akari',
    age: 26,
    description: 'Singer, Detective, Mystery Solver',
    verified: true,
    media: [
      {
        type: 'video',
        src: '/akari-video.mp4',
        poster: '/akari-portrait.webp',
      },
      { type: 'image', src: '/akari-new-profile.png' },
      { type: 'image', src: '/akari-bedroom.webp' },
      { type: 'image', src: '/akari-nightclub.webp' },
    ],
    isPremium: false,
    profilePath: '/character/akari',
  },
];

export default function FeedPage({
  onCharacterSelect,
  onOpenChat,
  isAuthenticated,
  onAuthRequired,
}: FeedPageProps) {
  const [isMobile, setIsMobile] = useState(true);
  const router = useRouter();

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Ensure all characters have valid media arrays
  const validatedCharacters = CHARACTERS.map((character) => ({
    ...character,
    media:
      Array.isArray(character.media) && character.media.length > 0
        ? character.media
        : [{ type: 'image', src: '/claire-profile.png' }],
  }));

  // Convert the new media format to the old images format for desktop view
  const charactersWithImages = validatedCharacters.map((character) => ({
    ...character,
    images: character.media.map((item) =>
      item.type === 'video' && item.poster ? item.poster : item.src
    ),
  }));

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {isMobile ? (
        // Mobile view - Full screen feed with no header padding
        <FullScreenFeed
          characters={validatedCharacters}
          onCharacterSelect={onCharacterSelect}
          isAuthenticated={isAuthenticated}
          onAuthRequired={onAuthRequired}
          onChatClick={onOpenChat}
          noHeaderPadding={true}
        />
      ) : (
        // Desktop view - Grid layout
        <div className="pt-20">
          <h1 className="text-3xl font-bold mb-8">Discover AI Companions</h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-screen overflow-y-auto hide-scrollbar pb-48">
            {charactersWithImages.map((character) => (
              <div
                key={character.id}
                className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (character.profilePath) {
                    router.push(character.profilePath);
                  } else {
                    onCharacterSelect(character.id);
                  }
                }}
              >
                <div className="relative aspect-[3/4]">
                  {character.media &&
                  character.media[0] &&
                  character.media[0].type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video
                        src={character.media[0].src}
                        poster={character.media[0].poster}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        autoPlay
                        onError={(e) => {
                          console.error(
                            `Failed to load video: ${character.media[0].src}`
                          );
                          // Fall back to poster image if available, or hide the video element
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          if (character.media[0].poster) {
                            const img = document.createElement('img');
                            img.src = character.media[0].poster;
                            img.className = 'w-full h-full object-cover';
                            img.alt = character.name;
                            target.parentNode?.appendChild(img);
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SafeImage
                      src={character.images[0] || '/claire-profile.png'}
                      alt={character.name}
                      fill
                      className="object-cover"
                      fallbackSrc="/claire-profile.png"
                    />
                  )}
                  {character.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold">{character.name}</h3>
                    <span className="text-zinc-400">{character.age}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    {character.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="text-pink-500 hover:text-pink-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chat/${character.id}`);
                      }}
                    >
                      Chat Now
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div
          className={`fixed ${isMobile ? 'bottom-16' : 'bottom-4 right-4 max-w-sm'} left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 p-3 flex justify-between items-center z-40 ${isMobile ? '' : 'rounded-lg mx-auto'}`}
        >
          <p className="text-white text-sm">
            Sign up to see more content and chat with AI characters!
          </p>
          <button
            onClick={() => onAuthRequired('signup')}
            className="bg-white text-pink-500 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
