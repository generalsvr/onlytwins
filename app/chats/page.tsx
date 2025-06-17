'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MessageCircle, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ConversationSummary } from '@/lib/types/chat';

interface ChatPageProps {
  conversations: ConversationSummary[] | null;
  error: Error | null;
}

export default function ChatPage({ conversations, error }: ChatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations?.filter(chat =>
    chat.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filters = [
    { id: 'all', label: 'All Chats', icon: MessageCircle },
    { id: 'unread', label: 'Unread', icon: Clock },
    { id: 'online', label: 'Online', icon: Star },
    { id: 'filter', label: 'More Filters', icon: Filter },
  ];

  return (
    <div className={`min-h-screen ${isMobile && 'pb-20'}`}>
      {/* Header with backdrop blur */}
      <div className="sticky top-0 z-50">
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0" />

        <div className="relative p-4">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white`}>
                Messages
              </h1>
              <div className="text-sm text-zinc-400">
                {conversations?.length || 0} conversations
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div
                className={`
                  relative flex items-center rounded-2xl transition-all duration-300
                  ${isFocused
                  ? 'bg-zinc-800/80 ring-1 ring-pink-500/50 shadow-lg shadow-pink-500/10'
                  : 'bg-zinc-800/60 hover:bg-zinc-800/70'
                }
                  backdrop-blur-sm border border-zinc-700/30
                `}
              >
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <Search size={18} className={`transition-colors ${isFocused ? 'text-pink-400' : 'text-zinc-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className={`flex ${isMobile ? 'space-x-2 overflow-x-auto pb-2' : 'space-x-3'}`}>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`
                    flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200
                    backdrop-blur-sm border
                    ${activeFilter === filter.id
                    ? 'bg-gradient-to-r from-pink-500/90 to-purple-600/90 text-white border-pink-400/30 shadow-lg shadow-pink-500/25'
                    : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/60 border-zinc-700/30'
                  }
                  `}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <filter.icon size={16} className="mr-2" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-red-400" />
            </div>
            <p className="text-red-400 text-lg font-medium mb-2">
              Something went wrong
            </p>
            <p className="text-zinc-400">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && conversations && conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No conversations yet
            </h3>
            <p className="text-zinc-400 mb-6">
              Start chatting with AI characters to see your conversations here
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-colors">
              Start New Chat
            </button>
          </div>
        )}

        {/* Chat List */}
        {!error && filteredConversations && filteredConversations.length > 0 && (
          <div className="space-y-3">
            {filteredConversations.map((chat, index) => (
              <div
                key={`chat-${chat.id}-${index}`}
                className={`
                  group relative p-4 rounded-2xl cursor-pointer transition-all duration-200
                  bg-zinc-800/40 hover:bg-zinc-800/60 backdrop-blur-sm
                  border border-zinc-700/30 hover:border-zinc-600/50
                  hover:shadow-lg hover:shadow-zinc-900/20
                  ${isMobile ? '' : 'hover:scale-[1.01]'}
                `}
                onClick={() =>
                  router.push(
                    `/chat/${chat.agent.id}?conversationId=${chat.conversationId}`
                  )
                }
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`
                      ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} 
                      rounded-full overflow-hidden ring-2 ring-zinc-600/30 
                      group-hover:ring-pink-500/30 transition-all duration-300
                    `}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${chat.agent.meta.profileImage}`}
                        alt={chat.agent.name}
                        className="object-cover"
                      />
                    </div>

                    {/* Online indicator (mock) */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 shadow-lg">
                      <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`
                        ${isMobile ? 'font-semibold' : 'text-lg font-semibold'} 
                        text-white group-hover:text-pink-300 transition-colors truncate
                      `}>
                        {chat.agent.name}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs text-zinc-400">
                          {formatDate(chat.lastActivity)}
                        </span>
                        <Star size={14} className="text-yellow-400" />
                      </div>
                    </div>

                    <p className={`
                      ${isMobile ? 'text-sm' : ''} 
                      text-zinc-400 truncate group-hover:text-zinc-300 transition-colors
                    `}>
                      {chat.lastMessage || 'No messages yet'}
                    </p>

                    {/* Conversation stats */}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-zinc-500 flex items-center">
                        <MessageCircle size={12} className="mr-1" />
                        Active chat
                      </span>
                    </div>
                  </div>

                  {/* Unread indicator (if needed) */}
                  {/* Uncomment when you have unread status
                  {chat.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {chat.unreadCount}
                      </span>
                    </div>
                  )}
                  */}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* No search results */}
        {!error && searchQuery && filteredConversations?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-zinc-400">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}