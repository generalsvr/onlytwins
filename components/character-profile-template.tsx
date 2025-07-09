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

// Premium Content Card Component
const ContentCard = ({
  content,
  onBuy,
  onImageClick,
  isMobile,
  characterName,
  isPublic=false
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
  const videoRef = useRef(null);
  // Обработчик выхода из полноэкранного режима
  const handleFullscreenChange = () => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      document?.webkitFullscreenElement ||
      document?.msFullscreenElement
    );

    // Если вышли из полноэкранного режима, ставим видео на паузу
    if (!isFullscreen && videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    // Добавляем обработчики событий
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      // Удаляем обработчики при размонтировании
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
              className="w-full h-full object-fit"
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

          {/* Purchased Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3" />
            {isPublic ? 'Public' : 'Owned'}
          </div>

          {/* Play button for videos */}
          {isVideo && (
            <div
              onClick={async () => {
                if (videoRef.current.requestFullscreen) {
                  await videoRef.current.requestFullscreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                  await videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                  await videoRef.current.msRequestFullscreen();
                }
                await videoRef.current.play();
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
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ">
      <div className="aspect-[4/5] relative">
        {/* Blurred background */}
        <SafeImage
          src={content.url}
          alt={`Premium content ${content.id}`}
          className="w-full h-full object-cover filter blur-md scale-110"
          width={isMobile ? 150 : 300}
          height={isMobile ? 190 : 380}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        {/* Content type indicator */}
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

        {/* Premium badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          {content.price}
        </div>

        {/* Play button for locked videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 border border-white/30 group-hover:bg-black/70 transition-colors duration-300">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Lock icon for photos */}
        {!isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 border border-white/30 group-hover:bg-black/70 transition-colors duration-300">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
        )}

        {/* Bottom section with price and unlock button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-5">
          {/* Price */}

          {/* Unlock button */}
          <button
            className={`w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
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

// Character Info Card Component
const CharacterInfoCard = ({
  currentCharacter,
}: {
  currentCharacter: AgentResponse;
}) => {
  const meta = currentCharacter.meta;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">
        Character Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meta.age && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-zinc-400 text-sm">Age</p>
              <p className="text-white">{meta.age}</p>
            </div>
          </div>
        )}

        {meta.location && (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-zinc-400 text-sm">Location</p>
              <p className="text-white">{meta.location}</p>
            </div>
          </div>
        )}

        {meta.occupation && (
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-zinc-400 text-sm">Occupation</p>
              <p className="text-white">{meta.occupation}</p>
            </div>
          </div>
        )}

        {meta.gender && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-pink-400" />
            <div>
              <p className="text-zinc-400 text-sm">Gender</p>
              <p className="text-white">{meta.gender}</p>
            </div>
          </div>
        )}
      </div>

      {meta.goals && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-pink-400" />
            <p className="text-zinc-400 text-sm">Goals</p>
          </div>
          <p className="text-white text-sm leading-relaxed">{meta.goals}</p>
        </div>
      )}

      {meta.likes && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            <p className="text-zinc-400 text-sm">Likes</p>
          </div>
          <p className="text-white text-sm leading-relaxed">{meta.likes}</p>
        </div>
      )}

      {meta.dislikes && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsDown className="w-5 h-5 text-red-400" />
            <p className="text-zinc-400 text-sm">Dislikes</p>
          </div>
          <p className="text-white text-sm leading-relaxed">{meta.dislikes}</p>
        </div>
      )}

      {meta.physicalDescription && (
        <div className="mt-4">
          <p className="text-zinc-400 text-sm mb-2">Physical Description</p>
          <p className="text-white text-sm leading-relaxed">
            {meta.physicalDescription}
          </p>
        </div>
      )}
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
    router.push('/');
  };

  useEffect(() => {
    if (activeTab === 'premium' && !isAuthenticated) {
      setActiveTab('gallery');
      openModal({
        type: 'message',
        content: (
          <AuthModal initialMode="signup" onClose={() => closeModal()} />
        ),
      });
    }
  }, [activeTab, isAuthenticated, openModal, closeModal]);

  return (
    currentCharacter && (
      <>
        <ImageLightbox
          src={lightboxImage?.src || ''}
          alt={lightboxImage?.alt || ''}
          isOpen={!!lightboxImage}
          onClose={closeLightbox}
        />

        <div
          className={`pb-16 ${isMobile ? '' : 'max-w-6xl mx-auto pt-20 px-8 flex gap-8'}`}
        >
          {/* Mobile Header */}
          {isMobile && (
            <div className="relative h-48">
              <SafeImage
                src={`${currentCharacter.meta.profileImage}`}
                alt={`${currentCharacter.name}'s cover`}
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
                  src={`${currentCharacter.meta.profileImage}`}
                  alt={`${currentCharacter.name}'s cover`}
                  className="w-full aspect-[4/5] object-cover cursor-pointer"
                  onClick={() =>
                    handleImageClick(
                      currentCharacter.meta.profileImage,
                      `${currentCharacter.name}'s profile`
                    )
                  }
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
                      src={`${currentCharacter.meta.profileImage}`}
                      alt={currentCharacter.name}
                      className="relative w-24 h-24 rounded-full border-3 border-white/30 object-cover shadow-xl cursor-pointer"
                      width={96}
                      height={96}
                      onClick={() =>
                        handleImageClick(
                          currentCharacter.meta.profileImage,
                          `${currentCharacter.name}'s profile`
                        )
                      }
                    />
                    {currentCharacter.verified && (
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
                        {currentCharacter.name}
                        {currentCharacter.verified && (
                          <span className="ml-2 text-pink-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.060l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
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
                <div className="mt-4 space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center text-white">
                      {currentCharacter.name}
                      {currentCharacter.verified && (
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
                    <p className="text-zinc-400 mt-1">
                      {currentCharacter.name}
                    </p>
                    <p className="mt-3 text-zinc-200 leading-relaxed">
                      {currentCharacter.description}
                    </p>
                  </div>

                  <CharacterInfoCard currentCharacter={currentCharacter} />
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <p className="text-lg mb-6 text-zinc-200 leading-relaxed">
                      {currentCharacter.bio}
                    </p>

                    <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        About me
                      </h2>
                      <p className="text-zinc-300 leading-relaxed">
                        {currentCharacter.description}
                      </p>
                    </div>
                  </div>

                  <CharacterInfoCard currentCharacter={currentCharacter} />
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
                  {currentCharacter?.meta.publicContent &&
                    currentCharacter?.meta.publicContent
                      .filter((item) => item.mimeType.includes('image'))
                      .map((media, index) => (
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
              </TabsContent>

              <TabsContent value="premium" className={isMobile ? 'p-4' : ''}>
                <div
                  className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'}`}
                >
                  {currentCharacter.meta.privateContent ? (
                    currentCharacter.meta.privateContent.map((content) => (
                      <ContentCard
                        key={content.id}
                        content={content}
                        onBuy={handleBuyContent}
                        onImageClick={handleImageClick}
                        isMobile={isMobile}
                        characterName={currentCharacter.name}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-zinc-400 text-lg">
                            No premium content available yet
                          </p>
                          <p className="text-zinc-500 text-sm">
                            Check back later for exclusive content!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="videos" className={isMobile ? 'p-4' : ''}>
                <div
                  className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'}`}
                >
                  {currentCharacter?.meta.publicContent &&
                    currentCharacter.meta.publicContent
                      .filter((item) => item.mimeType.includes('video'))
                      .map((media, index) => (
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
                  {currentCharacter?.meta.publicContent &&
                    currentCharacter.meta.publicContent.filter((item) =>
                      item.mimeType.includes('video')
                    ).length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4">
                              <Play
                                className="w-8 h-8 text-white ml-1"
                                fill="white"
                              />
                            </div>
                            <p className="text-zinc-400 text-lg">
                              No videos available yet
                            </p>
                            <p className="text-zinc-500 text-sm">
                              Check back later for video content!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </>
    )
  );
}
