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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AgentResponse } from '@/lib/types/agents';
import useWindowSize from '@/lib/hooks/useWindowSize';
import AgentCard from '@/components/full-screen-feed';

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
  const { isMobile } = useWindowSize();

  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const loadingControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

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

  // Navigation functions
  const goToPreviousAgent = useCallback(() => {
    if (currentAgentIndex > 0) {
      setCurrentAgentIndex((prev) => prev - 1);
      setCurrentImageIndex(0);
    }
  }, [currentAgentIndex]);

  const goToNextAgent = useCallback(() => {
    if (currentAgentIndex < agents.length - 1) {
      setCurrentAgentIndex((prev) => prev + 1);
      setCurrentImageIndex(0);
    }
  }, [currentAgentIndex, agents.length]);

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

        const fullVideoUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${videoUrl}`;

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
    } catch (error) {
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

  useEffect(() => {
    if (selectedAgent) {
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
  }, [selectedAgent, setupVideo, preloadAdjacentVideos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingControllerRef.current) {
        loadingControllerRef.current.abort();
      }
    };
  }, []);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (e.shiftKey) {
            // Shift + Left = Previous agent
            goToPreviousAgent();
          } else if (currentImages.length > 1 && currentImageIndex > 0) {
            // Left = Previous image
            setCurrentImageIndex((prev) => prev - 1);
          }
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            // Shift + Right = Next agent
            goToNextAgent();
          } else if (
            currentImages.length > 1 &&
            currentImageIndex < currentImages.length - 1
          ) {
            // Right = Next image
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
  ]);

  if (!selectedAgent) return null;
  if (isMobile) {
    return <AgentCard agents={agents} />;
  }
  return (
    <div className="h-max mx-auto max-w-5xl relative">
      {/* Agent Navigation Arrows - Outside the main content */}
      <AnimatePresence>
        {currentAgentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousAgent}
            className="absolute -left-40 top-1/2 transform -translate-y-1/2 z-50 p-4 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/80 transition-all group"
          >
            <ChevronLeft
              size={32}
              className="text-white group-hover:text-pink-400 transition-colors"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentAgentIndex < agents.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextAgent}
            className="absolute -right-40 top-1/2 transform -translate-y-1/2 z-50 p-4 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/80 transition-all group"
          >
            <ChevronRight
              size={32}
              className="text-white group-hover:text-pink-400 transition-colors"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Center Panel - Media Section */}
        <div className="flex-1 relative bg-black h-max ">
          {/* Image/Video Display */}
          <div className="relative  h-[calc(100vh-200px)] ">
            {/* Always show image first */}
            {currentImages[currentImageIndex] && (
              <motion.img
                key={`${selectedAgent.id}-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentImages[currentImageIndex]}`}
                alt={selectedAgent.name}
                className="object-cover w-full h-full rounded-xl "
              />
            )}

            {/* Video overlay */}
            {currentVideoUrl && !videoError.has(currentVideoKey || '') && (
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  showVideo && isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
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

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          {/* Media Controls */}
          <div className="absolute top-6 right-6 flex items-center space-x-3 z-20">
            {/* Video Controls */}
            {currentVideoUrl && !videoError.has(currentVideoKey || '') && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={togglePlayPause}
                  className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-white" />
                  ) : (
                    <Play size={20} className="text-white" />
                  )}
                </motion.button>

                {isPlaying && (
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"
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

            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => handleLike(selectedAgent.id)}
              className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"
            >
              <Heart
                size={20}
                className={`transition-colors ${
                  liked.has(selectedAgent.id)
                    ? 'text-pink-500 fill-pink-500'
                    : 'text-white'
                }`}
              />
            </motion.button>
          </div>

          {/* Image Navigation - Only for images */}
          {currentImages.length > 1 && (
            <>
              <div className="absolute top-6 left-6 flex space-x-1 z-20">
                {currentImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>

              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                  className="absolute left-6 bottom-1/3 transform translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 z-20 hover:bg-black/70 transition-all"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
              )}

              {currentImageIndex < currentImages.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                  className="absolute right-6 bottom-1/3 transform translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 z-20 hover:bg-black/70 transition-all"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              )}
            </>
          )}

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <motion.h1
                    key={selectedAgent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    {selectedAgent.name}
                  </motion.h1>
                  <div className="flex items-center space-x-4 text-white/80">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{selectedAgent.meta.age} years old</span>
                    </div>
                    {selectedAgent.meta.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{selectedAgent.meta.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/chat/${selectedAgent.id}`)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                >
                  <MessageCircle size={18} className="inline mr-2" />
                  Start Chat
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/character/${selectedAgent.id}`)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-200"
                >
                  <User size={18} className="inline mr-2" />
                  View Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all duration-200"
                >
                  <Share size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Info Panel */}
        <div className="w-96 bg-black/50 backdrop-blur-xl border-l border-white/10 overflow-y-auto ml-5">
          <div className="p-6 space-y-6 max-h-[100%] overflow-scroll">
            {/* Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">Online now</span>
            </div>

            {/* Description */}
            {selectedAgent.description && (
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Sparkles size={16} className="text-pink-400 mr-2" />
                  About
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {selectedAgent.description}
                </p>
              </motion.div>
            )}

            {/* Details */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Details</h3>

              {selectedAgent.meta.occupation && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <span className="text-sm">💼</span>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Occupation</p>
                    <p className="text-white">
                      {selectedAgent.meta.occupation}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Calendar size={14} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Age</p>
                  <p className="text-white">
                    {selectedAgent.meta.age} years old
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm">⚧</span>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Gender</p>
                  <p className="text-white capitalize">
                    {selectedAgent.meta.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Public Content */}
            {selectedAgent.meta.publicContent &&
              selectedAgent.meta.publicContent.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAgent.meta.publicContent
                      .filter((item) => item.mimeType?.startsWith('image/'))
                      .slice(0, 6)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const imageIndex = currentImages.findIndex(
                              (img) => img === item.url
                            );
                            if (imageIndex !== -1) {
                              setCurrentImageIndex(imageIndex);
                            }
                          }}
                        >
                          <img
                            src={`${item.url}`}
                            alt={`${selectedAgent.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Stats */}
            {/*<div className="border-t border-white/10 pt-6">*/}
            {/*  <h3 className="text-white font-semibold mb-4">Stats</h3>*/}
            {/*  <div className="space-y-3">*/}
            {/*    <div className="flex justify-between items-center">*/}
            {/*      <span className="text-white/60">Profile Views</span>*/}
            {/*      <span className="text-white font-medium">*/}
            {/*        {Math.floor(Math.random() * 1000) + 500}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*    <div className="flex justify-between items-center">*/}
            {/*      <span className="text-white/60">Likes</span>*/}
            {/*      <span className="text-white font-medium">*/}
            {/*        {Math.floor(Math.random() * 500) + 100}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*    <div className="flex justify-between items-center">*/}
            {/*      <span className="text-white/60">Response Rate</span>*/}
            {/*      <span className="text-green-400 font-medium">98%</span>*/}
            {/*    </div>*/}
            {/*    <div className="flex justify-between items-center">*/}
            {/*      <span className="text-white/60">Joined</span>*/}
            {/*      <span className="text-white font-medium">*/}
            {/*        {new Date(selectedAgent.createdAt).toLocaleDateString(*/}
            {/*          'en-US',*/}
            {/*          {*/}
            {/*            month: 'short',*/}
            {/*            year: 'numeric',*/}
            {/*          }*/}
            {/*        )}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Action Buttons - Sticky */}
          </div>
        </div>
      </div>
    </div>
  );
}
