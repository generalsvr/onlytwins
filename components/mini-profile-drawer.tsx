'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { X, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from './safe-image';
import { useRouter } from 'next/navigation';

interface MiniProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  character: {
    id: number;
    name: string;
    age: number;
    image: string;
    category: string;
    rating: number;
    tags: string[];
    isNew?: boolean;
    profilePath?: string;
    description?: string;
    occupation?: string;
    orientation?: string;
  };
}

export default function MiniProfileDrawer({
  isOpen,
  onClose,
  character,
}: MiniProfileDrawerProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock additional images for the carousel
  const images = [
    character.image,
    `/placeholder.svg?height=600&width=400&query=${encodeURIComponent(character.name + ' second image')}`,
    `/placeholder.svg?height=600&width=400&query=${encodeURIComponent(character.name + ' third image')}`,
  ];

  // Ensure the drawer is scrolled to the top when opened
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleViewFullProfile = () => {
    if (character.profilePath) {
      router.push(character.profilePath);
    } else {
      router.push(`/character/${character.id}`);
    }
  };

  const handleStartChat = () => {
    // Navigate to the specific character's chat based on their name or ID
    if (
      character.name === 'Valeria & Camila' ||
      character.category === 'Twins'
    ) {
      router.push(`/chat/valeria-camila`);
    } else if (character.profilePath) {
      // Extract character name from profilePath if available
      const characterName = character.profilePath.split('/').pop();
      router.push(`/chat/${characterName}`);
    } else {
      // Fallback to using the character's ID or name
      const chatId =
        typeof character.id === 'string'
          ? character.id
          : character.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

          {/* Mini profile drawer - now full width */}
          <motion.div
            ref={containerRef}
            className="relative z-10 w-full bg-zinc-900 overflow-y-auto max-h-screen"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 bg-black/50 rounded-full p-2"
              aria-label="Close profile"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Image carousel - reduced height to ensure buttons are visible */}
            <div className="relative w-full h-[45vh]">
              <SafeImage
                src={images[currentImageIndex]}
                alt={character.name}
                className="w-full h-full object-cover"
              />

              {/* Carousel controls */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              {/* Like button */}
              <button
                onClick={handleLike}
                className="absolute right-4 bottom-4 bg-black/50 rounded-full p-3 z-10"
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  size={24}
                  className={
                    isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'
                  }
                />
              </button>

              {/* Pagination dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index
                        ? 'bg-pink-500'
                        : 'bg-white/50'
                    } transition-all`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Profile info */}
            <div className="p-6">
              <h2 className="text-3xl font-bold flex items-center">
                {character.name}{' '}
                <span className="text-orange-400 ml-2">🍑</span>
              </h2>
              <p className="text-lg text-zinc-300">
                {character.age} | {character.occupation || 'Model'} |{' '}
                {character.orientation || 'Straight'}
              </p>

              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">
                  {character.description || 'Seductive AI Companion'}
                </h3>
                <p className="text-zinc-300 mb-3">
                  {character.tags.join(' | ')}
                </p>
                <p className="text-zinc-300">
                  {character.category === 'Twins'
                    ? "We're twin sisters who love to share everything... including our wildest adventures!"
                    : "I've been waiting for someone like you. Let's create unforgettable moments together."}
                </p>
              </div>

              {/* Action buttons - now with padding to ensure visibility */}
              <div className="mt-6 pb-6">
                <button
                  onClick={handleStartChat}
                  className="w-full bg-pink-500 text-white py-4 rounded-full text-xl font-medium mb-4"
                >
                  Start a chat with me
                </button>
                <button
                  onClick={handleViewFullProfile}
                  className="w-full border border-zinc-600 text-white py-3 rounded-full text-lg font-medium"
                >
                  View full profile
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
