'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/safe-image';
import { useMediaQuery } from 'react-responsive';
import MiniProfileDrawer from '@/components/mini-profile-drawer';

interface ExplorePageProps {
  onCharacterSelect?: (characterId: number) => void;
  isAuthenticated?: boolean;
}

// Sample categories
const categories = [
  { id: 1, name: 'Girls', icon: '♀️' },
  { id: 2, name: 'Anime', icon: '🌸' },
  { id: 3, name: 'Guys', icon: '♂️' },
  { id: 4, name: 'Blonde', icon: '👱‍♀️' },
  { id: 5, name: 'Brunette', icon: '👩‍🦰' },
  { id: 6, name: 'Asian', icon: '🌏' },
  { id: 7, name: 'Latina', icon: '💃' },
  { id: 8, name: 'Twins', icon: '👯‍♀️' },
];

// Sample banners for the carousel
const banners = [
  {
    id: 1,
    title: 'IMAGE GEN',
    subtitle: 'Create perfect images',
    buttonText: 'CREATE',
    image: '/modern-art-gallery.png',
    bgColor: 'from-pink-500 to-pink-600',
  },
  {
    id: 2,
    title: 'CREATE AI',
    subtitle: 'Design your companion',
    buttonText: 'START',
    image: '/art-exhibition-gallery.png',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: '70% OFF',
    subtitle: 'Limited time',
    buttonText: 'CLAIM',
    image: '/silver-forest-wanderer.png',
    bgColor: 'from-indigo-600 to-purple-600',
    timer: true,
  },
];

// Sample characters
const characters = [
  {
    id: 1,
    name: 'Claire',
    age: 24,
    image: '/claire-party.jpeg',
    category: 'Brunette',
    rating: 4.9,
    tags: ['Flirty', 'Party'],
    isNew: true,
    profilePath: '/character/claire',
    occupation: 'Yoga Instructor',
    orientation: 'Straight',
    description: 'Seductive Fitness Enthusiast',
  },
  {
    id: 2,
    name: 'Jenny',
    age: 22,
    image: '/jennypinky-new-profile.png',
    category: 'Brunette',
    rating: 4.8,
    tags: ['Sweet', 'Art'],
    isNew: true,
    profilePath: '/character/jenny',
    occupation: 'Fansly Model',
    orientation: 'Straight',
    description: 'Sweet & Artistic',
  },
  {
    id: 3,
    name: 'Valeria & Camila',
    age: 25,
    image: '/valeria-camila-new.png',
    category: 'Twins',
    rating: 4.9,
    tags: ['Twin Sisters', 'Spanish'],
    profilePath: '/character/valeria-camila',
    occupation: 'Dancers',
    orientation: 'Bisexual',
    description: 'Twin Goddesses',
  },
  {
    id: 4,
    name: 'Lee',
    age: 27,
    image: '/lee-new-profile.png',
    category: 'Asian',
    rating: 4.7,
    tags: ['Fashion', 'Luxury'],
    isNew: true,
    profilePath: '/character/lee',
    occupation: 'Art Curator',
    orientation: 'Straight',
    description: 'Sophisticated & Elegant',
  },
  {
    id: 5,
    name: 'Hana',
    age: 21,
    image: '/hana-new-profile.png',
    category: 'Asian',
    rating: 4.6,
    tags: ['Anime', 'Gaming'],
    profilePath: '/character/hana',
    occupation: 'Anime Artist & Cosplayer',
    orientation: 'Straight',
    description: 'Your IRL Waifu',
  },
  {
    id: 6,
    name: 'Akari',
    age: 23,
    image: '/akari-portrait.webp',
    category: 'Asian',
    rating: 4.5,
    tags: ['Jazz Singer', 'Detective'],
    isNew: true,
    profilePath: '/character/akari',
    occupation: 'Singer & Detective',
    orientation: 'Straight',
    description: 'Mysterious & Alluring',
  },
];

export default function ExplorePage({
}: ExplorePageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Girls');
  const [currentBanner, setCurrentBanner] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [selectedCharacter, setSelectedCharacter] = useState<
    (typeof characters)[0] | null
  >(null);
  const [showMiniProfile, setShowMiniProfile] = useState(false);

  // Filter characters based on selected category and search query
  const filteredCharacters = characters.filter(
    (character) =>
      (activeCategory === 'Girls' || character.category === activeCategory) &&
      character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for special offers
  useEffect(() => {
    if (banners[currentBanner]?.timer) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          let newSec = prev.seconds - 1;
          let newMin = prev.minutes;

          if (newSec < 0) {
            newSec = 59;
            newMin -= 1;
          }

          if (newMin < 0) {
            clearInterval(timerRef.current!);
            return { minutes: 0, seconds: 0 };
          }

          return { minutes: newMin, seconds: newSec };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentBanner]);

  const handleCreateCharacter = () => {
    router.push('/create-character');
  };

  const handleCharacterClick = (character: (typeof characters)[0]) => {
    setSelectedCharacter(character);
    setShowMiniProfile(true);
  };

  const handleCloseMiniProfile = () => {
    setShowMiniProfile(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="top-0 z-10 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Explore</h1>
          <div className="flex space-x-2">
            <button
              className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium"
            >
              Join
            </button>
            <button
              className="bg-zinc-800 text-white px-4 py-1 rounded-full text-sm font-medium"
            >
              Login
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center ${
                activeCategory === category.name
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className="mr-1">{category.icon}</span> {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="relative w-full h-48 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`w-full h-full flex-shrink-0 relative bg-gradient-to-r ${banner.bgColor}`}
            >
              <SafeImage
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover opacity-40 mix-blend-overlay"
                fallbackSrc={`/placeholder.svg?height=192&width=384&query=${encodeURIComponent(banner.title)}`}
              />

              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {banner.title}
                    </h2>
                    <p className="text-white/80 text-sm">{banner.subtitle}</p>
                  </div>

                  {banner.timer && (
                    <div className="flex space-x-1 text-white">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-pink-300">Min</span>
                      </div>
                      <div className="text-lg font-bold">:</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-pink-300">Sec</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold transition-colors text-sm">
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
          onClick={() =>
            setCurrentBanner((prev) =>
              prev === 0 ? banners.length - 1 : prev - 1
            )
          }
          aria-label="Previous banner"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
          onClick={() =>
            setCurrentBanner((prev) => (prev + 1) % banners.length)
          }
          aria-label="Next banner"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentBanner === index ? 'bg-pink-500 w-4' : 'bg-white/50'
              } transition-all`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-zinc-800 w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Filter size={18} className="text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="pb-4">
        <h2 className="text-xl font-bold mb-3 text-white">
          <span className="text-pink-500">OnlyTwins</span> Companions
        </h2>

        <div
          className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}
        >
          {/* Create Your Own Character Card */}
          <motion.div
            className="bg-zinc-900 rounded-xl overflow-hidden border border-dashed border-zinc-700 flex flex-col items-center justify-center p-4 h-48"
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateCharacter}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <Plus size={20} className="text-pink-500" />
            </div>
            <h3 className="text-base font-semibold text-center">
              Create Your Own
            </h3>
            <p className="text-xs text-zinc-400 text-center mt-1">
              Design your AI
            </p>
          </motion.div>

          {/* Character Cards */}
          {filteredCharacters.map((character) => (
            <motion.div
              key={character.id}
              className="bg-zinc-900 rounded-xl overflow-hidden relative"
              onClick={() => handleCharacterClick(character)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative h-48">
                <SafeImage
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                  fallbackSrc={`/placeholder.svg?height=192&width=144&query=${encodeURIComponent(character.name)}`}
                />

                {character.isNew && (
                  <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                    <Zap size={10} className="mr-0.5" /> New
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {character.name}
                      </h3>
                      <p className="text-white/70 text-xs">{character.age}</p>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star size={12} fill="currentColor" className="mr-0.5" />
                      <span className="text-xs">{character.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {character.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-zinc-800/80 px-1.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mini Profile Drawer */}
      {selectedCharacter && (
        <MiniProfileDrawer
          isOpen={showMiniProfile}
          onClose={handleCloseMiniProfile}
          character={selectedCharacter}
        />
      )}
    </div>
  );
}
