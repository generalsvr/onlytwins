import { motion } from 'framer-motion';
import SafeImage from '@/components/safe-image';
import React from 'react';
import { Character } from '@/lib/types/characters';
import { CharacterChatData } from '@/components/chat/character-chat-template';

interface PaywallProps {
  isMobile: boolean;
  character: CharacterChatData;
  setShowPaywall: (state: boolean) => void;
  handlePurchaseContent: () => void;
}
export default function PayWall({
  isMobile,
  character,
  setShowPaywall,
  handlePurchaseContent,
}: PaywallProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        className={`bg-zinc-900 rounded-xl overflow-hidden ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`relative ${isMobile ? 'h-48' : 'h-64'}`}>
          <SafeImage
            src={character.image}
            alt="Premium content preview"
            fill
            className="object-cover blur-sm"
            fallbackSrc="/placeholder.svg?key=dkokh"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">Unlock Premium Content</h3>
              <p className="text-zinc-300 text-sm mt-1">
                Get exclusive photos from {character.name}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Premium Photo</h3>
          <p className="text-zinc-400 text-sm mb-4">
            {character.name} wants to share a special photo with you. Unlock it
            now!
          </p>
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-sm text-zinc-400">Price</p>
              <p className="font-bold">50 GPT</p>
            </div>
            <div className="flex-1 bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-sm text-zinc-400">Type</p>
              <p className="font-bold">Photo</p>
            </div>
          </div>
          <button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-lg font-medium"
            onClick={handlePurchaseContent}
          >
            Unlock Now
          </button>
          <button
            className="w-full bg-transparent py-3 text-zinc-400 text-sm"
            onClick={() => setShowPaywall(false)}
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
