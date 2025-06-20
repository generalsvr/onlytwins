'use client';

import type React from 'react';

import { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SafeImage from './safe-image';
import { useRouter } from 'next/navigation';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useAuthStore } from '@/lib/stores/authStore';
import Image from 'next/image';
import { AgentResponse } from '@/lib/types/agents';

interface CharacterMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
}

interface PremiumContent {
  id: number;
  thumbnail: string;
  price: number;
  type: 'photo' | 'video';
}

interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon: React.ReactNode;
}

export interface CharacterProfileData {
  id: number;
  name: string;
  age: number;
  emoji: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  profileImage: string;
  verified: boolean;
  followers: string;
  posts: number;
  interests: string[];
  about: string;
  relationshipLevel: string;
  progress: number;
  media: CharacterMedia[];
  premiumContent?: PremiumContent[];
  socialLinks?: SocialLink[];
  agentId?: string;
}

interface CharacterProfileTemplateProps {
  character: AgentResponse | null;
}

export default function CharacterProfileTemplate({
  character,
}: CharacterProfileTemplateProps) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState(false);
  const [likedMedia, setLikedMedia] = useState<number[]>([]);
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { isAuthenticated } = useAuthStore();

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleOpenChat = () => {
    router.push(`/chat/${character.id}`);
  };

  const handleLike = (mediaIndex: number) => {
    if (!isAuthenticated) return;

    setLikedMedia((prev) => {
      if (prev.includes(mediaIndex)) {
        return prev.filter((id) => id !== mediaIndex);
      } else {
        return [...prev, mediaIndex];
      }
    });
  };

  const handleBuyContent = (contentId: number) => {
    if (!isAuthenticated) return;
    alert(`Buying content ${contentId}`);
  };

  const handleVoiceCallClick = () => {
    if (!isAuthenticated) return;
    setIsVoiceCallModalOpen(true);
  };

  const onBack = () => {
    router.push('/');
  };

  return (
    <div
      className={`pb-16 ${isMobile ? '' : 'max-w-6xl mx-auto pt-20 px-8 flex gap-8'}`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="relative h-48">
          <SafeImage
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
            alt={`${character.name}'s cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <button
              onClick={onBack}
              className="bg-black/40 backdrop-blur-sm rounded-full p-3 text-white border border-white/20 hover:bg-black/60 transition-all duration-300"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="bg-black/40 backdrop-blur-sm rounded-full p-3 text-white border border-white/20 hover:bg-black/60 transition-all duration-300"
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
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-zinc-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
            />
            Back
          </button>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <SafeImage
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
              alt={`${character.name}'s cover`}
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          <div className="mt-6 space-y-3">
            <button
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              onClick={handleOpenChat}
            >
              <MessageCircle className="inline-block mr-2 h-4 w-4" />
              Chat Now
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? '' : 'w-2/3'}`}>
        {/* Profile info */}
        <div className={`relative ${isMobile ? 'px-4 pb-4 -mt-16' : ''}`}>
          <div
            className={`flex ${isMobile ? 'justify-between' : 'items-center gap-4 mb-6'}`}
          >
            {isMobile ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-60"></div>
                <SafeImage
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
                  alt={character.name}
                  className="relative w-24 h-24 rounded-full border-3 border-white/30 object-cover shadow-xl"
                  width={96}
                  height={96}
                />
                {character.verified && (
                  <div className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1.5 border-2 border-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center text-white">
                    {character.name}
                    {character.verified && (
                      <span className="ml-2 text-pink-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </h1>
                </div>
              </div>
            )}
            {isMobile && (
              <div className="flex space-x-3 mt-16">
                <button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  onClick={handleOpenChat}
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="mt-4">
              <h1 className="text-2xl font-bold flex items-center text-white">
                {character.name}
                {character.verified && (
                  <span className="ml-2 text-pink-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </h1>
              <p className="text-zinc-400 mt-1">{character.name}</p>
              <p className="mt-3 text-zinc-200 leading-relaxed">
                {character.description}
              </p>

              <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3 text-white">
                  About me
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {character.description}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-6 text-zinc-200 leading-relaxed">
                {character.bio}
              </p>

              <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-3 text-white">
                  About me
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  {character.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="gallery"
          value={activeTab}
          onValueChange={setActiveTab}
          className={isMobile ? 'mt-4' : 'mt-8'}
        >
          <TabsList
            className={`w-full ${isMobile ? 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl' : 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl mb-6'}`}
          >
            <TabsTrigger
              value="gallery"
              className="flex-1 data-[state=active]:bg-white/20 data-[state=active]:text-white text-zinc-400 rounded-lg transition-all duration-300"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="premium"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-zinc-400 rounded-lg transition-all duration-300"
            >
              Premium
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex-1 data-[state=active]:bg-white/20 data-[state=active]:text-white text-zinc-400 rounded-lg transition-all duration-300"
            >
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className={isMobile ? 'p-4' : ''}>
            <div
              className={`grid ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-3 gap-4'}`}
            >
              {character?.media &&
                character?.media
                  .filter((item) => item.type === 'image')
                  .map((media, index) => (
                    <div
                      key={index}
                      className={`${isMobile ? 'aspect-square' : 'aspect-square rounded-xl overflow-hidden'} relative group cursor-pointer`}
                    >
                      <SafeImage
                        src={media.src}
                        alt={`${character.name}'s gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                        width={isMobile ? 120 : 300}
                        height={isMobile ? 120 : 300}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl">
                        <button
                          onClick={() => handleLike(index)}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                        >
                          <Heart
                            size={20}
                            className={`${likedMedia.includes(index) ? 'text-pink-500 fill-pink-500' : 'text-white'}`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className={isMobile ? 'p-4' : ''}>
            <div
              className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'}`}
            >
              {character.premiumContent ? (
                character.premiumContent.map((content) => (
                  <div
                    key={content.id}
                    className="relative rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <div className="aspect-square">
                      <SafeImage
                        src={content.thumbnail}
                        alt={`Premium content ${content.id}`}
                        className="w-full h-full object-cover"
                        width={isMobile ? 150 : 300}
                        height={isMobile ? 150 : 300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end p-4">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3 shadow-lg">
                          {content.price} GPT
                        </div>
                        <button
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleBuyContent(content.id)}
                        >
                          Unlock
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                    <p className="text-zinc-400 text-lg">
                      No premium content available yet
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos" className={isMobile ? 'p-4' : ''}>
            <div
              className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'}`}
            >
              {character?.media &&
                character.media
                  .filter((item) => item.type === 'video')
                  .map((media, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="aspect-video">
                        <video
                          src={media.src}
                          poster={media.poster}
                          className="w-full h-full object-cover"
                          controls
                          preload="none"
                        />
                      </div>
                    </div>
                  ))}
              {character?.media &&
                character.media.filter((item) => item.type === 'video')
                  .length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                      <p className="text-zinc-400 text-lg">
                        No videos available yet
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
}
