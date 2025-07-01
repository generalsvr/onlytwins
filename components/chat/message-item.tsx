
import React, { useState, useRef, useEffect } from 'react';
import {
  Pause,
  Play,
  Download,
  Copy,
  Check,
  Lock,
  CreditCard,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Message } from '@/lib/types/chat';
import { AgentResponse, PrivateContent } from '@/lib/types/agents';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  character: AgentResponse;
  isMobile: boolean;
  handlePurchaseContent: (content: PrivateContent, messageId: number) => void;
}

export default function MessageItem({
  message,
  character,
  isMobile,
  handlePurchaseContent,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Аудио состояния
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';
  const isPaidMedia = message.media?.price && message.media.price > 0;
  const isMediaPurchased = message.media?.purchased || false;
  const isAudio = message.audio;

  // Аудио эффекты
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [message.audio]);

  const copyToClipboard = async () => {
    if (message.text) {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleAudioPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`flex items-end space-x-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      >
        {/* Avatar for agent messages */}
        {isAgent && !isMobile && (
          <motion.div
            className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-pink-500/30"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={`${character.meta.profileImage}` || ''}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="flex flex-col space-y-1">
          {/* Message content */}
          <motion.div
            className="relative"
            onHoverStart={() => setShowActions(true)}
            onHoverEnd={() => setShowActions(false)}
            transition={{ duration: 0.2 }}
          >
            {/* Text message */}
            {message.text && (
              <div
                className={`
                  relative p-4 rounded-2xl shadow-lg backdrop-blur-sm
                  ${
                    isAgent
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-bl-md'
                      : 'bg-gradient-to-br from-zinc-800 to-zinc-700 text-white rounded-br-md border border-zinc-600/50'
                  }
                `}
              >
                <p className="whitespace-pre-line leading-relaxed text-sm md:text-base">
                  {message.text}
                </p>

                {/* Message actions */}
                <AnimatePresence>
                  {showActions && message.text && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`
                        absolute top-2 flex space-x-1
                        ${isUser ? 'left-2' : 'right-2'}
                      `}
                    >
                      <button
                        onClick={copyToClipboard}
                        className="p-1.5 bg-black/20 hover:bg-black/40 rounded-lg transition-colors"
                        title="Copy message"
                      >
                        {copied ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} className="text-white/70" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Audio message */}
            {isAudio && (
              <audio
                controls
                src={message.audio}
                className="w-full"
                style={{ height: '32px' }}
              />
            )}

            {/* Image/Video message */}
            {message.media && (
              <motion.div
                className={`
                  w-[350px] mt-5 relative
                  rounded-2xl overflow-hidden shadow-lg border-2 
                  ${
                    isPaidMedia && !isMediaPurchased
                      ? 'border-yellow-500/50 ring-2 ring-yellow-500/20'
                      : 'border-zinc-600/30'
                  }
                  ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  {/* Платный контент - размытое превью */}
                  {isPaidMedia && !isMediaPurchased ? (
                    <div className="relative">
                      {message.media.mimeType?.includes('video') ? (
                        <video
                          src={message.media.url}
                          className="w-full max-w-sm h-auto object-cover rounded-2xl blur-lg"
                          poster={message.media.url}
                        />
                      ) : (
                        <img
                          src={message.media?.url}
                          alt="Premium content preview"
                          className="w-full max-w-sm h-auto object-cover rounded-2xl blur-lg"
                          onLoad={() => setImageLoaded(true)}
                          loading="lazy"
                        />
                      )}

                      {/* Overlay для платного контента */}
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-2xl">
                        <motion.div
                          className="text-center space-y-4 flex justify-center items-center flex-col"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="space-y-2">
                            <p className="text-white font-medium">
                              Premium Content
                            </p>
                            <p className="text-yellow-400 text-lg font-bold">
                              ${message.media.price}
                            </p>
                          </div>

                          <motion.button
                            disabled={isPurchasing}
                            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-full text-white font-medium transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handlePurchaseContent(message.media!, message.id)
                            }
                          >
                            {isPurchasing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard size={16} />
                                <span>Unlock</span>
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    // Обычный контент или уже купленный
                    <>
                      {message.media.mimeType?.includes('video') ? (
                        <video
                          src={message.media.url}
                          className="w-full max-w-sm h-auto object-cover rounded-2xl"
                          controls
                        />
                      ) : (
                        <img
                          src={message.media?.url}
                          alt="Shared image"
                          className="w-full max-w-sm h-auto object-cover rounded-2xl"
                          onLoad={() => setImageLoaded(true)}
                          loading="lazy"
                        />
                      )}


                      {/* Обычные действия для изображений */}
                      <AnimatePresence>
                        {showActions && imageLoaded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"
                          >
                            <button
                              onClick={() =>
                                window.open(message.media?.url, '_blank')
                              }
                              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                              title="View full size"
                            >
                              <Download size={20} className="text-white" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* Индикатор покупки */}
                  {isPaidMedia && isMediaPurchased && (
                    <div className="absolute top-2 right-2 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check size={12} />
                      <span>Purchased</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Timestamp */}
          <div
            className={`flex items-center space-x-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-xs text-zinc-500">{message.time}</span>
            {isUser && (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
