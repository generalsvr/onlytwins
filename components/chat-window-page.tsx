'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  ImageIcon,
  Gift,
  Camera,
  Paperclip,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from './safe-image';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'character';
  time: string;
  image?: string;
}

interface Character {
  id: number;
  name: string;
  image: string;
  isOnline: boolean;
  lastSeen: string;
}

interface ChatWindowPageProps {
  characterId: number;
  onClose: () => void;
}

// Sample characters data
const characters: Character[] = [
  {
    id: 1,
    name: 'Claire',
    image: '/claire-selfie.jpeg',
    isOnline: true,
    lastSeen: 'Active now',
  },
  {
    id: 2,
    name: 'JennyPinky',
    image: '/jennypinky-profile.png',
    isOnline: true,
    lastSeen: 'Active now',
  },
  {
    id: 3,
    name: 'Valeria & Camila',
    image: '/valeria-camila-profile.png',
    isOnline: false,
    lastSeen: 'Last seen 2h ago',
  },
];

export default function ChatWindowPage({
  characterId,
  onClose,
}: ChatWindowPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get character data and initial messages
  useEffect(() => {
    const selectedCharacter =
      characters.find((c) => c.id === characterId) || characters[0];
    setCharacter(selectedCharacter);

    // Sample initial messages based on character
    const initialMessages: Message[] = [
      {
        id: 1,
        text: `Hey there! I'm ${selectedCharacter.name}. How are you doing today? 😊`,
        sender: 'character',
        time: '10:30 AM',
      },
    ];

    if (selectedCharacter.id === 1) {
      initialMessages.push({
        id: 2,
        text: "I just finished my yoga session and I'm feeling amazing! Want to see a pic?",
        sender: 'character',
        time: '10:32 AM',
      });
    } else if (selectedCharacter.id === 2) {
      initialMessages.push({
        id: 2,
        text: "I'm so excited to show you my new cosplay! Do you like anime too?",
        sender: 'character',
        time: '10:32 AM',
      });
    } else if (selectedCharacter.id === 3) {
      initialMessages.push({
        id: 2,
        text: "We're Valeria and Camila, twin sisters from Spain! Double the fun chatting with you today!",
        sender: 'character',
        time: '10:32 AM',
      });
    }

    setMessages(initialMessages);
  }, [characterId]);

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newUserMessage]);
    setMessageText('');

    // Simulate character typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      // Generate character response based on user message
      let responseText = '';
      if (
        messageText.toLowerCase().includes('hi') ||
        messageText.toLowerCase().includes('hello')
      ) {
        responseText = `Hi there! It's great to hear from you! How's your day going?`;
      } else if (
        messageText.toLowerCase().includes('photo') ||
        messageText.toLowerCase().includes('pic') ||
        messageText.toLowerCase().includes('picture')
      ) {
        // Show paywall for photo request
        setShowPaywall(true);
        return;
      } else if (messageText.toLowerCase().includes('how are you')) {
        responseText = `I'm doing amazing today! Just been thinking about you actually. What have you been up to?`;
      } else {
        responseText = `That's interesting! Tell me more about it. I love getting to know you better.`;
      }

      // Special response for twins
      if (character?.id === 3) {
        responseText = `Valeria: ${responseText}\n\nCamila: Yes, we'd love to hear more about that! 💕`;
      }

      const newCharacterMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'character',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prevMessages) => [...prevMessages, newCharacterMessage]);
    }, 1500);
  };

  const handleRequestPhoto = () => {
    setShowPaywall(true);
  };

  const handlePurchaseContent = () => {
    // In a real app, this would process payment
    setShowPaywall(false);

    // Add character message with photo
    setTimeout(() => {
      const photoMessage: Message = {
        id: Date.now(),
        text: '',
        sender: 'character',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        image:
          character?.id === 1
            ? '/claire-couch.jpeg'
            : character?.id === 2
              ? '/brown-haired-anime-girl.png'
              : '/elegant-woman-red.png',
      };

      setMessages((prevMessages) => [...prevMessages, photoMessage]);

      // Follow up message
      setTimeout(() => {
        let followUpText = 'What do you think? 😘';

        // Special message for twins
        if (character?.id === 3) {
          followUpText =
            'Valeria: Hope you like our photo! 💋\n\nCamila: We took it just for you! 😘';
        }

        const followUpMessage: Message = {
          id: Date.now() + 1,
          text: followUpText,
          sender: 'character',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prevMessages) => [...prevMessages, followUpMessage]);
      }, 1000);
    }, 1000);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  if (!character) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div
      className={`h-screen flex ${isMobile ? 'flex-col' : 'pt-20 max-w-6xl mx-auto'} bg-black text-white`}
    >
      {isMobile ? (
        // Mobile layout
        <>
          {/* Header */}
          <header className="flex items-center p-4 border-b border-zinc-800">
            <button className="mr-3" onClick={onClose}>
              <ArrowLeft size={24} />
            </button>
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <SafeImage
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                fallbackSrc={`/placeholder.svg?height=40&width=40&query=${encodeURIComponent(character.name)}`}
              />
              {character.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{character.name}</h2>
              <p className="text-xs text-zinc-400">{character.lastSeen}</p>
            </div>
            <div className="ml-auto">
              <button onClick={toggleOptions}>
                <MoreHorizontal size={24} />
              </button>
            </div>
          </header>

          {/* Chat Options */}
          {showOptions && (
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'character' && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <SafeImage
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover"
                      fallbackSrc={`/placeholder.svg?height=32&width=32&query=${encodeURIComponent(character.name)}`}
                    />
                  </div>
                )}
                <div className="max-w-[75%]">
                  {message.text && (
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-pink-500 text-white rounded-tr-none'
                          : 'bg-zinc-800 text-white rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>
                  )}
                  {message.image && (
                    <div
                      className={`rounded-2xl overflow-hidden ${
                        message.sender === 'user'
                          ? 'rounded-tr-none'
                          : 'rounded-tl-none'
                      }`}
                    >
                      <SafeImage
                        src={message.image}
                        alt="Shared image"
                        width={240}
                        height={240}
                        className="object-cover"
                        fallbackSrc="/placeholder.svg?key=mm2fa"
                      />
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <SafeImage
                    src={character.image}
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

          {/* Input */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center">
              <button className="p-2 text-zinc-400 mr-2">
                <Mic size={24} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-zinc-800 rounded-full py-3 px-4 pr-12"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              <button
                className={`p-3 ml-2 rounded-full ${messageText.trim() ? 'bg-pink-500' : 'bg-zinc-700'} text-white`}
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        // Desktop layout
        <div className="flex h-[calc(100vh-80px)] rounded-xl overflow-hidden border border-zinc-800">
          {/* Left sidebar */}
          <div className="w-1/4 border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex items-center">
              <button className="mr-4" onClick={onClose}>
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>

            <div className="p-3">
              <div className="bg-zinc-800 rounded-full px-3 py-2 flex items-center">
                <Search size={16} className="text-zinc-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="bg-transparent border-none outline-none w-full text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className={`p-3 flex items-center hover:bg-zinc-900 cursor-pointer ${char.id === character.id ? 'bg-zinc-900' : ''}`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                    <SafeImage
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover"
                    />
                    {char.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{char.name}</h3>
                    <p className="text-xs text-zinc-400">{char.lastSeen}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          <div className="w-3/4 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <SafeImage
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
                {character.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{character.name}</h2>
                <p className="text-xs text-zinc-400">{character.lastSeen}</p>
              </div>
              <div className="ml-auto flex space-x-4">
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'character' && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <SafeImage
                        src={character.image}
                        alt={character.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="max-w-[60%]">
                    {message.text && (
                      <div
                        className={`p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-pink-500 text-white rounded-tr-none'
                            : 'bg-zinc-800 text-white rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.text}</p>
                      </div>
                    )}
                    {message.image && (
                      <div
                        className={`rounded-2xl overflow-hidden ${
                          message.sender === 'user'
                            ? 'rounded-tr-none'
                            : 'rounded-tl-none'
                        }`}
                      >
                        <SafeImage
                          src={message.image}
                          alt="Shared image"
                          width={320}
                          height={320}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-zinc-500 mt-2">{message.time}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <SafeImage
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-zinc-800 text-white rounded-tl-none rounded-2xl p-4">
                    <div className="flex space-x-2">
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

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              <div className="flex items-center">
                <button className="p-2 text-zinc-400 hover:text-white mr-2">
                  <Mic size={24} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-zinc-800 rounded-full py-3 px-4 pr-12"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                </div>
                <button
                  className={`p-3 ml-2 rounded-full ${messageText.trim() ? 'bg-pink-500 hover:bg-pink-600' : 'bg-zinc-700'} text-white transition-colors`}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            className={`bg-zinc-900 rounded-xl overflow-hidden ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={`relative ${isMobile ? 'h-48' : 'h-64'}`}>
              <SafeImage
                src={
                  character.id === 1
                    ? '/claire-black-outfit.jpeg'
                    : character.id === 2
                      ? '/brown-haired-anime-girl.png'
                      : '/elegant-woman-red.png'
                }
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
                {character.name} wants to share a special photo with you. Unlock
                it now!
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
      )}
    </div>
  );
}
