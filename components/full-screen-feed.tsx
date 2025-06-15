'use client';

import type React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import SafeImage from './safe-image';
import { useRouter } from 'next/navigation';
import { AgentResponse } from '@/lib/types/agents';

interface FullScreenFeedProps {
  characters: AgentResponse[] | null;
}

export default function FullScreenFeed({ characters }: FullScreenFeedProps) {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [likedCharacters, setLikedCharacters] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const [horizontalDirection, setHorizontalDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalSwiping, setIsVerticalSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragEndY, setDragEndY] = useState(0);
  const [isPullingToRefresh, setIsPullingToRefresh] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const swipeThreshold = 30;
  const pullThreshold = 80;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(false);

    const hasSeenHint = localStorage.getItem('hasSeenSwipeHint');
    if (!hasSeenHint) {
      setShowSwipeHint(true);
      setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem('hasSeenSwipeHint', 'true');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (characters && currentCharacterIndex >= characters.length) {
      setCurrentCharacterIndex(0);
    }
  }, [characters, currentCharacterIndex]);

  const currentCharacter = characters?.[currentCharacterIndex];

  useEffect(() => {
    if (currentCharacter) {
      if (!currentCharacter.meta.profileImage) {
        const characterWithImage = characters.findIndex(
          (char) => char.meta.profileImage
        );
        if (
          characterWithImage !== -1 &&
          characterWithImage !== currentCharacterIndex
        ) {
          setCurrentCharacterIndex(characterWithImage);
        }
      } else if (
        currentMediaIndex >= (currentCharacter.meta.profileImage ? 1 : 0)
      ) {
        setCurrentMediaIndex(0);
      }

      if (currentCharacter.meta.profileVideo) {
        setIsPlaying(true);
      }
    }
  }, [characters, currentCharacter, currentMediaIndex, currentCharacterIndex]);

  const currentMedia = currentCharacter?.meta.profileImage
    ? { type: 'image' as const, src: currentCharacter.meta.profileImage }
    : currentCharacter?.meta.profileVideo
      ? { type: 'video' as const, src: currentCharacter.meta.profileVideo }
      : null;

  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsPlaying(true);
    setVideoError(false);
    setSwipeProgress(0);
  }, [currentCharacterIndex]);

  useEffect(() => {
    if (currentMedia?.type === 'video' && videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.error('Error playing video:', err);
          setIsPlaying(false);
          setVideoError(true);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentMedia, isPlaying, currentMediaIndex, videoError]);

  useEffect(() => {
    const nextIndex = (currentCharacterIndex + 1) % characters!.length;
    const nextCharacter = characters![nextIndex];

    if (nextCharacter?.meta.profileImage) {
      const img = new Image();
      img.src = nextCharacter.meta.profileImage;
    }
  }, [currentCharacterIndex, characters]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentCharacterIndex(0);
      setCurrentMediaIndex(0);
      const shuffledCharacters = [...characters!].sort(
        () => Math.random() - 0.5
      );
      setIsRefreshing(false);
      setPullProgress(0);
      setIsPullingToRefresh(false);
      console.log('Feed refreshed successfully');
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }, 1500);
  }, [characters]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setDragStartY(e.touches[0].clientY);
        setIsPullingToRefresh(false);
        setPullProgress(0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && !isRefreshing) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - dragStartY;
        const isAtTop = container.scrollTop <= 0;

        if (isAtTop && deltaY > 0) {
          setIsPullingToRefresh(true);
          const progress = Math.min(deltaY / pullThreshold, 1);
          setPullProgress(progress);
          e.preventDefault();
        } else if (Math.abs(deltaY) > 20) {
          setIsVerticalSwiping(true);
          const progress = Math.min(Math.abs(deltaY) / 300, 1);
          setSwipeProgress(progress);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1 && !isRefreshing) {
        const endY = e.changedTouches[0].clientY;
        setDragEndY(endY);
        const deltaY = endY - dragStartY;

        if (isPullingToRefresh && deltaY >= pullThreshold) {
          handleRefresh();
        } else if (Math.abs(deltaY) > swipeThreshold && !isPullingToRefresh) {
          if (deltaY < 0) {
            handleNextCharacter();
          } else {
            handlePrevCharacter();
          }
        }

        if (!isRefreshing) {
          setTimeout(() => {
            setIsVerticalSwiping(false);
            setSwipeProgress(0);
            if (!deltaY || deltaY < pullThreshold) {
              setIsPullingToRefresh(false);
              setPullProgress(0);
            }
          }, 100);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    dragStartY,
    swipeThreshold,
    pullThreshold,
    isPullingToRefresh,
    isRefreshing,
    handleRefresh,
  ]);

  const handleNextCharacter = () => {
    setDirection(1);
    setCurrentCharacterIndex((prev) => (prev + 1) % characters!.length);
  };

  const handlePrevCharacter = () => {
    setDirection(-1);
    setCurrentCharacterIndex(
      (prev) => (prev - 1 + characters!.length) % characters!.length
    );
  };

  const handleMediaTap = (e: React.MouseEvent) => {
    if (isDragging) return;

    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const tapPosition = clientX - left;

    if (
      currentCharacter?.meta.profileVideo ||
      currentCharacter?.meta.profileImage
    ) {
      if (tapPosition < width / 2) {
        handlePrevMedia();
      } else {
        handleNextMedia();
      }
    }
  };

  const handleNextMedia = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      (currentCharacter?.meta.profileImage ? 1 : 0) +
        (currentCharacter?.meta.profileVideo ? 1 : 0) >
      1
    ) {
      setHorizontalDirection(1);
      setCurrentMediaIndex((prev) => (prev + 1) % 2);
      setVideoError(false);
    }
  };

  const handlePrevMedia = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      (currentCharacter?.meta.profileImage ? 1 : 0) +
        (currentCharacter?.meta.profileVideo ? 1 : 0) >
      1
    ) {
      setHorizontalDirection(-1);
      setCurrentMediaIndex((prev) => (prev - 1 + 2) % 2);
      setVideoError(false);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsVerticalSwiping(false);
    setSwipeProgress(0);
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (
      Math.abs(info.offset.y) > Math.abs(info.offset.x) &&
      Math.abs(info.offset.y) > 20
    ) {
      setIsVerticalSwiping(true);
      const progress = Math.min(Math.abs(info.offset.y) / 300, 1);
      setSwipeProgress(progress);
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setTimeout(() => {
      setIsDragging(false);
      setIsVerticalSwiping(false);
      setSwipeProgress(0);
    }, 100);

    if (
      Math.abs(info.offset.y) > Math.abs(info.offset.x) &&
      Math.abs(info.offset.y) > swipeThreshold
    ) {
      if (info.offset.y < 0) {
        handleNextCharacter();
      } else {
        handlePrevCharacter();
      }
    } else if (
      Math.abs(info.offset.x) > Math.abs(info.offset.y) &&
      Math.abs(info.offset.x) > swipeThreshold
    ) {
      const mediaCount =
        (currentCharacter?.meta.profileImage ? 1 : 0) +
        (currentCharacter?.meta.profileVideo ? 1 : 0);
      if (mediaCount > 1) {
        if (info.offset.x < 0) {
          handleNextMedia();
        } else {
          handlePrevMedia();
        }
      }
    }
  };

  const handleLike = (e: React.MouseEvent, characterId: number | undefined) => {
    if (!characterId) return;
    e.stopPropagation();
    e.preventDefault();

    setLikedCharacters((prevLiked) =>
      prevLiked.includes(characterId)
        ? prevLiked.filter((id) => id !== characterId)
        : [...prevLiked, characterId]
    );
  };

  const handleChatClick = (
    e: React.MouseEvent,
    characterId: number | undefined
  ) => {
    if (!characterId) return;
    e.stopPropagation();
    e.preventDefault();

    // Placeholder for chat navigation
    console.log('Chat clicked for character:', characterId);
  };

  const handleProfileClick = (
    e: React.MouseEvent,
    characterId: number | undefined
  ) => {
    if (!characterId) return;
    e.stopPropagation();
    e.preventDefault();

    const character = characters!.find((c) => c.id === characterId);
    if (character) {
      router.push(`/character/${character.id}`);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    console.error(`Failed to load video: ${currentMedia?.src}`);
    setVideoError(true);
    setIsPlaying(false);
    if (currentCharacter?.meta.profileImage) {
      setCurrentMediaIndex(0);
    }
  };

  const showVideoControls = currentMedia?.type === 'video' && !videoError;
  const shouldShowPoster =
    currentMedia?.type === 'video' && !currentCharacter?.meta.profileImage;

  if (!characters || characters.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-white text-xl">No characters available</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const hasMultipleMedia = !!(
    currentCharacter?.meta.profileImage && currentCharacter.meta.profileVideo
  );
  console.log(currentCharacter);
  console.log(currentMedia);
  return (
    <div className="fixed inset-0 bg-black overflow-hidden" ref={containerRef}>
      <div
        className={`absolute top-0 left-0 right-0 flex justify-center items-center transition-transform duration-300 z-50 ${
          isPullingToRefresh || isRefreshing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translateY(${isPullingToRefresh || isRefreshing ? Math.min(pullProgress * 60, 60) : 0}px)`,
          height: '60px',
        }}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 flex items-center justify-center">
          {isRefreshing ? (
            <RefreshCw size={24} className="text-white animate-spin" />
          ) : (
            <RefreshCw
              size={24}
              className="text-white transition-transform duration-300"
              style={{
                transform: `rotate(${pullProgress * 360}deg)`,
                opacity: pullProgress,
              }}
            />
          )}
        </div>
        <span className="ml-2 text-white text-sm">
          {isRefreshing
            ? 'Refreshing...'
            : pullProgress >= 1
              ? 'Release to refresh'
              : 'Pull to refresh'}
        </span>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentCharacterIndex}
          custom={direction}
          initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
          className="absolute inset-0"
        >
          <div className="relative h-screen w-full overflow-hidden">
            <motion.div
              className="absolute inset-0"
              onClick={handleMediaTap}
              drag={true}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`${currentCharacterIndex}-${currentMediaIndex}`}
                  initial={{ opacity: 0, x: horizontalDirection * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: horizontalDirection * -100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {!currentMedia ||
                  currentMedia.type === 'image' ||
                  videoError ? (
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia?.src}` ||
                        '/claire-profile.png'
                      }
                      className={'w-full h-full object-cover'}
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      {shouldShowPoster && (
                        <div className="absolute inset-0 z-0">
                          <img
                            src="/claire-profile.png"
                            alt={currentCharacter?.name}
                          />
                        </div>
                      )}
                      {/* <video
                        ref={videoRef}
                        src={currentMedia.src}
                        className="h-full w-full object-cover relative z-10"
                        playsInline
                        loop
                        muted={isMuted}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        preload="auto"
                        crossOrigin="anonymous"
                        autoPlay
                      /> */}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {isVerticalSwiping && (
              <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                <div
                  className="bg-black/30 backdrop-blur-sm rounded-full p-3 transform transition-all duration-200"
                  style={{
                    opacity: swipeProgress,
                    transform: `scale(${0.8 + swipeProgress * 0.4})`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </div>
              </div>
            )}

            <div className="absolute top-0 left-0 right-0 flex justify-between px-2 py-1 z-10">
              {[
                currentCharacter?.meta.profileImage ? 0 : -1,
                currentCharacter?.meta.profileVideo ? 1 : -1,
              ]
                .filter((i) => i >= 0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 ${index === currentMediaIndex ? 'bg-white' : 'bg-white/30'} transition-all duration-300 flex-1 mx-0.5`}
                  />
                ))}
            </div>

            {hasMultipleMedia && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs z-10">
                {currentMediaIndex + 1}/2
              </div>
            )}

            {showSwipeHint && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 px-6 py-3 rounded-full text-white text-center animate-pulse z-30">
                <p>Swipe up/down to change characters</p>
                <p className="text-sm mt-1">Pull down to refresh feed</p>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 z-20">
              <div className="flex flex-col">
                <div
                  className="flex items-center mb-1 cursor-pointer"
                  onClick={(e) => handleProfileClick(e, currentCharacter?.id)}
                >
                  <h2 className="text-2xl font-bold text-white">
                    {currentCharacter?.name}
                  </h2>
                  <span className="text-zinc-400 ml-2">
                    {currentCharacter?.meta.age}
                  </span>
                </div>

                <p
                  className="text-zinc-400 mb-4 cursor-pointer"
                  onClick={(e) => handleProfileClick(e, currentCharacter?.id)}
                >
                  {currentCharacter?.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={(e) =>
                        handleProfileClick(e, currentCharacter?.id)
                      }
                      className="flex items-center justify-center h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20"
                      aria-label="View profile"
                    >
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
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </button>

                    <button
                      onClick={(e) => handleLike(e, currentCharacter?.id)}
                      className={`flex items-center justify-center h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 ${
                        currentCharacter?.id
                          ? likedCharacters.includes(currentCharacter?.id)
                            ? 'text-pink-500'
                            : 'text-white'
                          : 'none'
                      }`}
                      aria-label="Like character"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={
                          currentCharacter?.id
                            ? likedCharacters.includes(currentCharacter?.id)
                              ? 'currentColor'
                              : 'none'
                            : 'none'
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleChatClick(e, currentCharacter?.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Chat Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
