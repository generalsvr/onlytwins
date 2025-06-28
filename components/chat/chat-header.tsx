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
} from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { AgentResponse } from '@/lib/types/agents';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  character: AgentResponse;
  onBack: () => void;
  isMobile: boolean;
  toggleOptions: () => void;
  showOptions: boolean;
  handleViewProfile: () => void;
  handleRequestPhoto: () => void;
}

export default function ChatHeader({
  character,
  onBack,
  isMobile,
  toggleOptions,
  showOptions,
  handleViewProfile,
  handleRequestPhoto,
}: ChatHeaderProps) {
  const [isOnline] = useState(true);
  const [lastSeen] = useState('Active now');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const router = useRouter()

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
      <header className="relative flex items-center p-2 sm:p-3 backdrop-blur-md bg-gradient-to-b from-zinc-900/80 via-zinc-900/40 to-transparent w-full border border-zinc-700/30 rounded-2xl">
        <div className="flex items-center w-full min-w-0">
          {/* Back button */}
          <button
            className="flex-shrink-0 mr-2 sm:mr-3 p-2 sm:p-3 rounded-xl bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-300 hover:text-white border border-zinc-600/30 cursor-pointer transition-all duration-200"
            onClick={onBack}
          >
            <ArrowLeft size={isMobile ? 16 : 20} className="text-zinc-300" />
          </button>

          {/* Profile section */}
          <div
            className="flex items-center flex-1 min-w-0 cursor-pointer group"
            onClick={handleViewProfile}
          >
            <div className="flex-shrink-0 relative">
              <div className="relative w-12 h-12  rounded-full overflow-hidden ring-2 ring-pink-500/30 group-hover:ring-pink-500/50 transition-all duration-300">
                <img
                  src={character.meta.profileImage || ''}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="ml-2 sm:ml-3 flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                <h2 onClick={() => router.push(`/character/${character.id}`)} className="font-semibold text-white text-sm sm:text-base lg:text-lg truncate group-hover:text-pink-300 transition-colors min-w-0 flex-1">
                  {character.name}
                </h2>
                {/*<Star*/}
                {/*  size={12}*/}
                {/*  className="text-yellow-400 flex-shrink-0 sm:w-4 sm:h-4"*/}
                {/*/>*/}
              </div>
              <div className="flex items-center space-x-2">
                {/* Дополнительная информация может быть добавлена здесь */}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {/*<div className="flex-shrink-0 ml-2 sm:ml-4">*/}
          {/*  {isMobile ? (*/}
          {/*    <button*/}
          {/*      onClick={toggleOptions}*/}
          {/*      className="p-2 rounded-full hover:bg-zinc-700/50 transition-colors relative"*/}
          {/*    >*/}
          {/*      <MoreHorizontal size={18} className="text-zinc-300" />*/}
          {/*      {showOptions && (*/}
          {/*        <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />*/}
          {/*      )}*/}
          {/*    </button>*/}
          {/*  ) : (*/}
          {/*    <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">*/}
          {/*      {actionButtons.map((button) => (*/}
          {/*        <div key={button.id} className="relative">*/}
          {/*          <button*/}
          {/*            className={`*/}
          {/*              p-1.5 sm:p-2 lg:p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm*/}
          {/*              ${button.bgColor} ${button.color}*/}
          {/*              hover:scale-105 active:scale-95*/}
          {/*            `}*/}
          {/*            onClick={button.action}*/}
          {/*            onMouseEnter={() => setShowTooltip(button.id)}*/}
          {/*            onMouseLeave={() => setShowTooltip(null)}*/}
          {/*          >*/}
          {/*            <button.icon*/}
          {/*              size={16}*/}
          {/*              className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"*/}
          {/*            />*/}
          {/*          </button>*/}

          {/*          /!* Tooltip *!/*/}
          {/*          {showTooltip === button.id && (*/}
          {/*            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-lg border border-zinc-700/50 whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95 duration-200">*/}
          {/*              {button.label}*/}
          {/*              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />*/}
          {/*            </div>*/}
          {/*          )}*/}
          {/*        </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*</div>*/}
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
