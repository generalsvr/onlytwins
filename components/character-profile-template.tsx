'use client';

import type React from 'react';

import { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SafeImage from './safe-image';
import { useRouter } from 'next/navigation';
import StylishVoiceCallModal from './stylish-voice-call-modal';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useAuthStore } from '@/lib/stores/authStore';
import Image from "next/image";
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
  character: AgentResponse | null
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
    // if (!isAuthenticated) {
    //   onAuthRequired('signup');
    //   return;
    // }
    setIsFollowing(!isFollowing);
  };

  const handleOpenChat = () => {
    router.push(`/chat/${character.id}`);
  };

  const handleLike = (mediaIndex: number) => {
    if (!isAuthenticated) {
      return;
    }

    setLikedMedia((prev) => {
      if (prev.includes(mediaIndex)) {
        return prev.filter((id) => id !== mediaIndex);
      } else {
        return [...prev, mediaIndex];
      }
    });
  };

  const handleBuyContent = (contentId: number) => {
    if (!isAuthenticated) {
      return;
    }
    // Handle purchase logic
    alert(`Buying content ${contentId}`);
  };

  const handleVoiceCallClick = () => {
    if (!isAuthenticated) {
      return;
    }
    setIsVoiceCallModalOpen(true);
  };
  const onBack = () => {
    router.push('/')
  }

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
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <button
              onClick={onBack}
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
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
          <div className="relative rounded-xl overflow-hidden">
            <SafeImage
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
              alt={`${character.name}'s cover`}
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="mt-6 space-y-4">
            {/*<button*/}
            {/*  variant={isFollowing ? 'outline' : 'default'}*/}
            {/*  className={`w-full py-2 rounded-lg ${isFollowing ? 'border border-zinc-600 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}*/}
            {/*  onClick={handleFollow}*/}
            {/*>*/}
            {/*  {isFollowing ? 'Following' : 'Follow'}*/}
            {/*</button>*/}
            <button
              className="w-full py-2 border border-zinc-600 text-white rounded-lg"
              onClick={handleOpenChat}
            >
              <MessageCircle className="inline-block mr-2 h-4 w-4" />
              Chat Now
            </button>
            {/*<button*/}
            {/*  className="w-full py-2 border border-zinc-600 text-white rounded-lg"*/}
            {/*  onClick={handleVoiceCallClick}*/}
            {/*>*/}
            {/*  <Phone className="inline-block mr-2 h-4 w-4" />*/}
            {/*  Voice Call*/}
            {/*</button>*/}
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
                <SafeImage
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}
                  alt={character.name}
                  className="w-24 h-24 rounded-full border-4 border-black object-cover"
                  width={96}
                  height={96}
                />
                {character.verified && (
                  <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1">
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
                {/*<Image*/}
                {/*  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}`}*/}
                {/*  alt={character.name}*/}
                {/*  className="w-16 h-16 rounded-full object-cover"*/}
                {/*  width={64}*/}
                {/*  height={64}*/}
                {/*/>*/}
                <div>
                  <h1 className="text-2xl font-bold flex items-center">
                    {character.name}
                    {character.verified && (
                      <span className="ml-1 text-pink-500">
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
                </div>
              </div>
            )}
            {isMobile && (
              <div className="flex space-x-2 mt-16">
                {/*<button*/}
                {/*  className={`px-4 py-2 rounded-full ${*/}
                {/*    isFollowing*/}
                {/*      ? 'border-zinc-600 text-white border'*/}
                {/*      : 'bg-gradient-to-r from-pink-500 to-purple-500'*/}
                {/*  }`}*/}
                {/*  onClick={handleFollow}*/}
                {/*>*/}
                {/*  {isFollowing ? 'Following' : 'Follow'}*/}
                {/*</button>*/}
                <button
                  className="px-4 py-2 rounded-full border border-zinc-600 text-white"
                  onClick={handleOpenChat}
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  className="px-4 py-2 rounded-full border border-zinc-600 text-white"
                  onClick={handleVoiceCallClick}
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            )}
            {/*{!isMobile && (*/}
            {/*  <div className="flex space-x-4">*/}
            {/*    <div className="text-center">*/}
            {/*      <p className="text-2xl font-bold">{character.posts}</p>*/}
            {/*      <p className="text-zinc-400">Posts</p>*/}
            {/*    </div>*/}
            {/*    <div className="text-center">*/}
            {/*      <p className="text-2xl font-bold">{character.followers}</p>*/}
            {/*      <p className="text-zinc-400">Followers</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>

          {isMobile ? (
            <div className="mt-4">
              <h1 className="text-xl font-bold flex items-center">
                {character.name}
                {character.verified && (
                  <span className="ml-1 text-pink-500">
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
              <p className="text-zinc-400">{character.name}</p>
              <p className="mt-2">{character.description}</p>

              {/*<div className="flex space-x-4 mt-4">*/}
              {/*  <div>*/}
              {/*    <span className="font-bold">{character.posts}</span>{' '}*/}
              {/*    <span className="text-zinc-400">Posts</span>*/}
              {/*  </div>*/}
              {/*  <div>*/}
              {/*    <span className="font-bold">{character.followers}</span>{' '}*/}
              {/*    <span className="text-zinc-400">Followers</span>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*<div className="flex flex-wrap gap-2 mt-4">*/}
              {/*  {character.interests.map((interest, index) => (*/}
              {/*    <span*/}
              {/*      key={index}*/}
              {/*      className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs"*/}
              {/*    >*/}
              {/*      {interest}*/}
              {/*    </span>*/}
              {/*  ))}*/}
              {/*</div>*/}

              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">About me</h2>
                <p className="text-zinc-300 text-sm">{character.description}</p>
              </div>

              {/*<div className="bg-zinc-900/80 rounded-xl p-4 mt-4">*/}
              {/*  <h2 className="text-lg font-semibold mb-2">*/}
              {/*    Relationship level:{' '}*/}
              {/*    <span className="text-white">*/}
              {/*      {character.relationshipLevel}*/}
              {/*    </span>*/}
              {/*  </h2>*/}
              {/*  <div className="flex items-center mb-2">*/}
              {/*    <span className="text-zinc-400 mr-2">Progress:</span>*/}
              {/*    <span className="text-white">{character.progress}/100</span>*/}
              {/*  </div>*/}
              {/*  <div className="w-full bg-zinc-800 rounded-full h-3">*/}
              {/*    <div*/}
              {/*      className="bg-[#c2c96c] h-3 rounded-full"*/}
              {/*      style={{ width: `${character.progress}%` }}*/}
              {/*    ></div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">{character.bio}</p>

              {/*<div className="flex flex-wrap gap-2 mb-6">*/}
              {/*  {character.interests.map((interest, index) => (*/}
              {/*    <span*/}
              {/*      key={index}*/}
              {/*      className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs"*/}
              {/*    >*/}
              {/*      {interest}*/}
              {/*    </span>*/}
              {/*  ))}*/}
              {/*</div>*/}

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About me</h2>
                <p className="text-zinc-300">{character.description}</p>
              </div>

              {/*<div className="bg-zinc-900/80 rounded-xl p-4 mb-6">*/}
              {/*  <h2 className="text-xl font-semibold mb-2">*/}
              {/*    Relationship level:{' '}*/}
              {/*    <span className="text-white">*/}
              {/*      {character.relationshipLevel}*/}
              {/*    </span>*/}
              {/*  </h2>*/}
              {/*  <div className="flex items-center mb-2">*/}
              {/*    <span className="text-zinc-400 mr-2">Progress:</span>*/}
              {/*    <span className="text-white">{character.progress}/100</span>*/}
              {/*  </div>*/}
              {/*  <div className="w-full bg-zinc-800 rounded-full h-3">*/}
              {/*    <div*/}
              {/*      className="bg-[#c2c96c] h-3 rounded-full"*/}
              {/*      style={{ width: `${character.progress}%` }}*/}
              {/*    ></div>*/}
              {/*  </div>*/}
              {/*</div>*/}
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
          <TabsContent value="gallery" className={isMobile ? 'p-4' : ''}>
            <div
              className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-4'}`}
            >
              {character?.media &&
                character?.media
                  .filter((item) => item.type === 'image')
                  .map((media, index) => (
                    <div
                      key={index}
                      className={`${isMobile ? 'aspect-square' : 'aspect-square rounded-xl overflow-hidden'} relative`}
                    >
                      <SafeImage
                        src={media.src}
                        alt={`${character.name}'s gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={isMobile ? 120 : 300}
                        height={isMobile ? 120 : 300}
                      />
                      <div
                        className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => handleLike(index)}
                      >
                        <Heart
                          size={24}
                          className={`${likedMedia.includes(index) ? 'text-pink-500 fill-pink-500' : 'text-white'}`}
                        />
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
                    className="relative rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square">
                      <SafeImage
                        src={content.thumbnail}
                        alt={`Premium content ${content.id}`}
                        className="w-full h-full object-cover"
                        width={isMobile ? 150 : 300}
                        height={isMobile ? 150 : 300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end p-3">
                        <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {content.price} GPT
                        </div>
                        <button
                          className="w-full bg-white text-pink-500 hover:bg-zinc-200 py-2 rounded-lg font-medium"
                          onClick={() => handleBuyContent(content.id)}
                        >
                          Unlock
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-zinc-400">
                    No premium content available yet
                  </p>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div
                className={`${isMobile ? 'mt-6' : 'mt-8'} bg-zinc-800 rounded-lg p-4 text-center`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Access Premium Content
                </h3>
                <p className="text-zinc-400 mb-4">
                  Sign up to unlock exclusive premium content from{' '}
                  {character.name}
                </p>
                <button
                  className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg"
                  onClick={() => onAuthRequired('signup')}
                >
                  Sign Up Now
                </button>
              </div>
            )}
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
                      className="relative rounded-lg overflow-hidden"
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
                  <div className="col-span-full text-center py-8">
                    <p className="text-zinc-400">No videos available yet</p>
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
}
