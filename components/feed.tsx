'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  MessageCircle,
  Heart,
  Share,
  MapPin,
  Calendar,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  User,
  Grid,
  Square, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, Mousewheel, Keyboard, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { AgentResponse } from '@/lib/types/agents';
import useWindowSize from '@/lib/hooks/useWindowSize';
import AgentCard from '@/components/full-screen-feed';
import { useLocale } from '@/contexts/LanguageContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/controller';

interface DesktopAgentFeedProps {
  agents: AgentResponse[];
}

// Video cache to store loaded videos
const videoCache = new Map<string, HTMLVideoElement>();
const videoLoadingStates = new Map<string, boolean>();

export default function DesktopAgentFeed({ agents }: DesktopAgentFeedProps) {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<Set<string>>(new Set());
  const [videoLoaded, setVideoLoaded] = useState<Set<string>>(new Set());
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0); // Key for forcing Swiper remount
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);

  const { isMobile } = useWindowSize();
  const { locale, dictionary } = useLocale();

  const swiperRef = useRef<SwiperType | null>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const loadingControllerRef = useRef<AbortController | null>(null);
  const prevIsMobileRef = useRef(isMobile);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Получаем переводы для текущей локали
  const t = useMemo(() => {
    return dictionary;
  }, [dictionary]);

  // Функция для форматирования даты с учетом локали
  const formatDate = useCallback(
    (date: string | Date, locale: string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!dateObj || isNaN(dateObj.getTime())) {
        return '';
      }
      if (locale === 'zh') {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        return `${year}年${month}月`;
      } else if (locale === 'ru') {
        const monthNames = Object.values(t.months || {});
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${month} ${year}`;
      } else {
        const monthNames = Object.values(t.months || {});
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${month} ${year}`;
      }
    },
    [t.months]
  );

  // Функция для получения правильной формы "лет" в русском языке
  const getAgeText = useCallback(
    (age: number, locale: string) => {
      if (locale === 'ru') {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
          return `${age} лет`;
        } else if (lastDigit === 1) {
          return `${age} год`;
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          return `${age} года`;
        } else {
          return `${age} лет`;
        }
      } else if (locale === 'zh') {
        return `${age}${t.common?.yearsOld || 'years old'}`;
      } else {
        return `${age} ${t.common?.yearsOld || 'years old'}`;
      }
    },
    [t.common?.yearsOld]
  );

  // Current selected agent
  const selectedAgent = useMemo(
    () => agents[currentAgentIndex],
    [agents, currentAgentIndex]
  );

  // Get images for current selected agent
  const currentImages = useMemo(() => {
    if (!selectedAgent) return [];

    const images = [];

    // Add profile image
    if (selectedAgent.meta.profileImage) {
      images.push(selectedAgent.meta.profileImage);
    }

    // Add images from public content
    if (selectedAgent.meta.publicContent) {
      selectedAgent.meta.publicContent.forEach((item) => {
        if (item.mimeType?.startsWith('image/')) {
          images.push(item.url);
        }
      });
    }

    return images;
  }, [selectedAgent]);

  // Get video URL for current selected agent
  const currentVideoUrl = useMemo(() => {
    return selectedAgent?.meta.profileVideo || null;
  }, [selectedAgent]);

  const currentVideoKey = useMemo(() => {
    return currentVideoUrl ? `${selectedAgent?.id}-${currentVideoUrl}` : null;
  }, [selectedAgent?.id, currentVideoUrl]);

  // Swiper navigation functions
  const goToPreviousAgent = useCallback(() => {
    if (swiperRef.current && currentAgentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      swiperRef.current.slidePrev();
    }
  }, [currentAgentIndex, isTransitioning]);

  const goToNextAgent = useCallback(() => {
    if (swiperRef.current && currentAgentIndex < agents.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      swiperRef.current.slideNext();
    }
  }, [currentAgentIndex, agents.length, isTransitioning]);

  // Preload video function
  const preloadVideo = useCallback(
    async (videoUrl: string, videoKey: string, signal?: AbortSignal) => {
      if (videoCache.has(videoKey) || videoLoadingStates.get(videoKey)) {
        return videoCache.get(videoKey);
      }

      videoLoadingStates.set(videoKey, true);
      setIsVideoLoading(true);

      try {
        const video = document.createElement('video');
        video.playsInline = true;
        video.muted = true;
        video.preload = 'metadata';
        video.loop = true;

        const fullVideoUrl = `${videoUrl}`;

        return new Promise<HTMLVideoElement>((resolve, reject) => {
          const handleLoadedData = () => {
            if (signal?.aborted) {
              reject(new Error('Aborted'));
              return;
            }

            videoCache.set(videoKey, video);
            setVideoLoaded((prev) => new Set(prev).add(videoKey));
            setVideoError((prev) => {
              const newSet = new Set(prev);
              newSet.delete(videoKey);
              return newSet;
            });
            videoLoadingStates.delete(videoKey);
            setIsVideoLoading(false);
            resolve(video);
          };

          const handleError = () => {
            setVideoError((prev) => new Set(prev).add(videoKey));
            setVideoLoaded((prev) => {
              const newSet = new Set(prev);
              newSet.delete(videoKey);
              return newSet;
            });
            videoLoadingStates.delete(videoKey);
            setIsVideoLoading(false);
            reject(new Error('Video load failed'));
          };

          video.addEventListener('loadeddata', handleLoadedData, {
            once: true,
          });
          video.addEventListener('error', handleError, { once: true });

          video.src = fullVideoUrl;
          video.load();
        });
      } catch (error) {
        videoLoadingStates.delete(videoKey);
        setIsVideoLoading(false);
        throw error;
      }
    },
    []
  );

  // Setup video when agent is selected
  const setupVideo = useCallback(async () => {
    if (!currentVideoKey || !currentVideoUrl) {
      setShowVideo(false);
      setIsPlaying(false);
      return;
    }

    if (loadingControllerRef.current) {
      loadingControllerRef.current.abort();
    }

    loadingControllerRef.current = new AbortController();

    try {
      let video = videoCache.get(currentVideoKey);

      if (!video) {
        video = await preloadVideo(
          currentVideoUrl,
          currentVideoKey,
          loadingControllerRef.current.signal
        );
      }

      if (loadingControllerRef.current.signal.aborted) {
        return;
      }

      if (currentVideoRef.current && video) {
        currentVideoRef.current.src = video.src;
        currentVideoRef.current.muted = isMuted;
        currentVideoRef.current.playsInline = true;
        currentVideoRef.current.loop = true;

        // Auto-play video after setup
        setTimeout(() => {
          if (
            currentVideoRef.current &&
            !loadingControllerRef.current?.signal.aborted
          ) {
            currentVideoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                setShowVideo(true);
              })
              .catch((error) => {
                console.error('Error auto-playing video:', error);
              });
          }
        }, 300);
      }
    } catch (error: any) {
      if (error.message !== 'Aborted') {
        console.error('Error setting up video:', error);
        setVideoError((prev) => new Set(prev).add(currentVideoKey));
      }
    }
  }, [currentVideoKey, currentVideoUrl, isMuted, preloadVideo]);

  // Preload adjacent videos
  const preloadAdjacentVideos = useCallback(() => {
    const preloadAgent = (index: number) => {
      if (index >= 0 && index < agents.length) {
        const agent = agents[index];
        if (agent.meta.profileVideo) {
          const videoKey = `${agent.id}-${agent.meta.profileVideo}`;
          if (!videoCache.has(videoKey) && !videoLoadingStates.get(videoKey)) {
            preloadVideo(agent.meta.profileVideo, videoKey).catch(() => {
              // Ignore preload errors
            });
          }
        }
      }
    };

    // Preload previous and next videos
    preloadAgent(currentAgentIndex - 1);
    preloadAgent(currentAgentIndex + 1);
  }, [currentAgentIndex, agents, preloadVideo]);

  // Video controls
  const playVideo = useCallback(async () => {
    if (
      currentVideoRef.current &&
      currentVideoKey &&
      videoLoaded.has(currentVideoKey)
    ) {
      try {
        currentVideoRef.current.muted = isMuted;
        await currentVideoRef.current.play();
        setIsPlaying(true);
        setShowVideo(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setVideoError((prev) => new Set(prev).add(currentVideoKey));
      }
    }
  }, [currentVideoKey, videoLoaded, isMuted]);

  const pauseVideo = useCallback(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [isPlaying, playVideo, pauseVideo]);

  const toggleMute = useCallback(() => {
    if (currentVideoRef.current) {
      const newMutedState = !isMuted;
      currentVideoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  const handleLike = useCallback((agentId: number) => {
    setLiked((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(agentId)) {
        newLiked.delete(agentId);
      } else {
        newLiked.add(agentId);
      }
      return newLiked;
    });
  }, []);

  // Swiper event handlers
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    setCurrentAgentIndex(newIndex);
    setCurrentImageIndex(0);
    setShowVideo(false);
    setIsPlaying(false);

    // Reset transition state after slide change
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  // Mouse drag handlers for slide navigation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTransitioning) return;

    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragCurrentY(e.clientY);

    // Prevent default to avoid text selection
    e.preventDefault();
  }, [isTransitioning]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isTransitioning) return;

    setDragCurrentY(e.clientY);

    // Add visual feedback by changing cursor
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [isDragging, isTransitioning]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging || isTransitioning) return;

    const deltaY = e.clientY - dragStartY;
    const threshold = 80; // Minimum drag distance to trigger slide change

    // Reset cursor
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }

    // Determine slide direction based on drag distance
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Dragged down - go to previous slide
        goToPreviousAgent();
      } else {
        // Dragged up - go to next slide
        goToNextAgent();
      }
    }

    // Reset drag state
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  }, [isDragging, isTransitioning, dragStartY, goToPreviousAgent, goToNextAgent]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      // Reset drag state if mouse leaves the container
      setIsDragging(false);
      setDragStartY(0);
      setDragCurrentY(0);

      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging]);

  // Handle screen resolution changes
  useEffect(() => {
    // Check if screen type changed (mobile <-> desktop)
    if (prevIsMobileRef.current !== isMobile) {
      prevIsMobileRef.current = isMobile;

      // If switching to desktop, reset and reinitialize Swiper
      if (!isMobile) {
        // Force Swiper remount by changing key
        setSwiperKey(prev => prev + 1);

        // Reset states
        setCurrentImageIndex(0);
        setShowVideo(false);
        setIsPlaying(false);
        setIsTransitioning(false);

        // Small delay to ensure proper remounting
        setTimeout(() => {
          if (swiperRef.current && currentAgentIndex > 0) {
            // Slide to current index without animation first
            swiperRef.current.slideTo(currentAgentIndex, 0);
          }
        }, 100);
      }
    }
  }, [isMobile, currentAgentIndex]);

  // Sync Swiper with currentAgentIndex when Swiper is ready
  useEffect(() => {
    if (swiperRef.current && !isMobile && !isTransitioning) {
      const swiperActiveIndex = swiperRef.current.activeIndex;
      if (swiperActiveIndex !== currentAgentIndex) {
        swiperRef.current.slideTo(currentAgentIndex, 0);
      }
    }
  }, [swiperKey, currentAgentIndex, isMobile, isTransitioning]);

  // Effects with scroll accumulator reset on agent change
  useEffect(() => {
    if (selectedAgent && !isTransitioning) {
      setCurrentImageIndex(0);
      setShowVideo(false);
      setIsPlaying(false);
      setupVideo();
    }

    // Preload adjacent videos
    const preloadTimer = setTimeout(preloadAdjacentVideos, 1000);

    return () => {
      clearTimeout(preloadTimer);
    };
  }, [selectedAgent, setupVideo, preloadAdjacentVideos, isTransitioning]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (loadingControllerRef.current) {
        loadingControllerRef.current.abort();
      }
    };
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (e.shiftKey) {
            goToPreviousAgent();
          } else if (currentImages.length > 1 && currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
          }
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            goToNextAgent();
          } else if (
            currentImages.length > 1 &&
            currentImageIndex < currentImages.length - 1
          ) {
            setCurrentImageIndex((prev) => prev + 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          goToPreviousAgent();
          break;
        case 'ArrowDown':
          e.preventDefault();
          goToNextAgent();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentImages.length,
    currentImageIndex,
    goToPreviousAgent,
    goToNextAgent,
    togglePlayPause,
    isTransitioning,
  ]);

  // Mouse event listeners for drag functionality
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Add mouse event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseUp, handleMouseLeave]);

  // Animation variants for smooth transitions
  const contentVariants = {
    enter: {
      opacity: 0,
      y: 20,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  if (!selectedAgent) return null;

  // Return mobile version if on mobile device
  if (isMobile) {
    return <AgentCard agents={agents} />;
  }

  return (
    <div className="text-white h-screen overflow-hidden">
      {/* Main Content */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="relative h-full select-none"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        {/* Swiper Container */}
        <Swiper
          key={swiperKey} // Force remount on resolution change
          modules={[Controller, Mousewheel, Keyboard, EffectFade]}
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          speed={600}
          initialSlide={currentAgentIndex}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 50,
            thresholdTime: 500,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          allowTouchMove={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Ensure we're on the correct slide after initialization
            if (currentAgentIndex > 0) {
              setTimeout(() => {
                swiper.slideTo(currentAgentIndex, 0);
              }, 50);
            }
          }}
          onSlideChange={handleSlideChange}
          onTransitionStart={handleTransitionStart}
          className="h-full"
        >
          {agents.map((agent, index) => {
            return(
              <SwiperSlide key={agent.id} className="h-[80%]">
                <div className="max-w-7xl mx-auto px-6 h-[80%] flex items-center">
                  <div className="w-full flex gap-5 h-full">
                    {/* Navigation Column */}
                    <div className="col-span-1 flex flex-col items-center justify-center space-y-6">
                      {/* Previous Agent Button */}
                      <AnimatePresence>
                        {currentAgentIndex > 0 && (
                          <motion.button
                            key="prev-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={goToPreviousAgent}
                            className="p-4 rounded-full bg-black/70 backdrop-blur-sm border border-gray-700 hover:bg-black/80 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t.actions?.previousAgent || 'Previous Agent'}
                          >
                            <ChevronUp
                              size={20}
                              className="text-white group-hover:text-pink-400 transition-colors"
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Agent Index Indicator */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-white/60 text-sm font-medium">
                          {currentAgentIndex + 1}
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="text-white/40 text-xs">
                          {agents.length}
                        </div>
                      </div>

                      {/* Next Agent Button */}
                      <AnimatePresence>
                        {currentAgentIndex < agents.length - 1 && (
                          <motion.button
                            key="next-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={goToNextAgent}
                            className="p-4 rounded-full bg-black/70 backdrop-blur-sm border border-gray-700 hover:bg-black/80 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t.actions?.nextAgent || 'Next Agent'}
                          >
                            <ChevronDown
                              size={20}
                              className="text-white group-hover:text-pink-400 transition-colors"
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Media Section */}
                    <div className="flex-2 w-[50%] col-span-8 relative bg-black rounded-2xl overflow-hidden">
                      <AnimatePresence mode="wait">
                        {index === currentAgentIndex && (
                          <motion.div
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={contentVariants}
                            transition={{
                              duration: 0.6,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className="relative w-full h-full"
                          >
                            {/* Image Display */}
                            {currentImages[currentImageIndex] && (
                              <motion.img
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                src={currentImages[currentImageIndex]}
                                alt={agent.name}
                                className="w-full h-full object-cover"
                              />
                            )}

                            {/* Video Overlay */}
                            {currentVideoUrl && !videoError.has(currentVideoKey || '') && (
                              <div
                                className={`absolute inset-0 transition-opacity duration-500 ${showVideo && isPlaying ? 'opacity-100' : 'opacity-0'}`}
                              >
                                <video
                                  ref={currentVideoRef}
                                  className="w-full h-full object-cover"
                                  playsInline
                                  muted={isMuted}
                                  loop
                                  onPlay={() => setIsPlaying(true)}
                                  onPause={() => setIsPlaying(false)}
                                />
                              </div>
                            )}

                            {/* Gradient Overlays */}
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40" />

                            {/* Media Controls */}
                            <motion.div
                              initial="enter"
                              animate="center"
                              exit="exit"
                              variants={contentVariants}
                              transition={{ delay: 0.3, duration: 0.3 }}
                              className="absolute top-6 right-6 flex items-center space-x-3 z-20"
                            >
                              {currentVideoUrl && !videoError.has(currentVideoKey || '') && (
                                <div className="flex items-center space-x-2">
                                  <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    onClick={togglePlayPause}
                                    className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all"
                                    aria-label={
                                      isPlaying
                                        ? t.actions?.pauseVideo || 'Pause Video'
                                        : t.actions?.playVideo || 'Play Video'
                                    }
                                  >
                                    {isPlaying ? (
                                      <Pause size={20} className="text-white" />
                                    ) : (
                                      <Play size={20} className="text-white ml-1" />
                                    )}
                                  </motion.button>

                                  {isPlaying && (
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={toggleMute}
                                      className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all"
                                      aria-label={
                                        isMuted
                                          ? t.actions?.unmuteVideo || 'Unmute Video'
                                          : t.actions?.muteVideo || 'Mute Video'
                                      }
                                    >
                                      {isMuted ? (
                                        <VolumeX size={20} className="text-white" />
                                      ) : (
                                        <Volume2 size={20} className="text-white" />
                                      )}
                                    </motion.button>
                                  )}
                                </div>
                              )}

                            </motion.div>

                            {/* Image Navigation */}
                            {currentImages.length > 1 && (
                              <motion.div
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={contentVariants}
                                transition={{ delay: 0.3, duration: 0.3 }}
                              >
                                <div
                                  className="absolute top-6 left-6 flex space-x-2 z-20"
                                  aria-label={t.labels?.imageNavigation || 'Image Navigation'}
                                >
                                  {currentImages.map((_, imageIndex) => (
                                    <button
                                      key={imageIndex}
                                      onClick={() => setCurrentImageIndex(imageIndex)}
                                      className={`w-10 h-1 rounded-full transition-all ${
                                        imageIndex === currentImageIndex
                                          ? 'bg-white'
                                          : 'bg-white/30 hover:bg-white/50'
                                      }`}
                                      aria-label={`${t.labels?.imageNavigation || 'Image'} ${imageIndex + 1}`}
                                    />
                                  ))}
                                </div>

                                {currentImageIndex > 0 && (
                                  <button
                                    onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                                    className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all"
                                    aria-label={t.actions?.previousImage || 'Previous Image'}
                                  >
                                    <ChevronLeft
                                      size={20}
                                      className="text-white"
                                    />
                                  </button>
                                )}

                                {currentImageIndex < currentImages.length - 1 && (
                                  <button
                                    onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all"
                                    aria-label={t.actions?.nextImage || 'Next Image'}
                                  >
                                    <ChevronRight
                                      size={20}
                                      className="text-white"
                                    />
                                  </button>
                                )}
                              </motion.div>
                            )}

                            {/* Bottom Info Overlay */}
                            <motion.div
                              initial="enter"
                              animate="center"
                              exit="exit"
                              variants={contentVariants}
                              transition={{ delay: 0.4, duration: 0.3 }}
                              className="absolute bottom-0 left-0 right-0 p-8 z-20 md:p-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <h1 className="text-4xl font-bold text-white mb-2">
                                    {agent.name}
                                  </h1>
                                  <div className="flex items-center text-white/80 flex-wrap gap-2">
                                    <div className="flex items-center space-x-1">
                                      <Calendar size={16} />
                                      <span>
                                      {getAgeText(agent.meta.age, locale)}
                                    </span>
                                    </div>
                                    <span>•</span>
                                    <span>{agent.meta.occupation}</span>
                                    <span>•</span>
                                    <span>{agent.meta.gender}</span>
                                    {agent.meta.location && (
                                      <>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1">
                                          <MapPin size={16} />
                                          <span>{agent.meta.location}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-4">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      router.push(`/${locale}/chat/${agent.id}`)
                                    }
                                    className="md:text-sm md:px-5 lg:px-8 lg:text-[16px] py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-pink-500/25 "
                                  >
                                    <MessageCircle size={18} className="inline mr-2" />
                                    {t.actions?.startChat || 'Chat with me'}
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      router.push(`/${locale}/character/${agent.id}`)
                                    }
                                    className="md:text-sm md:px-5 lg:px-6 lg:text-[16px]  py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-200  "
                                  >
                                    <User size={18} className="inline mr-2" />
                                    {t.actions?.viewProfile || 'View full profile'}
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Info Panel */}
                    <div className="flex-1 col-span-5 bg-black/30 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
                      <div className="p-6 h-full overflow-y-auto">
                        <AnimatePresence mode="wait">
                          {index === currentAgentIndex && (
                            <motion.div
                              initial="enter"
                              animate="center"
                              exit="exit"
                              variants={contentVariants}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              className="space-y-6"
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={agent.meta.profileImage}
                                    alt={agent.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                                  />
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {agent.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                      <span className="text-sm text-green-400">
                                      {t.common?.online || 'Online'}
                                    </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              {agent.description && (
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Sparkles size={16} className="text-pink-400 mr-2" />
                                    {t.common?.about || 'About'}
                                  </h4>
                                  <p className="text-white/80 leading-relaxed">
                                    {agent.description}
                                  </p>
                                </div>
                              )}

                              {/* Details */}
                              <div className="space-y-4">
                                <h4 className="text-white font-semibold">
                                  {t.common?.details || 'Details'}
                                </h4>

                                <div className="space-y-3">
                                  {agent.meta.occupation && (
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        <span className="text-sm">💼</span>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-sm">
                                          {t.labels?.occupation || 'Occupation'}
                                        </p>
                                        <p className="text-white">
                                          {agent.meta.occupation}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                      <Calendar size={14} className="text-pink-400" />
                                    </div>
                                    <div>
                                      <p className="text-white/60 text-sm">
                                        {t.labels?.age || 'Age'}
                                      </p>
                                      <p className="text-white">
                                        {getAgeText(agent.meta.age, locale)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                      <span className="text-sm">⚧</span>
                                    </div>
                                    <div>
                                      <p className="text-white/60 text-sm">
                                        {t.labels?.gender || 'Gender'}
                                      </p>
                                      <p className="text-white capitalize">
                                        {agent.meta.gender}
                                      </p>
                                    </div>
                                  </div>

                                  {agent.meta.location && (
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <MapPin size={14} className="text-green-400" />
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-sm">
                                          {t.labels?.location || 'Location'}
                                        </p>
                                        <p className="text-white">
                                          {agent.meta.location}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Loading indicator */}
                              {isVideoLoading && (
                                <div className="flex items-center justify-center p-4">
                                  <div className="flex items-center space-x-2 text-white/60">
                                    <div
                                      className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                    <span>{t.common?.loading || 'Loading'}</span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        {/* Drag Indicator */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-600">
                <div className="flex items-center space-x-2 text-white/80">
                  <span className="text-sm">
                    {dragCurrentY - dragStartY > 0 ? '↓ Previous' : '↑ Next'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}