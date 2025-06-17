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
  Info
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/safe-image';
import { AgentResponse } from '@/lib/types/agents';



interface AgentCardProps {
  agents: AgentResponse[];
}

export default function AgentCard({ agents }: AgentCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const router = useRouter();

  const y = useMotionValue(0);
  const opacity = useTransform(y, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(y, [-200, 0, 200], [0.9, 1, 0.9]);

  // Memoized current agent to prevent unnecessary re-renders
  const currentAgent = useMemo(() => agents[currentIndex], [agents, currentIndex]);

  // Mock multiple images for demo (in real app, get from publicContent or similar)
  const currentImages = useMemo(() => {
    const images = [currentAgent?.meta.profileImage];
    // Add more images from publicContent if available
    if (currentAgent?.meta.publicContent) {
      images.push(...currentAgent.meta.publicContent.filter(item => item.type === 'image'));
    }
    return images.filter(Boolean);
  }, [currentAgent]);

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

  if (!currentAgent) return null;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden h-[calc(100vh-64px)] ">
      <motion.div
        className="relative w-full h-full"
        style={{ y, opacity, scale }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onPanEnd={handlePanEnd}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentImages[currentImageIndex]}`}
            alt={currentAgent.name}
            className="object-cover w-full h-full"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        {/* Image indicators */}
        {currentImages.length > 1 && (
          <div className="absolute top-16 left-4 right-4 flex space-x-1 z-20">
            {currentImages.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/30'
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
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
            >
              <Info size={20} className="text-white" />
            </button>
          </div>
        </div>

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
                  <span className="text-white font-medium">About {currentAgent.name}</span>
                </div>

                {currentAgent.meta.occupation && (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-sm">💼</span>
                    <span className="text-white/80 text-sm">{currentAgent.meta.occupation}</span>
                  </div>
                )}

                {currentAgent.meta.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-white/60" />
                    <span className="text-white/80 text-sm">{currentAgent.meta.location}</span>
                  </div>
                )}

                {currentAgent.meta.likes && (
                  <div>
                    <span className="text-pink-400 text-sm font-medium">Likes: </span>
                    <span className="text-white/80 text-sm">{currentAgent.meta.likes}</span>
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
                    <span className="text-white/80 text-sm">{currentAgent.meta.age} years old</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-white/80 text-sm">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key traits */}
            {currentAgent.meta.keyTraits && (
              <div className="flex flex-wrap gap-2">
                {currentAgent.meta.keyTraits.split(',').slice(0, 3).map((trait, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                  >
                    <span className="text-white text-xs font-medium">{trait.trim()}</span>
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
        </div>

        {/* Right Side Actions */}
        {/*<div className="absolute right-4 bottom-32 space-y-6 z-30">*/}
        {/*  /!* Like Button *!/*/}
        {/*  <motion.button*/}
        {/*    whileTap={{ scale: 0.8 }}*/}
        {/*    onClick={() => handleLike(currentAgent.id)}*/}
        {/*    className="flex flex-col items-center space-y-1"*/}
        {/*  >*/}
        {/*    <div className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-200 ${*/}
        {/*      liked.has(currentAgent.id)*/}
        {/*        ? 'bg-pink-500/80 border-pink-400/50 shadow-lg shadow-pink-500/25'*/}
        {/*        : 'bg-black/30 border-white/20 hover:bg-black/50'*/}
        {/*    }`}>*/}
        {/*      <Heart*/}
        {/*        size={24}*/}
        {/*        className={`transition-colors ${*/}
        {/*          liked.has(currentAgent.id) ? 'text-white fill-current' : 'text-white'*/}
        {/*        }`}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <span className="text-white text-xs font-medium">*/}
        {/*      {liked.has(currentAgent.id) ? 'Liked' : 'Like'}*/}
        {/*    </span>*/}
        {/*  </motion.button>*/}

        {/*  /!* Share Button *!/*/}
        {/*  <motion.button*/}
        {/*    whileTap={{ scale: 0.8 }}*/}
        {/*    className="flex flex-col items-center space-y-1"*/}
        {/*  >*/}
        {/*    <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-colors">*/}
        {/*      <Share size={24} className="text-white" />*/}
        {/*    </div>*/}
        {/*    <span className="text-white text-xs font-medium">Share</span>*/}
        {/*  </motion.button>*/}
        {/*</div>*/}

        {/* Chat Button */}
        {/*<div className="absolute bottom-6 left-6 right-20 z-30">*/}
        {/*  <motion.button*/}
        {/*    whileTap={{ scale: 0.95 }}*/}
        {/*    onClick={handleChatPress}*/}
        {/*    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 py-4 rounded-2xl shadow-2xl shadow-pink-500/25 backdrop-blur-sm border border-pink-400/30"*/}
        {/*  >*/}
        {/*    <MessageCircle size={24} className="text-white" />*/}
        {/*    <span className="text-white font-semibold text-lg">Start Chat</span>*/}
        {/*  </motion.button>*/}
        {/*</div>*/}

        {/* Image Navigation Arrows (when multiple images) */}
        {currentImages.length > 1 && (
          <>
            <AnimatePresence>
              {currentImageIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCurrentImageIndex(prev => prev - 1)}
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
                  onClick={() => setCurrentImageIndex(prev => prev + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 z-20"
                >
                  <ChevronRight size={24} className="text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Progress indicator */}
        {/*<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-30">*/}
        {/*  {agents.map((_, index) => (*/}
        {/*    <div*/}
        {/*      key={index}*/}
        {/*      className={`w-2 h-2 rounded-full transition-all duration-300 ${*/}
        {/*        index === currentIndex*/}
        {/*          ? 'bg-white'*/}
        {/*          : index < currentIndex*/}
        {/*            ? 'bg-white/60'*/}
        {/*            : 'bg-white/20'*/}
        {/*      }`}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</div>*/}
      </motion.div>

      {/* Swipe hints */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 opacity-30">
        <div className="text-white text-xs text-center">
          <div className="mb-1">↑ Next</div>
          <div>↓ Previous</div>
        </div>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 opacity-30">
        <div className="text-white text-xs text-center">
          <div className="mb-1">← → Photos</div>
        </div>
      </div>
    </div>
  );
}