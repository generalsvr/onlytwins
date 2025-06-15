import React from "react";
import { motion } from 'framer-motion';
import {Send} from "lucide-react";

interface ChatInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  recordingTime: number;
  isAuthenticated: boolean;
  onAuthRequired: (mode: 'login' | 'signup') => void;
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
  onAuthRequired,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t border-zinc-800">
      <div className="flex items-center">
        <div
          className={`relative p-2 mr-2 ${
            isRecording ? 'text-pink-500' : 'text-zinc-400 hover:text-white'
          }`}
          onClick={
            isRecording
              ? stopRecording
              : () => {
                  if (!isAuthenticated) {
                    onAuthRequired('signup');
                    return;
                  }
                  startRecording();
                }
          }
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          {isRecording ? (
            <motion.div
              className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <span className="text-white text-xs">
                {Math.floor(recordingTime)}s
              </span>
            </motion.div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-zinc-800 rounded-full py-3 px-4 pr-12"
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessageText(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSendMessage()
            }
          />
        </div>
        <button
          className={`p-3 ml-2 rounded-full ${
            messageText.trim() ? 'bg-pink-500 hover:bg-pink-600' : 'bg-zinc-700'
          } text-white transition-colors`}
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
