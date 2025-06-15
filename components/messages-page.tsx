'use client';

import { useState } from 'react';
import { Search, MoreVertical, Star } from 'lucide-react';
import SafeImage from './safe-image';

interface MessagesPageProps {
  onOpenChat: (characterId: number) => void;
}

interface Conversation {
  id: number;
  characterId: number;
  characterName: string;
  characterImage: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isPinned?: boolean;
}

const conversations: Conversation[] = [
  {
    id: 1,
    characterId: 1,
    characterName: 'Claire',
    characterImage: '/claire-additional.png',
    lastMessage: "Can't wait to chat more with you! 😘",
    time: 'Now',
    unread: 2,
    online: true,
    isPinned: true,
  },
  {
    id: 2,
    characterId: 2,
    characterName: 'JennyPinky',
    characterImage: '/jennypinky-new-profile.png',
    lastMessage: 'I miss you! When are you coming back?',
    time: '2 min',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    characterId: 3,
    characterName: 'Valeria & Camila',
    characterImage: '/valeria-camila-new.png',
    lastMessage: 'We have a surprise for you next time...',
    time: '1 hr',
    unread: 1,
    online: false,
  },
  {
    id: 4,
    characterId: 4,
    characterName: 'Lee',
    characterImage: '/lee-new-profile.png',
    lastMessage: "Thanks for the gifts! You're so sweet.",
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    characterId: 5,
    characterName: 'Akari',
    characterImage: '/akari-new-profile.png',
    lastMessage: "I'm always here whenever you need me.",
    time: '2 days',
    unread: 0,
    online: false,
  },
];

export default function MessagesPage({ onOpenChat }: MessagesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((convo) =>
    convo.characterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter(
    (convo) => convo.isPinned
  );
  const regularConversations = filteredConversations.filter(
    (convo) => !convo.isPinned
  );

  const handleOpenChat = (characterId: number) => {
    onOpenChat(characterId);
  };

  const renderConversation = (convo: Conversation) => (
    <div
      key={convo.id}
      className="flex items-center p-3 rounded-xl transition-colors hover:bg-zinc-900"
      onClick={() => handleOpenChat(convo.characterId)}
    >
      <div className="relative">
        <div className="relative w-14 h-14 rounded-full overflow-hidden">
          <SafeImage
            src={convo.characterImage}
            alt={convo.characterName || 'Character'}
            fill
            className="object-cover"
            fallbackSrc={`/abstract-geometric-shapes.png?height=200&width=200&query=${encodeURIComponent(
              convo.characterName || 'character'
            )}`}
          />
        </div>
        {convo.online && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
        )}
        {convo.isPinned && (
          <div className="absolute -right-1 -top-1 text-yellow-400">
            <Star size={16} fill="currentColor" />
          </div>
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{convo.characterName}</h3>
          <span className="text-xs text-zinc-400">{convo.time}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-zinc-400 truncate max-w-[180px]">
            {convo.lastMessage}
          </p>
          {convo.unread > 0 && (
            <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {convo.unread}
            </div>
          )}
        </div>
      </div>
      <button className="p-2 text-zinc-400">
        <MoreVertical size={20} />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl min-h-screen bg-black text-white pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-zinc-800 rounded-full py-3 px-4 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
        </div>

        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <>
            <div className="text-xs text-zinc-500 uppercase mb-2">Pinned</div>
            {pinnedConversations.map(renderConversation)}
            <div className="border-b border-zinc-800 my-4"></div>
          </>
        )}

        {/* Regular Conversations */}
        <div className="text-xs text-zinc-500 uppercase mb-2">Messages</div>
        {regularConversations.length > 0 ? (
          regularConversations.map(renderConversation)
        ) : (
          <div className="text-center py-10 text-zinc-400">
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
