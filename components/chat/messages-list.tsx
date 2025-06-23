import { Message } from '@/lib/types/chat';
import MessageItem from '@/components/chat/message-item';
import SafeImage from '@/components/safe-image';
import { RefObject } from 'react';
import { AgentResponse } from '@/lib/types/agents';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  character: AgentResponse;
  togglePlayPause: (messageId: number) => void;
  playingStates: { [key: number]: boolean };
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  isMobile: boolean;
}

export default function MessageList({
  messages,
  isTyping,
  isLoadingMore = false,
  hasMore = false,
  character,
  togglePlayPause,
  playingStates,
  messagesEndRef,
  onScroll,
  isMobile,
}: MessageListProps) {
  return (
    <div
      className={`flex-1 h-[100%] py-32 overflow-y-auto hide-scrollbar ${isMobile ? 'w-[100%]' : 'w-[90%]'}  mx-auto`}
      onScroll={onScroll}
    >
      <div className="relative space-y-6 px-4 py-8">
        {/* Индикатор загрузки старых сообщений */}
        <AnimatePresence>
          {isLoadingMore && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center py-4"
            >
              <div className="flex items-center space-x-2 text-zinc-400">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{
                        y: [-2, -6, -2],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm">Loading older messages...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Сообщение о том, что это начало беседы */}
        {!hasMore && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center py-4"
          >
            <div className="text-zinc-500 text-sm bg-zinc-800/50 px-4 py-2 rounded-full">
              Beginning of conversation
            </div>
          </motion.div>
        )}

        {/* Welcome message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-pink-500/20">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}` ||
                  ''
                }
                alt={character.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Chat with {character.name}
            </h3>
            <p className="text-zinc-400 max-w-md">
              Start a conversation! Send a message or use voice recording to
              begin.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
            >
              <MessageItem
                message={message}
                character={character}
                togglePlayPause={togglePlayPause}
                playingStates={playingStates}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start items-end space-x-3"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-pink-500/30">
                <SafeImage
                  src={
                    `${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}` ||
                    ''
                  }
                  alt={character.name}
                  fill
                  className="object-cover"
                  fallbackSrc={`/placeholder.svg?height=32&width=32&query=${encodeURIComponent(character.name)}`}
                />
              </div>
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white rounded-2xl rounded-bl-md p-4 shadow-lg">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{
                        y: [-2, -6, -2],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
