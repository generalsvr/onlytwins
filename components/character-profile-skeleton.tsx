'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useWindowSize from '@/lib/hooks/useWindowSize';

const CharacterProfileSkeleton: React.FC = () => {
  const { isMobile } = useWindowSize();
  return (
    <div
      className={`pb-16 animate-custom-pulse ${isMobile ? '' : 'max-w-6xl mx-auto pt-20 px-8 flex gap-8'}`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="relative h-48">
          <div className="w-full h-full bg-zinc-800" />
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <button
              className="bg-black/50 rounded-full p-2 text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="bg-black/50 rounded-full p-2 text-white"
              aria-label="Share profile"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Left Column */}
      {!isMobile && (
        <div className="w-1/3 sticky top-24 self-start">
          <div className="mb-4 flex items-center">
            <ArrowLeft size={18} className="mr-2 text-zinc-400" />
            <div className="h-4 bg-zinc-700 rounded w-16" />
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <div className="w-full aspect-[4/5] bg-zinc-800" />
          </div>
          <div className="mt-6 space-y-4">
            <div className="w-full h-10 bg-zinc-700 rounded-lg" />
            <div className="w-full h-10 bg-zinc-700 rounded-lg" />
            <div className="w-full h-10 bg-zinc-700 rounded-lg" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? '' : 'w-2/3'}`}>
        {/* Profile Info */}
        <div className={`relative ${isMobile ? 'px-4 pb-4 -mt-16' : ''}`}>
          <div
            className={`flex ${isMobile ? 'justify-between' : 'items-center gap-4 mb-6'}`}
          >
            {isMobile ? (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-black" />
                <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-zinc-700 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800" />
                <div>
                  <div className="h-6 bg-zinc-700 rounded w-24 mb-2" />
                  <div className="h-4 bg-zinc-700 rounded w-16" />
                </div>
              </div>
            )}
            {isMobile && (
              <div className="flex space-x-2 mt-16">
                <div className="h-10 w-24 bg-zinc-700 rounded-full" />
                <div className="h-10 w-10 bg-zinc-700 rounded-full" />
                <div className="h-10 w-10 bg-zinc-700 rounded-full" />
              </div>
            )}
            {!isMobile && (
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="h-6 bg-zinc-700 rounded w-12 mx-auto mb-1" />
                  <div className="h-4 bg-zinc-700 rounded w-16 mx-auto" />
                </div>
                <div className="text-center">
                  <div className="h-6 bg-zinc-700 rounded w-12 mx-auto mb-1" />
                  <div className="h-4 bg-zinc-700 rounded w-16 mx-auto" />
                </div>
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="mt-4">
              <div className="h-6 bg-zinc-700 rounded w-24 mb-1" />
              <div className="h-4 bg-zinc-700 rounded w-16 mb-2" />
              <div className="h-4 bg-zinc-700 rounded w-3/4 mb-4" />

              <div className="flex space-x-4 mb-4">
                <div className="h-4 bg-zinc-700 rounded w-16" />
                <div className="h-4 bg-zinc-700 rounded w-16" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-6 bg-zinc-800 rounded-full px-3"
                    />
                  ))}
              </div>

              <div className="mb-4">
                <div className="h-5 bg-zinc-700 rounded w-24 mb-2" />
                <div className="h-4 bg-zinc-700 rounded w-full mb-1" />
                <div className="h-4 bg-zinc-700 rounded w-3/4 mb-1" />
                <div className="h-4 bg-zinc-700 rounded w-1/2" />
              </div>

              <div className="bg-zinc-900/80 rounded-xl p-4">
                <div className="h-5 bg-zinc-700 rounded w-40 mb-2" />
                <div className="flex items-center mb-2">
                  <div className="h-4 bg-zinc-700 rounded w-16 mr-2" />
                  <div className="h-4 bg-zinc-700 rounded w-12" />
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div className="bg-[#c2c96c] h-3 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="h-5 bg-zinc-700 rounded w-3/4 mb-4" />

              <div className="flex flex-wrap gap-2 mb-6">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-6 bg-zinc-800 rounded-full px-3"
                    />
                  ))}
              </div>

              <div className="mb-6">
                <div className="h-6 bg-zinc-700 rounded w-24 mb-2" />
                <div className="h-4 bg-zinc-700 rounded w-full mb-1" />
                <div className="h-4 bg-zinc-700 rounded w-3/4 mb-1" />
                <div className="h-4 bg-zinc-700 rounded w-1/2" />
              </div>

              <div className="bg-zinc-900/80 rounded-xl p-4 mb-6">
                <div className="h-6 bg-zinc-700 rounded w-40 mb-2" />
                <div className="flex items-center mb-2">
                  <div className="h-4 bg-zinc-700 rounded w-16 mr-2" />
                  <div className="h-4 bg-zinc-700 rounded w-12" />
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div className="bg-[#c2c96c] h-3 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="gallery" className={isMobile ? 'mt-4' : 'mt-8'}>
          <TabsList
            className={`w-full ${isMobile ? 'bg-zinc-900 border-b border-zinc-800' : 'bg-zinc-800 rounded-xl mb-6'}`}
          >
            <TabsTrigger value="gallery" className="flex-1">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex-1">
              Premium
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">
              Videos
            </TabsTrigger>
          </TabsList>
          <div className={isMobile ? 'p-4' : ''}>
            <div
              className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-4'}`}
            >
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`${isMobile ? 'aspect-square' : 'aspect-square rounded-xl overflow-hidden'}`}
                  >
                    <div className="w-full h-full bg-zinc-800" />
                  </div>
                ))}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CharacterProfileSkeleton;
