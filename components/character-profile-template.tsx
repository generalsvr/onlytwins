'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Share2,
  X,
  MapPin,
  Briefcase,
  Calendar,
  Target,
  ThumbsDown,
  ThumbsUp,
  Play,
  Lock,
  Sparkles,
  Star,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SafeImage from './safe-image';
import { useRouter } from 'next/navigation';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useAuthStore } from '@/lib/stores/authStore';
import { AgentResponse, PrivateContent } from '@/lib/types/agents';
import { useModalStore } from '@/lib/stores/modalStore';
import AuthModal from '@/components/auth/auth-modal';
import TokensModal from '@/components/modals/tokens';
import { usePayment } from '@/lib/hooks/usePayment';
import { useLocale } from '@/contexts/LanguageContext';
import { useAgent } from '@/lib/hooks/useAgent';
import { Character } from '@/lib/types/characters';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import InsufficientTokens from '@/components/modals/insufficient-tokens';

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

const ContentCard = ({
  content,
  onBuy,
  onImageClick,
  isMobile,
  characterName,
  isPublic = false,
}: {
  content: PrivateContent;
  onBuy: (content: PrivateContent) => void;
  onImageClick: (src: string, alt: string) => void;
  isMobile: boolean;
  characterName: string;
  isPublic: boolean;
}) => {
  const isVideo = content.mimeType.includes('video');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleFullscreenChange = () => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any)?.webkitFullscreenElement ||
      (document as any)?.msFullscreenElement
    );

    if (!isFullscreen && videoRef.current) {
      (videoRef.current as any).pause();
      setIsVideoPlaying(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  if (content.purchased || isPublic) {
    return (
      <div className="relative rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="aspect-[4/5] relative">
          {isVideo ? (
            <video
              ref={videoRef}
              src={content.url}
              className={`w-full h-full transition-all duration-300  ${
                isVideoPlaying ? 'object-contain' : 'object-cover'
              } `}
              controls={false}
              preload="metadata"
            />
          ) : (
            <img
              src={content.url}
              alt={`Premium content ${content.id}`}
              className="w-full h-full object-cover"
              width={isMobile ? 150 : 300}
              height={isMobile ? 190 : 380}
              onClick={() =>
                onImageClick(content.url, `${characterName}'s premium content`)
              }
              onLoad={() => setImageLoaded(true)}
            />
          )}

          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3" />
            {isPublic ? 'Public' : 'Owned'}
          </div>

          {isVideo && (
            <div
              onClick={async () => {
                const video = videoRef.current as any;
                setIsVideoPlaying(true);
                if (video.requestFullscreen) {
                  await video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                  await video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                  await video.msRequestFullscreen();
                }
                await video.play();
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 border border-white/20">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-[4/5] relative">
        <SafeImage
          src={content.url}
          alt={`Premium content ${content.id}`}
          className="w-full h-full object-cover filter blur-md scale-110"
          width={isMobile ? 150 : 300}
          height={isMobile ? 190 : 380}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center gap-1">
          {isVideo ? (
            <>
              <Play className="w-3 h-3" />
              Video
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              Photo
            </>
          )}
        </div>

        <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          {content.price}
        </div>

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 border border-white/30 group-hover:bg-black/70 transition-colors duration-300">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {!isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 border border-white/30 group-hover:bg-black/70 transition-colors duration-300">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-5">
          <button
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => onBuy(content)}
          >
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Unlock Content
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Image Lightbox Component
const ImageLightbox = ({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        <X size={24} />
      </button>
      <div className="max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default function CharacterProfileTemplate({
  character,
}: CharacterProfileTemplateProps) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { isAuthenticated, getCurrentUser, user } = useAuthStore(
    (state) => state
  );
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { locale } = useLocale();
  const { openModal, closeModal } = useModalStore((state) => state);
  const { purchaseContent } = usePayment(locale);
  const [currentCharacter, setCurrentCharacter] =
    useState<AgentResponse | null>(character);
  const { refetch: refetchAgent, isRefetching } = useAgent(
    currentCharacter?.id || 0,
    (updatedCharacter) => {
      setCurrentCharacter(updatedCharacter);
    }
  );

  const handleOpenChat = () => {
    router.push(`/${locale}/chat/${currentCharacter.id}`);
  };

  const handleImageClick = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const handleBuyContent = async (content: PrivateContent) => {
    if (!content || !content.price) return;
    if (!isAuthenticated || !currentCharacter?.id)
      return openModal({
        type: 'message',
        content: (
          <AuthModal initialMode="signup" onClose={() => closeModal()} />
        ),
      });
    setLoading(true);
    await purchaseContent({
      action: 'content_unlock',
      targetType: 'content',
      targetId: content?.id,
      currency: 'OTT',
    }).then(async (res) => {
      if (res.error && res.error.message.includes('Insufficient')) {
        openModal({
          type: 'message',
          content: (
            <InsufficientTokens
              requiredTokens={content.price}
              currentBalance={user?.balances.oTT}
              buyToken={() => {
                openModal({
                  type: 'message',
                  content: <TokensModal />,
                });
              }}
            />
          ),
        });
      }
      const newUrl = res.url;
      if (currentCharacter.meta.privateContent && res.status === 'SUCCESS') {
        const updatedPrivateContent: PrivateContent[] =
          currentCharacter.meta.privateContent.map((item) => {
            if (item.id === content.id) {
              return {
                ...item,
                purchased: true,
                url: newUrl,
              };
            }
            return item;
          });
        setCurrentCharacter({
          ...currentCharacter,
          meta: {
            ...currentCharacter.meta,
            privateContent: updatedPrivateContent,
          },
        });
      }
      await getCurrentUser();
      setLoading(false);
    });
  };

  const onBack = () => {
    router.back();
  };

  const handleUnlockPrivateContent = () => {
    if (!isAuthenticated) {
      openModal({
        type: 'message',
        content: (
          <AuthModal initialMode="signup" onClose={() => closeModal()} />
        ),
      });
      return;
    }
    setActiveTab('private');
  };

  if (!currentCharacter) return null;

  // Calculate stats
  const postsCount =
    currentCharacter?.meta.publicContent?.filter((item) =>
      item.mimeType.includes('image')
    )?.length || 0;
  const clipsCount =
    currentCharacter?.meta.publicContent?.filter((item) =>
      item.mimeType.includes('video')
    )?.length || 0;
  const bundlesCount = 0; // You can implement this based on your logic
  const followersCount = '5.5K'; // You can get this from your data

  return (
    <>
      <ImageLightbox
        src={lightboxImage?.src || ''}
        alt={lightboxImage?.alt || ''}
        isOpen={!!lightboxImage}
        onClose={closeLightbox}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">{currentCharacter.name}</h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6">
          <div className={`flex gap-4`}>
            <div className="flex items-start gap-6 mb-6 flex-2">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={currentCharacter.meta.profileImage}
                  alt={currentCharacter.name}
                  className="w-32 h-32 rounded-full object-cover cursor-pointer"
                  onClick={() =>
                    handleImageClick(
                      currentCharacter.meta.profileImage,
                      `${currentCharacter.name}'s profile`
                    )
                  }
                />
                {/*{currentCharacter.verified && (*/}
                {/*  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-1.5 border-2 border-black">*/}
                {/*    <svg*/}
                {/*      xmlns="http://www.w3.org/2000/svg"*/}
                {/*      viewBox="0 0 24 24"*/}
                {/*      fill="white"*/}
                {/*      className="w-4 h-4"*/}
                {/*    >*/}
                {/*      <path*/}
                {/*        fillRule="evenodd"*/}
                {/*        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"*/}
                {/*        clipRule="evenodd"*/}
                {/*      />*/}
                {/*    </svg>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </div>
            <div className={'flex-1'}>
              {/* Bio */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">
                  {currentCharacter.meta.age || 'N/A'} |{' '}
                  {currentCharacter.meta.occupation || 'Entertainer'} |{' '}
                  {currentCharacter.meta.gender || 'Straight'}
                </h2>
                <p className="text-zinc-300 mb-4">
                  {currentCharacter.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors max-w-64"
                  onClick={handleOpenChat}
                >
                  Chat Now
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex gap-8 border-b border-zinc-800 mb-6 mt-6 ${isMobile && 'justify-between'}`}>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-3 px-5 transition-colors duration-300 ${
                activeTab === 'gallery'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-zinc-400'
              }`}
            >
              <svg
                className="w-8 h-8 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={handleUnlockPrivateContent}
              className={`pb-3 px-5 transition-colors duration-300 ${
                activeTab === 'private'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-zinc-400'
              }`}
            >
              <Lock className="w-8 h-8 mx-auto" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-5 transition-colors duration-300 ${
                activeTab === 'profile'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-zinc-400'
              }`}
            >
              <svg
                className="w-8 h-8 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {activeTab === 'private' && (
             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2   xss:grid-cols-1 grid-cols-2 gap-4">
              {currentCharacter.meta.privateContent &&
                currentCharacter.meta.privateContent.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onBuy={handleBuyContent}
                    onImageClick={handleImageClick}
                    isMobile={isMobile}
                    characterName={currentCharacter.name}
                  />
                ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2  xss:grid-cols-1 grid-cols-2 gap-4">
              {currentCharacter?.meta.publicContent &&
                currentCharacter.meta.publicContent.map((media) => (
                  <ContentCard
                    key={media.id}
                    content={media}
                    onBuy={handleBuyContent}
                    onImageClick={handleImageClick}
                    isMobile={isMobile}
                    characterName={currentCharacter.name}
                    isPublic={true}
                  />
                ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">About me</h3>
                <p className="text-zinc-300 leading-relaxed">
                  {currentCharacter.description}
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCharacter.meta.age && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Age</p>
                        <p className="text-white">
                          {currentCharacter.meta.age}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentCharacter.meta.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Location</p>
                        <p className="text-white">
                          {currentCharacter.meta.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentCharacter.meta.occupation && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Occupation</p>
                        <p className="text-white">
                          {currentCharacter.meta.occupation}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentCharacter.meta.gender && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-pink-400" />
                      <div>
                        <p className="text-zinc-400 text-sm">Gender</p>
                        <p className="text-white">
                          {currentCharacter.meta.gender}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {currentCharacter.meta.goals && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-pink-400" />
                      <p className="text-zinc-400 text-sm">Goals</p>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {currentCharacter.meta.goals}
                    </p>
                  </div>
                )}

                {currentCharacter.meta.likes && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="w-5 h-5 text-green-400" />
                      <p className="text-zinc-400 text-sm">Likes</p>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {currentCharacter.meta.likes}
                    </p>
                  </div>
                )}

                {currentCharacter.meta.dislikes && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown className="w-5 h-5 text-red-400" />
                      <p className="text-zinc-400 text-sm">Dislikes</p>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {currentCharacter.meta.dislikes}
                    </p>
                  </div>
                )}

                {currentCharacter.meta.physicalDescription && (
                  <div className="mt-4">
                    <p className="text-zinc-400 text-sm mb-2">
                      Physical Description
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      {currentCharacter.meta.physicalDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No content message */}
          {((activeTab === 'posts' &&
            (!currentCharacter?.meta.publicContent ||
              currentCharacter.meta.publicContent.filter((item) =>
                item.mimeType.includes('image')
              ).length === 0)) ||
            (activeTab === 'private' &&
              (!currentCharacter.meta.privateContent ||
                currentCharacter.meta.privateContent.length === 0)) ||
            (activeTab === 'gallery' &&
              (!currentCharacter?.meta.publicContent ||
                currentCharacter.meta.publicContent.length === 0))) && (
            <div className="text-center py-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-zinc-400 text-lg">
                    No content available yet
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Check back later for more content!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
