import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';

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
  isMobile
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();
  const canSend = true;
  const hasMessage = messageText.trim().length > 0;

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

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
      await startRecording();
    }
  };

  const handleSend = () => {
    handleSendMessage();
    inputRef.current?.focus();
  };

  const formatRecordingTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`absolute-center-x bottom-0 z-50 w-[75%] ${isMobile && 'w-[95%]'}`}>
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 w-full" />

      {/* Subtle gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative ">
        <div className="w-full">
          <div
            className={`
              relative flex items-end gap-3 p-3 rounded-2xl transition-all duration-300 ease-out
              backdrop-blur-xl border border-zinc-700/30
              ${
                isFocused || isRecording
                  ? 'bg-zinc-800/60 shadow-2xl shadow-zinc-900/40 ring-1 ring-zinc-600/50 border-zinc-600/50'
                  : 'bg-zinc-800/40 hover:bg-zinc-800/50 shadow-lg shadow-zinc-900/20'
              }
            `}
          >
            {/* Microphone Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                  backdrop-blur-sm
                  ${
                    isRecording
                      ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 border border-red-400/30'
                      : isAuthenticated
                        ? 'bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-300 hover:text-white border border-zinc-600/30'
                        : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed border border-zinc-600/20'
                  }
                `}
                onClick={handleMicClick}
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
                        <MicOff size={20} />
                      </motion.div>
                      <span className="text-xs font-medium min-w-[2.5rem]">
                        {formatRecordingTime(recordingTime)}
                      </span>
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
                    className="absolute inset-0 rounded-xl bg-red-500/50"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
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

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={isRecording ? 'Recording...' : placeholder}
                className={`
                  w-full bg-transparent text-white placeholder-zinc-400 py-3 px-4 pr-4 
                  focus:outline-none transition-all duration-200 text-base
                  ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isRecording || isLoading}
                maxLength={1000}
              />

              {/* Character count for long messages */}
              {messageText.length > 800 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-zinc-400 bg-zinc-900/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  {messageText.length}/1000
                </div>
              )}
            </div>

            {/* Send Button */}
            <motion.button
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
          </div>

          {/* Recording indicator */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center mt-3 text-red-400 text-sm bg-zinc-900/60 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit border border-red-500/20"
              >
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full mr-2"
                />
                Recording... Tap to stop
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick actions or suggestions */}
          {!hasMessage && !isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 mt-3 overflow-x-auto pb-1"
            >
              {['Hello!', 'How can I help?', 'Tell me more'].map(
                (suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/60 text-zinc-300 text-sm rounded-full whitespace-nowrap transition-colors backdrop-blur-sm border border-zinc-700/30"
                    onClick={() => setMessageText(suggestion)}
                  >
                    {suggestion}
                  </motion.button>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
