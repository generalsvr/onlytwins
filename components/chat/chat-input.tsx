import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Loader2,
  Coins,
  Square,
  Play,
  Pause,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface ChatInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  recordingTime: number;
  isAuthenticated: boolean;
  isLoading?: boolean;
  placeholder?: string;
  isMobile: boolean;
  balance: number;
  // Новые пропсы для режима прослушивания
  audioUrl?: string;
  onDeleteRecording?: () => void;
  onRetryRecording?: () => void;
}

export default function ChatInput({
  messageText,
  setMessageText,
  handleSendMessage,
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
  isAuthenticated,
  isLoading = false,
  placeholder = 'Type a message...',
  isMobile,
  balance,
  audioUrl,
  onDeleteRecording,
  onRetryRecording,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  const canSend = (messageText.trim().length > 0 || audioUrl) && !isLoading;
  const hasMessage = messageText.trim().length > 0;
  const isPlaybackMode = audioUrl && !isRecording;

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Инициализация аудио элемента при получении URL
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      });
    }
  }, [audioUrl]);

  const handleSend = () => {
    if (canSend) {
      handleSendMessage();
      inputRef.current?.focus();
    }
  };

  const handleMicClick = async () => {
    if (!isAuthenticated) {
      setShowAuthTooltip(true);
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowAuthTooltip(false);
      }, 3000);
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      try {
        await startRecording();
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);

      // Обновляем время воспроизведения каждые 100мс для плавности
      useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && audioRef.current) {
          interval = setInterval(() => {
            if (audioRef.current) {
              setPlaybackTime(audioRef.current.currentTime);
            }
          }, 100);
        }

        return () => {
          if (interval) {
            clearInterval(interval);
          }
        };
      }, [isPlaying]);
    }
  };

  const handleDeleteRecording = () => {
    if (onDeleteRecording) {
      onDeleteRecording();
      setIsPlaying(false);
      setPlaybackTime(0);
      setDuration(0);
    }
  };

  const handleRetryRecording = () => {
    if (onRetryRecording) {
      onRetryRecording();
      setIsPlaying(false);
      setPlaybackTime(0);
      setDuration(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`absolute-center-x bottom-0 z-50 w-[75%] ${isMobile && 'w-[95%]'}`}
    >
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 w-full" />

      {/* Subtle gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <div className="w-full">
          <div
            className={`
              relative flex items-end gap-3 p-3 rounded-2xl transition-all duration-300 ease-out
              backdrop-blur-xl border border-zinc-700/30
              ${
                isFocused || isRecording || isPlaybackMode
                  ? 'bg-zinc-800/60 shadow-2xl shadow-zinc-900/40 ring-1 ring-zinc-600/50 border-zinc-600/50'
                  : 'bg-zinc-800/40 hover:bg-zinc-800/50 shadow-lg shadow-zinc-900/20'
              }
            `}
          >
            {/* Микрофон или кнопка повтора записи */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[3rem]
                  backdrop-blur-sm border
                  ${
                    isRecording
                      ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 border-red-400/30'
                      : isPlaybackMode
                        ? 'bg-blue-500/80 hover:bg-blue-600/80 text-white border border-blue-400/30'
                        : isAuthenticated
                          ? 'bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-300 hover:text-white border border-zinc-600/30'
                          : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed border border-zinc-600/20'
                  }
                `}
                onClick={isPlaybackMode ? handleRetryRecording : handleMicClick}
                disabled={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Square size={16} fill="currentColor" />
                      </motion.div>
                    </motion.div>
                  ) : isPlaybackMode ? (
                    <motion.div
                      key="retry"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <RotateCcw size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Mic size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recording pulse effect */}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-red-500/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Auth tooltip */}
              <AnimatePresence>
                {showAuthTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900/95 backdrop-blur-sm text-white text-sm rounded-lg shadow-lg border border-zinc-700/50 whitespace-nowrap z-10"
                  >
                    Please sign in to use voice recording
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Field, Recording Indicator, или Playback Controls */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="recording-indicator"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between py-3 px-4"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                      <span className="text-white text-base">Recording...</span>
                    </div>
                    <div className="text-red-400 font-mono text-sm">
                      {formatRecordingTime(recordingTime)}
                    </div>
                  </motion.div>
                ) : isPlaybackMode ? (
                  <motion.div
                    key="playback-controls"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 py-3 px-4"
                  >
                    {/* Native audio player */}
                    <div className="flex-1 px-2">
                      <audio
                        controls
                        src={audioUrl}
                        className="w-full"
                        style={{ height: '32px' }}
                      />
                    </div>

                    {/* Delete button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDeleteRecording}
                      className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.input
                    key="text-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className={`
                      w-full bg-transparent text-white placeholder-zinc-400 py-3 px-4 pr-4 
                      focus:outline-none transition-all duration-200 text-base
                    `}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isLoading}
                    maxLength={1000}
                  />
                )}
              </AnimatePresence>

              {/* Character count for long messages */}
              {messageText.length > 800 && !isRecording && !isPlaybackMode && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-zinc-400 bg-zinc-900/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  {messageText.length}/1000
                </div>
              )}
            </div>

            {/* Send Button */}
            <AnimatePresence>
              {!isRecording && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={canSend ? { scale: 1.05 } : {}}
                  whileTap={canSend ? { scale: 0.95 } : {}}
                  className={`
                    relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[3rem]
                    backdrop-blur-sm border
                    ${
                      canSend
                        ? 'bg-gradient-to-r from-pink-500/90 to-purple-600/90 hover:from-pink-600/90 hover:to-purple-700/90 text-white shadow-lg shadow-pink-500/25 border-pink-400/30'
                        : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed border-zinc-600/20'
                    }
                  `}
                  onClick={handleSend}
                  disabled={!canSend}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Loader2 size={20} className="animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Send size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Send button glow effect */}
                  {canSend && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-purple-600/30 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Quick actions or suggestions */}
          {!hasMessage && !isMobile && !isRecording && !isPlaybackMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 mt-3 overflow-x-auto pb-1"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-2xl">
                <Coins size={14} className="text-yellow-400 mr-1" />
                <span className="text-sm text-white font-medium">
                  {balance || '0'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Recording tips */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
            >
              <p className="text-red-300 text-sm text-center">
                Click the microphone again to stop recording
              </p>
            </motion.div>
          )}

          {/* Playback tips */}
          {isPlaybackMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
            >
              <p className="text-green-300 text-sm text-center">
                Press play to listen to your recording or send it as a voice
                message
              </p>
            </motion.div>
          )}
        </div>

        {/* Hidden audio element for playback */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}
