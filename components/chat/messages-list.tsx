import { Message } from '@/lib/types/chat';
import MessageItem from '@/components/chat/message-item';
import SafeImage from '@/components/safe-image';
import {RefObject} from "react";
import { AgentResponse } from '@/lib/types/agents';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  character: AgentResponse;
  togglePlayPause: (messageId: number) => void;
  playingStates: { [key: number]: boolean };
  messagesEndRef: RefObject<HTMLDivElement | null>;
}
export default function MessageList({
  messages,
  isTyping,
  character,
  togglePlayPause,
  playingStates,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-7">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          character={character}
          togglePlayPause={togglePlayPause}
          playingStates={playingStates}
        />
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
            <SafeImage
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${character.meta.profileImage}` || ""}
              alt={character.name}
              fill
              className="object-cover"
              fallbackSrc={`/placeholder.svg?height=32&width=32&query=${encodeURIComponent(character.name)}`}
            />
          </div>
          <div className="bg-zinc-800 text-white rounded-tl-none rounded-2xl p-3">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
