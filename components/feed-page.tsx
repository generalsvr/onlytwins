'use client';
import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useAuthStore } from '@/lib/stores/authStore';
import Button from '@/components/button';
import { RotateCcw } from 'lucide-react';
import { AgentResponse } from '@/lib/types/agents';
import { useLocale } from '@/contexts/LanguageContext';

interface FeedPageProps {
  agents: AgentResponse[] | null;
}

export default function ExplorePage({ agents }: FeedPageProps) {
  const videoRefs: MutableRefObject<(HTMLVideoElement | null)[]> = useRef([]);
  const router = useRouter();
  const { locale } = useLocale();
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, agents?.length || 0);
  }, [agents]);

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play().catch(error => {
        console.warn('Video play failed:', error);
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
      if(isSafari){
        video.load();
      }
    }
  };

  // Touch handlers для мобильных устройств
  const handleTouchStart = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play().catch(error => {
        console.warn('Video play failed on touch:', error);
      });
    }
  };

  const handleTouchEnd = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
      if(isSafari){
        video.load();
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
          Discover{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            AI Companions
          </span>
        </h1>

        {!agents && (
          <div className="flex flex-col items-center justify-center w-full mt-12 sm:mt-20 px-4">
            <p className="text-lg sm:text-xl font-normal text-center">
              Something went wrong ...
            </p>
            <Button
              className="mt-3"
              icon={<RotateCcw />}
              // onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Mobile: 1 column, SM: 2 columns, LG: 3 columns, XL: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {agents &&
            agents.map((character, index) => (
              <div
                key={character.id}
                className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/${locale}/character/${character.id}`);
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
              >
                <div className="relative aspect-[3/4]">
                  <div className="w-full h-full relative">
                    <video
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current[index] = el;
                      }}
                      poster={`${character.meta.profileImage}`}
                      className="w-full h-full object-cover hide-play-button"
                      playsInline
                      muted
                      loop
                      controls={false}
                      preload="none"
                      onError={(e) => console.warn('Video error:', e)}
                    >
                      <source
                        src={`${character.meta.profileVideo}`}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>

                <div className="p-3 sm:p-4 absolute w-full bottom-0 h-[100px] sm:h-[130px] z-20 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                  <div className="flex gap-2 sm:gap-4 items-baseline mb-1">
                    <h3 className="text-lg sm:text-2xl font-bold uppercase truncate">
                      {character.name}
                    </h3>
                    <span className="text-lg sm:text-2xl font-bold flex-shrink-0">
                      {character.meta.age}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                    {character.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}