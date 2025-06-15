'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '@/components/safe-image';
import { useConversations } from '@/lib/hooks/useConversations';
import { useAuthStore } from '@/lib/stores/authStore';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ChatPageProps {
  onOpenChat?: (characterId: number) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: (mode: 'login' | 'signup') => void;
}

export default function ChatPage({}: ChatPageProps) {
  const { user, isAuthenticated } = useAuthStore((state) => state);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(true);
  const router = useRouter();
  const { conversations, isLoading, error } = useConversations(
    user?.id || null
  );

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`${isMobile && 'pb-20'}`}>
      {/* Header */}
      <div
        className={`${isMobile ? 'sticky top-0 z-10 bg-black p-4 border-b border-zinc-800' : 'mb-8'}`}
      >
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
          Messages
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="bg-zinc-800 w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters - Mobile */}
        {isMobile && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Chats
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === 'unread'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === 'online'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('online')}
            >
              Online
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
                activeFilter === 'filter'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('filter')}
            >
              <Filter size={16} className="mr-1" /> More Filters
            </button>
          </div>
        )}

        {/* Filters - Desktop */}
        {!isMobile && (
          <div className="flex space-x-3 mb-6">
            <button
              className={`px-6 py-2 rounded-lg ${
                activeFilter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Chats
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${
                activeFilter === 'unread'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${
                activeFilter === 'online'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('online')}
            >
              Online
            </button>
            <button
              className={`px-6 py-2 rounded-lg flex items-center ${
                activeFilter === 'filter'
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
              onClick={() => setActiveFilter('filter')}
            >
              <Filter size={16} className="mr-2" /> More Filters
            </button>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">
            Error loading conversations: {error.message}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={'flex flex-col gap-4'}>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div className="card-container flex flex-col gap-4 p-4 animate-skeleton rounded-xl relative">
                <div className="flex items-center gap-4   rounded-lg bg-transparent ">
                  <div className="avatar-placeholder w-[65px] h-[65px] bg-gray-700 rounded-full "></div>
                  <div className="flex-1">
                    <div className="name-placeholder h-4 bg-gray-700 rounded w-1/3 mb-2 "></div>
                    <div className="message-placeholder h-4 bg-gray-700 rounded w-2/3 "></div>
                  </div>
                </div>
                <div className="timestamp-placeholder h-4 bg-gray-700 rounded w-32 absolute right-4 top-4 "></div>
              </div>
            ))}
        </div>
      )}

      {/* Chat List */}
      {!isLoading && !error && conversations.length === 0 && (
        <div className="text-center py-4">
          <p className="text-zinc-400">No conversations found</p>
        </div>
      )}

      {!isLoading && !error && conversations.length > 0 && (
        <div
          className={
            isMobile ? 'divide-y divide-zinc-800' : 'grid grid-cols-1 gap-3'
          }
        >
          {conversations.map((chat) => (
            <motion.div
              key={chat.id}
              className={`${isMobile ? 'p-4' : 'p-4 bg-zinc-900 rounded-xl'} flex items-center cursor-pointer`}
              onClick={() =>
                router.push(
                  `/chat/${chat.agent.id}?conversationId=${chat.conversationId}`
                )
              }
              whileTap={{ scale: 0.98 }}
              whileHover={!isMobile ? { scale: 1.02 } : undefined}
            >
              <div className="relative">
                <div
                  className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full overflow-hidden`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${chat.agent.meta.profileImage}`}
                  />
                </div>
                {/* Note: API doesn't provide online status */}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3
                    className={`${isMobile ? 'font-semibold' : 'text-lg font-semibold'}`}
                  >
                    {chat.agent.name}
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {formatDate(chat.lastActivity)}
                  </span>
                </div>
                <p
                  className={`${isMobile ? 'text-sm' : ''} text-zinc-400 truncate`}
                >
                  {chat.lastMessage || 'No messages yet'}
                </p>
              </div>
              {/*{chat.last_message?.status !== 'read' && (*/}
              {/*  <div className="ml-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">*/}
              {/*    <span className="text-xs font-medium">1</span>*/}
              {/*  </div>*/}
              {/*)}*/}
            </motion.div>
          ))}
        </div>
      )}

      {/* New Chat Button */}
      <motion.button
        className={`${isMobile ? 'fixed bottom-20 right-4 w-14 h-14' : 'fixed bottom-8 right-8 w-16 h-16'} rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Plus size={isMobile ? 24 : 28} />
      </motion.button>
    </div>
  );
}
