'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  MessageCircle,
  Heart,
  Share,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Info,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/safe-image';
import { AgentResponse } from '@/lib/types/agents';

interface AgentCardProps {
  agents: AgentResponse[];
}

// Video cache to store loaded videos
const videoCache = new Map<string, HTMLVideoElement>();
const videoLoadingStates = new Map<string, boolean>();

export default function AgentCard({ agents }: AgentCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<Set<string>>(new Set());
  const [videoLoaded, setVideoLoaded] = useState<Set<string>>(new Set());
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const loadingControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const y = useMotionValue(0);
  const opacity = useTransform(y, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(y, [-200, 0, 200], [0.9, 1, 0.9]);

  // Memoized current agent to prevent unnecessary re-renders
  const currentAgent = useMemo(() => agents[currentIndex], [agents, currentIndex]);

  // Get only images for navigation
  const currentImages = useMemo(() => {
    const images = [];

    // Add profile image
    if (currentAgent?.meta.profileImage) {
      images.push(currentAgent.meta.profileImage);
    }

    // Add images from public content
    if (currentAgent?.meta.publicContent) {
      currentAgent.meta.publicContent.forEach(item => {
        if (item.type === 'image' || (typeof item === 'string' && !item.includes('.mp4'))) {
          images.push(item.url || item);
        }
      });
    }

    return images;
  }, [currentAgent]);

  // Check if current agent has video and get video URL
  const currentVideoUrl = useMemo(() => {
    return currentAgent?.meta.profileVideo || null;
  }, [currentAgent]);

  const currentVideoKey = useMemo(() => {
    return currentVideoUrl ? `${currentAgent.id}-${currentVideoUrl}` : null;
  }, [currentAgent?.id, currentVideoUrl]);

  // Preload video function
  const preloadVideo = useCallback(async (videoUrl: string, videoKey: string, signal?: AbortSignal) => {
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

      const fullVideoUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${videoUrl}`;

      return new Promise<HTMLVideoElement>((resolve, reject) => {
        const handleLoadedData = () => {
          if (signal?.aborted) {
            reject(new Error('Aborted'));
            return;
          }

          videoCache.set(videoKey, video);
          setVideoLoaded(prev => new Set(prev).add(videoKey));
          setVideoError(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoKey);
            return newSet;
          });
          videoLoadingStates.delete(videoKey);
          setIsVideoLoading(false);
          resolve(video);
        };

        const handleError = () => {
          setVideoError(prev => new Set(prev).add(videoKey));
          setVideoLoaded(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoKey);
            return newSet;
          });
          videoLoadingStates.delete(videoKey);
          setIsVideoLoading(false);
          reject(new Error('Video load failed'));
        };

        const handleAbort = () => {
          videoLoadingStates.delete(videoKey);
          setIsVideoLoading(false);
          reject(new Error('Aborted'));
        };

        if (signal) {
          signal.addEventListener('abort', handleAbort);
        }

        video.addEventListener('loadeddata', handleLoadedData, { once: true });
        video.addEventListener('error', handleError, { once: true });

        video.src = fullVideoUrl;
        video.load();
      });
    } catch (error) {
      videoLoadingStates.delete(videoKey);
      setIsVideoLoading(false);
      throw error;
    }
  }, []);

  // Setup current video
  const setupCurrentVideo = useCallback(async () => {
    if (!currentVideoKey || !currentVideoUrl) {
      setShowVideo(false);
      setIsPlaying(false);
      return;
    }

    // Cancel previous loading
    if (loadingControllerRef.current) {
      loadingControllerRef.current.abort();
    }

    // Create new abort controller
    loadingControllerRef.current = new AbortController();

    try {
      let video = videoCache.get(currentVideoKey);

      if (!video) {
        video = await preloadVideo(currentVideoUrl, currentVideoKey, loadingControllerRef.current.signal);
      }

      if (loadingControllerRef.current.signal.aborted) {
        return;
      }

      if (currentVideoRef.current && video) {
        // Copy video element content to ref
        currentVideoRef.current.src = video.src;
        currentVideoRef.current.muted = isMuted;
        currentVideoRef.current.playsInline = true;
        currentVideoRef.current.loop = true;

        // Auto-play after setup
        setTimeout(() => {
          if (currentVideoRef.current && !loadingControllerRef.current?.signal.aborted) {
            currentVideoRef.current.play()
              .then(() => {
                setIsPlaying(true);
                setShowVideo(true);
              })
              .catch(error => {
                console.error('Error playing video:', error);
                setVideoError(prev => new Set(prev).add(currentVideoKey));
              });
          }
        }, 300);
      }
    } catch (error) {
      if (error.message !== 'Aborted') {
        console.error('Error setting up video:', error);
        setVideoError(prev => new Set(prev).add(currentVideoKey));
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
    preloadAgent(currentIndex - 1);
    preloadAgent(currentIndex + 1);
  }, [currentIndex, agents, preloadVideo]);

  // Setup video when agent changes
  useEffect(() => {
    setShowVideo(false);
    setIsPlaying(false);

    if (currentVideoKey) {
      setupCurrentVideo();
    }

    // Preload adjacent videos
    const preloadTimer = setTimeout(preloadAdjacentVideos, 1000);

    return () => {
      clearTimeout(preloadTimer);
    };
  }, [currentIndex, setupCurrentVideo, preloadAdjacentVideos, currentVideoKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingControllerRef.current) {
        loadingControllerRef.current.abort();
      }
    };
  }, []);

  // Video control functions
  const playVideo = useCallback(async () => {
    if (currentVideoRef.current && currentVideoKey && videoLoaded.has(currentVideoKey)) {
      try {
        currentVideoRef.current.muted = isMuted;
        await currentVideoRef.current.play();
        setIsPlaying(true);
        setShowVideo(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setVideoError(prev => new Set(prev).add(currentVideoKey));
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

  // Handle swipe functions
  const handleVerticalSwipe = useCallback((info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 && currentIndex > 0) {
        // Swipe down - previous agent
        setCurrentIndex(prev => prev - 1);
        setCurrentImageIndex(0);
      } else if (offset < 0 && currentIndex < agents.length - 1) {
        // Swipe up - next agent
        setCurrentIndex(prev => prev + 1);
        setCurrentImageIndex(0);
      }
    }
    y.set(0);
  }, [currentIndex, agents.length, y]);

  const handleHorizontalSwipe = useCallback((info: PanInfo) => {
    const threshold = 50;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold && currentImages.length > 1) {
      if (offset > 0 && currentImageIndex > 0) {
        // Swipe right - previous image
        setCurrentImageIndex(prev => prev - 1);
      } else if (offset < 0 && currentImageIndex < currentImages.length - 1) {
        // Swipe left - next image
        setCurrentImageIndex(prev => prev + 1);
      }
    }
  }, [currentImageIndex, currentImages.length]);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const isVertical = Math.abs(info.offset.y) > Math.abs(info.offset.x);

    if (isVertical) {
      handleVerticalSwipe(info);
    } else {
      handleHorizontalSwipe(info);
    }
  }, [handleVerticalSwipe, handleHorizontalSwipe]);

  const handleLike = useCallback((agentId: number) => {
    setLiked(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(agentId)) {
        newLiked.delete(agentId);
      } else {
        newLiked.add(agentId);
      }
      return newLiked;
    });
  }, []);

  const handleChatPress = useCallback(() => {
    router.push(`/chat/${currentAgent.id}`);
  }, [router, currentAgent.id]);

  // Video event handlers
  const handleVideoError = useCallback(() => {
    if (currentVideoKey) {
      setVideoError(prev => new Set(prev).add(currentVideoKey));
      setIsPlaying(false);
      setShowVideo(false);
    }
  }, [currentVideoKey]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    // Loop the video
    if (currentVideoRef.current) {
      currentVideoRef.current.currentTime = 0;
      playVideo();
    }
  }, [playVideo]);

  if (!currentAgent) return null;

  const hasVideo = !!currentVideoUrl;
  const isCurrentVideoLoaded = currentVideoKey ? videoLoaded.has(currentVideoKey) : false;
  const hasCurrentVideoError = currentVideoKey ? videoError.has(currentVideoKey) : false;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden h-[calc(100vh-64px)]">
      <motion.div
        className="relative w-full h-full"
        style={{ y, opacity, scale }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onPanEnd={handlePanEnd}
      >
        {/* Background Media */}
        <div className="absolute inset-0">
          {/* Always show image first */}
          <img
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentImages[currentImageIndex]}`}
            alt={currentAgent.name}
            className="object-cover w-full h-full"
          />

          {/* Video overlay - only show when video is ready and playing */}
          {hasVideo && !hasCurrentVideoError && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                showVideo && isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <video
                ref={currentVideoRef}
                className="object-cover w-full h-full"
                playsInline
                muted={isMuted}
                loop
                onError={handleVideoError}
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        {/* Image indicators - only for images */}
        {currentImages.length > 1 && (
          <div className="absolute top-16 left-4 right-4 flex space-x-1 z-20">
            {currentImages.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top UI */}
        <div className="absolute top-0 left-0 right-0 pt-12 px-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Online</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Video Controls - only show when video is available */}
              {hasVideo && !hasCurrentVideoError && (
                <div className="flex items-center space-x-2">
                  {/* Play/Pause Button */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={togglePlayPause}
                    disabled={!isCurrentVideoLoaded}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <Pause size={18} className="text-white" />
                    ) : (
                      <Play size={18} className="text-white" />
                    )}
                  </motion.button>

                  {/* Mute/Unmute Button - only show when video is playing */}
                  {/*{isPlaying && (*/}
                  {/*  <motion.button*/}
                  {/*    whileTap={{ scale: 0.8 }}*/}
                  {/*    onClick={toggleMute}*/}
                  {/*    className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"*/}
                  {/*  >*/}
                  {/*    {isMuted ? (*/}
                  {/*      <VolumeX size={18} className="text-white" />*/}
                  {/*    ) : (*/}
                  {/*      <Volume2 size={18} className="text-white" />*/}
                  {/*    )}*/}
                  {/*  </motion.button>*/}
                  {/*)}*/}
                </div>
              )}

              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
              >
                <Info size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/*/!* Video Loading Indicator *!/*/}
        {/*{hasVideo && (isVideoLoading || !isCurrentVideoLoaded) && !hasCurrentVideoError && (*/}
        {/*  <div className="absolute top-20 right-4 z-30">*/}
        {/*    <div className="flex items-center space-x-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">*/}
        {/*      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />*/}
        {/*      <span className="text-white text-xs">Loading video...</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* Video Error Indicator */}
        {hasVideo && hasCurrentVideoError && (
          <div className="absolute top-20 right-4 z-30">
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/50 backdrop-blur-sm rounded-full border border-red-400/20">
              <span className="text-white text-xs">Video unavailable</span>
            </div>
          </div>
        )}

        {/* Agent Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-2xl p-4 z-40 border border-white/10"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-pink-400" />
                  <span className="text-white font-medium">
                    About {currentAgent.name}
                  </span>
                </div>

                {currentAgent.meta.occupation && (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-sm">💼</span>
                    <span className="text-white/80 text-sm">
                      {currentAgent.meta.occupation}
                    </span>
                  </div>
                )}

                {currentAgent.meta.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-white/60" />
                    <span className="text-white/80 text-sm">
                      {currentAgent.meta.location}
                    </span>
                  </div>
                )}

                {currentAgent.meta.likes && (
                  <div>
                    <span className="text-pink-400 text-sm font-medium">
                      Likes:{' '}
                    </span>
                    <span className="text-white/80 text-sm">
                      {currentAgent.meta.likes}
                    </span>
                  </div>
                )}

                {currentAgent.description && (
                  <p className="text-white/70 text-sm leading-relaxed">
                    {currentAgent.description}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
          <div className="space-y-4 mb-4">
            {/* Name and Age */}
            <div className="flex items-end space-x-3">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {currentAgent.name}
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} className="text-white/60" />
                    <span className="text-white/80 text-sm">
                      {currentAgent.meta.age} years old
                    </span>
                  </div>

                  {/* Video indicator badge - only show when video is playing */}
                </div>
              </div>
            </div>

            {/* Key traits */}
            {currentAgent.meta.keyTraits && (
              <div className="flex flex-wrap gap-2">
                {currentAgent.meta.keyTraits
                  .split(',')
                  .slice(0, 3)
                  .map((trait, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                    >
                      <span className="text-white text-xs font-medium">
                        {trait.trim()}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Description */}
            {currentAgent.description && (
              <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                {currentAgent.description}
              </p>
            )}
          </div>
          <button onClick={() => router.push(`/character/${currentAgent.id}`)} className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25">
            View profile
          </button>
        </div>

        {/* Image Navigation Arrows - only for images */}
        {currentImages.length > 1 && (
          <>
            <AnimatePresence>
              {currentImageIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 z-20"
                >
                  <ChevronLeft size={24} className="text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentImageIndex < currentImages.length - 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 z-20"
                >
                  <ChevronRight size={24} className="text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Swipe hints */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 opacity-30">
          <div className="text-white text-xs text-center">
            <div className="mb-1">↑ Next</div>
            <div>↓ Previous</div>
          </div>
        </div>

        {currentImages.length > 1 && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 opacity-30">
            <div className="text-white text-xs text-center">
              <div className="mb-1">← → Photos</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

