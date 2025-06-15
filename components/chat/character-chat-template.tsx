'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Send,
  ImageIcon,
  Gift,
  Camera,
  Paperclip,
  MoreHorizontal,
  Play,
  Pause,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '../safe-image';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/lib/stores/modalStore';
import FailedPayment from '@/components/modals/failed-payment';
import AuthModal from '@/components/auth/auth-modal';
import WaveSurfer from 'wavesurfer.js';
import PayWall from '@/components/chat/paywall';
import ChatHeader from '@/components/chat/chat-header';
import MessageList from '@/components/chat/messages-list';
import ChatInput from '@/components/chat/chat-input';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { AgentResponse } from '@/lib/types/agents';
import { chatService } from '@/lib/services/v1/chat';
import { conversationService } from '@/lib/services/v1/conversations';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ConversationSummary,
  Message,
} from '@/lib/types/chat';
import {
  ConversationCreate,
  ConversationResponse,
} from '@/lib/types/conversation';
import { uuid } from 'valibot';
import { v4 } from 'uuid';
import { formatDate, getCurrentTime } from '@/lib/utils';

interface CharacterChatTemplateProps {
  character: AgentResponse;
  onBack: () => void;
  isAuthenticated: boolean;
  onAuthRequired: (mode: 'login' | 'signup') => void;
  conversationId?: string; // Optional conversation ID
  history: ChatMessage[]
}

export default function CharacterChatTemplate({
  character,
  onBack,
  isAuthenticated,
  onAuthRequired,
  conversationId,
  history
}: CharacterChatTemplateProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingStates, setPlayingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const wavesurferInstances = useRef<{ [key: number]: WaveSurfer }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { openModal, closeModal } = useModalStore((state) => state);
  const { isMobile, isDesktop } = useWindowSize();

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    setCurrentConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if(!history) return;

    const preparedHistory = history.map(msg => {
      return {
        id:String(msg.messageId),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' as 'user' | 'agent' : 'agent' as 'user' | 'agent',
        time: formatDate(msg.timestamp),
        image: msg.contentData
          ? msg.contentData.url
          : undefined,
      }
    })

    setMessages(preparedHistory)

  }, [history]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Create or fetch conversation
  // useEffect(() => {
  //   const initializeConversation = async () => {
  //     if (!isAuthenticated || !character) {
  //       return;
  //     }
  //
  //     try {
  //       if (!currentConversationId) {
  //         // Create a new conversation
  //         const conversationData: ConversationCreate = {
  //           isPublic: false
  //         };
  //         const newConversation = await conversationService.createConversation(
  //           conversationData
  //         );
  //         setCurrentConversationId(newConversation.id);
  //
  //         // Set initial welcome message
  //         const initialMessage: ChatMessage = {
  //           id: Date.now(),
  //           conversationId: newConversation.id,
  //           senderId: character.id,
  //           senderType: 'agent',
  //           content: `Hey there! I'm ${character.name}. How are you doing today? 😊`,
  //           createdAt: new Date().toISOString(),
  //           status: 'sent',
  //         };
  //         setMessages([initialMessage]);
  //       } else {
  //         // Fetch conversation history
  //         await loadMessages(currentConversationId);
  //       }
  //     } catch (error) {
  //       console.error('Error initializing conversation:', error);
  //       openModal({
  //         type: 'message',
  //         content: <div>Error initializing chat. Please try again.</div>,
  //       });
  //     }
  //   };
  //
  //   initializeConversation();
  // }, [isAuthenticated, character, currentConversationId]);

  // Load messages with pagination
  // const loadMessages = async (
  //   conversationId: number,
  //   pageNumber: number = 1
  // ) => {
  //   if (!hasMoreMessages || isLoadingMessages) return;
  //
  //   setIsLoadingMessages(true);
  //   try {
  //     const fetchedMessages =
  //       await chatService.getConversationHistory(conversationId);
  //     // Simulate pagination by slicing (since API doesn't explicitly support pagination)
  //     const messagesPerPage = 50;
  //     const startIndex = (pageNumber - 1) * messagesPerPage;
  //     const endIndex = startIndex + messagesPerPage;
  //     const paginatedMessages = fetchedMessages.slice(startIndex, endIndex);
  //
  //     setMessages((prev) =>
  //       pageNumber === 1
  //         ? [...paginatedMessages].reverse()
  //         : [...paginatedMessages.reverse(), ...prev]
  //     );
  //     setHasMoreMessages(fetchedMessages.length > endIndex);
  //     setPage(pageNumber);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   } finally {
  //     setIsLoadingMessages(false);
  //   }
  // };

  // // Handle scroll for pagination
  // useEffect(() => {
  //   const container = messagesContainerRef.current;
  //   if (!container) return;
  //
  //   const handleScroll = () => {
  //     if (container.scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
  //       loadMessages(currentConversationId!, page + 1);
  //     }
  //   };
  //
  //   container.addEventListener('scroll', handleScroll);
  //   return () => container.removeEventListener('scroll', handleScroll);
  // }, [hasMoreMessages, isLoadingMessages, page, currentConversationId]);

  // Initialize WaveSurfer for audio messages
  // useEffect(() => {
  //   messages.forEach((message) => {
  //     if(!message) return
  //     if (message.content && message.content.startsWith('data:audio')) {
  //       const waveformElement = document.getElementById(
  //         `waveform-${message.id}`
  //       );
  //       const audioElement = document.getElementById(
  //         `audio-${message.id}`
  //       ) as HTMLAudioElement;
  //
  //       if (
  //         waveformElement &&
  //         audioElement &&
  //         !wavesurferInstances.current[message.id]
  //       ) {
  //         const wavesurfer = WaveSurfer.create({
  //           container: `#waveform-${message.id}`,
  //           waveColor: '#d946ef',
  //           progressColor: '#c026d3',
  //           cursorColor: 'transparent',
  //           barWidth: 2,
  //           barRadius: 1,
  //           barGap: 2,
  //           height: 40,
  //           responsive: true,
  //           hideScrollbar: true,
  //           normalize: true,
  //           backend: 'MediaElement',
  //           media: audioElement,
  //         });
  //
  //         wavesurfer.on('ready', () => {
  //           waveformElement.dataset.initialized = 'true';
  //         });
  //
  //         wavesurfer.on('play', () => {
  //           setPlayingStates((prev) => ({ ...prev, [message.id]: true }));
  //         });
  //
  //         wavesurfer.on('pause', () => {
  //           setPlayingStates((prev) => ({ ...prev, [message.id]: false }));
  //         });
  //
  //         wavesurfer.on('finish', () => {
  //           setPlayingStates((prev) => ({ ...prev, [message.id]: false }));
  //         });
  //
  //         wavesurferInstances.current[message.id] = wavesurfer;
  //       }
  //     }
  //   });
  //
  //   return () => {
  //     Object.values(wavesurferInstances.current).forEach((wavesurfer) => {
  //       wavesurfer.destroy();
  //     });
  //     wavesurferInstances.current = {};
  //   };
  // }, [messages]);

  // Start recording
  const startRecording = async () => {
    if (!isAuthenticated) {
      onAuthRequired('signup');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          await sendVoiceMessage(audioUrl);
        }
        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
        setMediaRecorder(null);
        setAudioChunks([]);
        setRecordingTime(0);
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      recorder.onstop = async () => {
        clearInterval(timer);
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          await sendVoiceMessage(audioUrl);
        }
        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
        setMediaRecorder(null);
        setAudioChunks([]);
        setRecordingTime(0);
        setIsRecording(false);
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  // Send voice message
  const sendVoiceMessage = async (audioUrl: string) => {
    if (!currentConversationId) return;

    try {
      const chatRequest: ChatRequest = {
        agentId: character.id,
        message: audioUrl,
        conversationId: currentConversationId,
      };
      const response = await chatService.sendMessage(chatRequest);
      // setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  // Toggle play/pause for an audio message
  const togglePlayPause = (messageId: number) => {
    const waveformElement = document.getElementById(`waveform-${messageId}`);
    if (waveformElement && waveformElement.dataset.initialized) {
      const wavesurfer = wavesurferInstances.current[messageId];
      if (wavesurfer) {
        if (playingStates[messageId]) {
          wavesurfer.pause();
        } else {
          Object.keys(wavesurferInstances.current).forEach((id) => {
            const otherId = parseInt(id);
            if (otherId !== messageId && playingStates[otherId]) {
              wavesurferInstances.current[otherId].pause();
            }
          });
          wavesurfer.play();
        }
      }
    }
  };

  // Send text message
  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      onAuthRequired('signup');
      return;
    }
    if (messageText.trim() === '') return;
    const userMessageId = v4();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        text: messageText,
        sender: 'user',
        time: getCurrentTime(),
      },
    ]);

    try {
      setIsTyping(true);
      const chatRequest: ChatRequest = {
        agentId: character.id,
        message: messageText,
        ...(currentConversationId && { conversationId: currentConversationId }),
      };
      setMessageText('');
      const response = await chatService.sendMessage(chatRequest);
      const messageId = v4();

      if (response.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            text: response.message,
            sender: 'agent',
            time: formatDate(response.timestamp),
            image: response?.metadata?.content
              ? response.metadata.content.url
              : undefined,
          },
        ]);

        setIsTyping(false);
      }
      console.log('response', response);
      if (response.conversationId && !currentConversationId) {
        setCurrentConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      openModal({
        type: 'message',
        content: <div>Error sending message. Please try again.</div>,
      });
    }
  };

  const handleRequestPhoto = () => {
    if (!isAuthenticated) {
      onAuthRequired('signup');
      return;
    }
    setShowPaywall(true);
  };

  const handlePurchaseContent = async () => {
    setShowPaywall(false);

    if (!currentConversationId) return;

    // try {
    //   const photoMessage: ChatRequest = {
    //     agentId: character.id,
    //     message: `Image: ${character.image}`,
    //     conversationId: currentConversationId,
    //   };
    //   const response = await chatService.sendMessage(photoMessage);
    //   setMessages((prev) => [...prev, response.message]);
    //
    //   setTimeout(async () => {
    //     const followUpMessage: ChatRequest = {
    //       agentId: character.id,
    //       message: 'What do you think? 😘',
    //       conversationId: currentConversationId,
    //     };
    //     const followUpResponse = await chatService.sendMessage(followUpMessage);
    //     setMessages((prev) => [...prev, followUpResponse.message]);
    //   }, 1000);
    // } catch (error) {
    //   console.error('Error sending photo message:', error);
    // }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleViewProfile = () => {
    router.push(`/character/${character.id}`);
  };

  return (
    <div
      className={`h-screen flex ${isMobile ? 'flex-col' : 'mx-auto'} bg-black text-white`}
    >
      <div
        className={`flex h-[100%] w-full rounded-xl overflow-hidden ${
          isMobile && 'h-[calc(100%-64px)] overflow-hidden'
        }`}
      >
        <div className="w-full flex flex-col">
          <ChatHeader
            character={character}
            onBack={onBack}
            isMobile={isMobile}
            toggleOptions={toggleOptions}
            showOptions={showOptions}
            handleViewProfile={handleViewProfile}
            handleRequestPhoto={handleRequestPhoto}
          />
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
            <MessageList
              messages={messages}
              character={character}
              messagesEndRef={messagesEndRef}
              isTyping={isTyping}
              playingStates={playingStates}
              togglePlayPause={togglePlayPause}
            />
          </div>
          <ChatInput
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            recordingTime={recordingTime}
            isAuthenticated={isAuthenticated}
            onAuthRequired={onAuthRequired}
          />
        </div>
      </div>
      {showPaywall && (
        <PayWall
          isMobile={isMobile}
          character={character}
          setShowPaywall={setShowPaywall}
          handlePurchaseContent={handlePurchaseContent}
        />
      )}
    </div>
  );
}
