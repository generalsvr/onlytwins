'use client';

import { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';

interface VoiceCallInstructionProps {
  characterName: string;
}

export default function VoiceCallInstruction({
  characterName,
}: VoiceCallInstructionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  useEffect(() => {
    // Check if we've shown this before
    const hasShown = localStorage.getItem('voiceCallInstructionShown');
    if (hasShown) {
      setHasShownBefore(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('voiceCallInstructionShown', 'true');
  };

  if (!isVisible || hasShownBefore) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-pink-500/30 rounded-lg p-4 shadow-lg max-w-xs z-40 animate-bounce">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-zinc-400 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-2">
          <Mic className="h-4 w-4 text-pink-400" />
        </div>
        <h3 className="font-bold text-pink-400">Voice Call Available!</h3>
      </div>
      <p className="text-sm text-zinc-300">
        Talk directly to {characterName} using your voice! Click the Voice Call
        button to start a conversation.
      </p>
    </div>
  );
}
