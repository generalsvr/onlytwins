'use client';
import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import FullScreenFeed from '@/components/full-screen-feed';
import { useRouter } from 'next/navigation';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useAgents } from '@/lib/hooks/useAgents';
import { useAuthStore } from '@/lib/stores/authStore';
import Button from '@/components/button';
import { RotateCcw } from 'lucide-react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden animate-custom-pulse">
      <div className="relative aspect-[3/4] bg-zinc-800"></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/6"></div>
        </div>
        <div className="h-4 bg-zinc-700 rounded w-3/4 mt-2"></div>
        <div className="h-4 bg-zinc-700 rounded w-1/2 mt-2"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-zinc-700 rounded w-1/4"></div>
          <div className="h-6 bg-zinc-700 rounded w-6"></div>
        </div>
      </div>
    </div>
  );
};

export default function FeedPage() {
  const videoRefs: MutableRefObject<(HTMLVideoElement | null)[]> = useRef([]);
  const { isAuthenticated } = useAuthStore((state) => state);
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const { data: agents, isLoading, refetch } = useAgents(!isAuthenticated);

  // Инициализация массива refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, agents?.length || 0);
  }, [agents]);

  const handleMouseEnter = (index: number) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const handleMouseLeave = (index: number) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
    }
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <SkeletonCard key={index} />
          ))}
      </div>
    );
  const loading = isLoading;

  return (
    <div className="relative h-screen w-full">
      {isMobile ? (
        // Mobile view - Full screen feed with no header padding
        <FullScreenFeed characters={agents} />
      ) : (
        // Desktop view - Grid layout
        <div>
          <h1 className="text-3xl font-bold mb-8">
            Discover{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              AI Companions
            </span>
          </h1>
          {!loading && !agents && (
            <div
              className={
                'flex flex-col items-center justify-center w-full mt-20'
              }
            >
              <p className={'text-xl font-normal'}>Something went wrong ...</p>
              <Button
                className={'mt-3'}
                icon={<RotateCcw />}
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array(8)
                  .fill(null)
                  .map((_, index) => <SkeletonCard key={index} />)
              : agents &&
                agents.map((character, index) => (
                  <div
                    key={character.id}
                    className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/character/${character.id}`);
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <div className="relative aspect-[3/4]">
                      <div className="w-full h-full relative">
                        <video
                          ref={(el: HTMLVideoElement | null) => {
                            videoRefs.current[index] = el;
                          }}
                          poster={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
                          className="w-full h-full object-cover hide-play-button"
                          playsInline
                          muted
                          loop
                          controls={false}
                        >
                          <source
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileVideo}`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>

                    <div className="p-4 absolute w-full bottom-0 h-[130px] z-20 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                      <div className="flex gap-4 items-baseline mb-1">
                        <h3 className="text-2xl font-bold uppercase ">
                          {character.name}
                        </h3>
                        <span className="text-2xl font-bold">
                          {character.meta.age}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm">
                        {character.description}
                      </p>
                    </div>
                    {/*<div className="gradient-blur absolute bottom-0 h-[40%] mt-auto w-full pointer-events-none">*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*  <div className="absolute inset-0"></div>*/}
                    {/*</div>*/}
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
