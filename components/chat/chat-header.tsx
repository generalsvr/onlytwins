import {
  ArrowLeft,
  Camera,
  Gift,
  ImageIcon,
  MoreHorizontal,
  Paperclip,
  Heart,
  Star,
  Zap,
  Coins,
} from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { AgentResponse } from '@/lib/types/agents';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TokensModal from '@/components/modals/tokens';
import { useModalStore } from '@/lib/stores/modalStore';

interface ChatHeaderProps {
  character: AgentResponse;
  onBack: () => void;
  isMobile: boolean;
  toggleOptions: () => void;
  showOptions: boolean;
  handleViewProfile: () => void;
  handleRequestPhoto: () => void;
  balance: number;
}

export default function ChatHeader({
  character,
  onBack,
  isMobile,
  toggleOptions,
  showOptions,
  handleViewProfile,
  handleRequestPhoto,
  balance,
}: ChatHeaderProps) {
  const [isOnline] = useState(true);
  const [lastSeen] = useState('Active now');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);

  const actionButtons = [
    {
      id: 'photo',
      icon: ImageIcon,
      label: 'Photo',
      color: 'text-blue-400 hover:text-blue-300',
      bgColor: 'bg-blue-500/20 hover:bg-blue-500/30',
      action: () => 'Photo',
    },
    {
      id: 'roleplay',
      icon: Camera,
      label: 'Roleplay',
      color: 'text-purple-400 hover:text-purple-300',
      bgColor: 'bg-purple-500/20 hover:bg-purple-500/30',
      action: () => 'Roleplay',
    },
    {
      id: 'nsfw',
      icon: Paperclip,
      label: 'NSFW',
      color: 'text-red-400 hover:text-red-300',
      bgColor: 'bg-red-500/20 hover:bg-red-500/30',
      action: handleRequestPhoto,
    },
    {
      id: 'gift',
      icon: Gift,
      label: 'Gift',
      color: 'text-yellow-400 hover:text-yellow-300',
      bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30',
      action: () => 'Gift',
    },
  ];

  return (
    <div
      className={`absolute absolute-center-x-top z-50 w-[75%] ${isMobile && 'w-[95%]'}`}
    >
      {/* Main Header */}
      <header className="flex items-center p-3 backdrop-blur-md bg-gradient-to-b from-zinc-900/80 via-zinc-900/40 to-transparent w-full border border-zinc-700/30 rounded-2xl">
        <div className="flex items-center w-full min-w-0">
          <button onClick={() => router.back()} className="flex-shrink-0 mr-3 p-2 rounded-xl bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-300 transition-all duration-200">
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center flex-1 min-w-0 cursor-pointer group">
            <div className="flex-shrink-0 relative">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-500/30 group-hover:ring-pink-500/50 transition-all duration-300">
                <img
                  src={character.meta.profileImage}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="ml-3 flex-1 min-w-0">
              <h2 onClick={() => router.push(`/character/${character.id}`)} className="font-semibold text-white text-base truncate group-hover:text-pink-300 transition-colors">
                {character.name}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-1">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5" />
                  Active now
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <button
              onClick={() => {
                openModal({
                  content: <TokensModal />,
                });
              }}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 rounded-xl border border-yellow-500/30 transition-all duration-200 group/balance"
            >
              <Coins
                size={14}
                className="text-yellow-400 mr-2 group-hover/balance:scale-110 transition-transform"
              />
              <span className="text-sm text-yellow-300 font-medium">
                {balance.toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile options panel */}
      <AnimatePresence>
        {isMobile && showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-zinc-800/60 backdrop-blur-xl border-b border-zinc-700/30 overflow-hidden rounded-b-2xl"
          >
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {actionButtons.map((button, index) => (
                  <button
                    key={button.id}
                    className="flex flex-col items-center space-y-2 p-2 sm:p-3 rounded-xl hover:bg-zinc-600/50 transition-all duration-200 group"
                    onClick={button.action}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.3s ease-out forwards',
                    }}
                  >
                    <div
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm
                        ${button.bgColor} group-hover:scale-110
                      `}
                    >
                      <button.icon
                        size={18}
                        className={`${button.color} sm:w-5 sm:h-5`}
                      />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium text-center">
                      {button.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Additional quick actions */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-600/50">
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-full transition-colors backdrop-blur-sm">
                    <Heart size={14} className="text-pink-400 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm text-pink-300">
                      Like
                    </span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-colors backdrop-blur-sm">
                    <Zap size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm text-purple-300">
                      Boost
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
