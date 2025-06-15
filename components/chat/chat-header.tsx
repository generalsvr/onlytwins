import {
  ArrowLeft,
  Camera,
  Gift,
  ImageIcon,
  MoreHorizontal,
  Paperclip,
} from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { AgentResponse } from '@/lib/types/agents';

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
  return (
    <>
      <header className="flex items-center p-4 border-b border-zinc-800">
        {isMobile && (
          <button className="mr-3" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
        )}
        <div
          className="flex items-center flex-1 cursor-pointer"
          onClick={handleViewProfile}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <SafeImage
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}` || ""}
              alt={character.name}
              fill
              className="object-cover"
              fallbackSrc={`/placeholder.svg?height=40&width=40&query=${encodeURIComponent(character.name)}`}
            />
            {/*{character.isOnline && (*/}
            {/*  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>*/}
            {/*)}*/}
          </div>
          <div>
            <h2 className="font-semibold">{character.name}</h2>
            {/*<p className="text-xs text-zinc-400">{character.lastSeen}</p>*/}
          </div>
        </div>
        <div className="ml-auto">
          {isMobile ? (
            <button onClick={toggleOptions}>
              <MoreHorizontal size={24} />
            </button>
          ) : (
            <div className="flex space-x-4">
              <button className="text-zinc-400 hover:text-white">
                <ImageIcon size={20} />
              </button>
              <button className="text-zinc-400 hover:text-white">
                <Camera size={20} />
              </button>
              <button
                className="text-zinc-400 hover:text-white"
                onClick={handleRequestPhoto}
              >
                <Paperclip size={20} />
              </button>
              <button className="text-zinc-400 hover:text-white">
                <Gift size={20} />
              </button>
            </div>
          )}
        </div>
      </header>
      {isMobile && showOptions && (
        <div className="bg-zinc-800 p-4 flex justify-around">
          <button className="flex flex-col items-center text-xs">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
              <ImageIcon size={20} />
            </div>
            Photo
          </button>
          <button className="flex flex-col items-center text-xs">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
              <Camera size={20} />
            </div>
            Roleplay
          </button>
          <button
            className="flex flex-col items-center text-xs"
            onClick={handleRequestPhoto}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
              <Paperclip size={20} />
            </div>
            NSFW
          </button>
          <button className="flex flex-col items-center text-xs">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
              <Gift size={20} />
            </div>
            Gift
          </button>
        </div>
      )}
    </>
  );
}
