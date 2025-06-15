import SafeImage from "@/components/safe-image";
import React from "react";
import {Pause, Play} from "lucide-react";
import {Message} from "@/lib/types/chat";
import { AgentResponse } from '@/lib/types/agents';


interface MessageItemProps {
  message: Message;
  character: AgentResponse;
  togglePlayPause: (messageId: number) => void;
  playingStates: { [key: number]: boolean };
}
export default function MessageItem({
  message,
  character,
  togglePlayPause,
  playingStates,
}: MessageItemProps) {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {/*{message.sender === 'character' && (*/}
      {/*  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">*/}
      {/*    <SafeImage*/}
      {/*      src={character.image}*/}
      {/*      alt={character.name}*/}
      {/*      fill*/}
      {/*      className="object-cover"*/}
      {/*      fallbackSrc={`/placeholder.svg?height=32&width=32&query=${encodeURIComponent(character.name)}`}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className="max-w-[75%]">
        {message.text && (
          <div
            className={`p-3 rounded-2xl ${
              message.sender === 'agent'
                ? 'bg-pink-500 text-white rounded-tl-none'
                : 'bg-zinc-800 text-white rounded-tr-none'
            }`}
          >
            <p className="whitespace-pre-line">{message.text}</p>
          </div>
        )}
        {message?.image	 && (
          <div
            className={`rounded-2xl overflow-hidden ${
              message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
            }`}
          >
            <img
              src={`${message?.image}`}
              alt="Shared image"
              className={"mt-5 rounded w-[350px] object-cover"}
            />

          </div>
        )}
        {/*{message.audio && (*/}
        {/*  <div*/}
        {/*    className={`rounded-2xl overflow-hidden ${*/}
        {/*      message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'*/}
        {/*    }`}*/}
        {/*  >*/}
        {/*    <div className="bg-zinc-800 p-2 rounded-lg flex items-center space-x-2">*/}
        {/*      <button*/}
        {/*        onClick={() => togglePlayPause(message?.id)}*/}
        {/*        className="text-pink-500 hover:text-pink-600"*/}
        {/*      >*/}
        {/*        {playingStates[message.id] ? (*/}
        {/*          <Pause size={20} />*/}
        {/*        ) : (*/}
        {/*          <Play size={20} />*/}
        {/*        )}*/}
        {/*      </button>*/}
        {/*      <div className="flex-1">*/}
        {/*        <div id={`waveform-${message.id}`} className="w-full h-10" />*/}
        {/*        <div className="flex justify-between text-xs text-zinc-400 mt-1">*/}
        {/*          <span>{message.time}</span>*/}
        {/*          <span id={`duration-${message.id}`}>0:00</span>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*      <audio*/}
        {/*        id={`audio-${message.id}`}*/}
        {/*        src={message?.audio}*/}
        {/*        className="hidden"*/}
        {/*        onLoadedMetadata={(*/}
        {/*          e: React.SyntheticEvent<HTMLAudioElement>*/}
        {/*        ) => {*/}
        {/*          const audio = e.target as HTMLAudioElement;*/}
        {/*          const durationElement = document.getElementById(*/}
        {/*            `duration-${message.id}`*/}
        {/*          );*/}
        {/*          if (durationElement) {*/}
        {/*            const minutes = Math.floor(audio.duration / 60);*/}
        {/*            const seconds = Math.floor(audio.duration % 60);*/}
        {/*            durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;*/}
        {/*          }*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
        <p className="text-xs text-zinc-500 mt-1">{message.time}</p>
      </div>
    </div>
  );
}
