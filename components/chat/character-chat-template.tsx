'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/lib/stores/modalStore';

import AuthModal from '@/components/auth/auth-modal';
import WaveSurfer from 'wavesurfer.js';
import PayWall from '@/components/chat/paywall';
import ChatHeader from '@/components/chat/chat-header';
import MessageList from '@/components/chat/messages-list';
import ChatInput from '@/components/chat/chat-input';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useConversationHistory } from '@/lib/hooks/useConversationHistory';
import { AgentResponse } from '@/lib/types/agents';
import { chatService } from '@/lib/services/v1/chat';
import { ChatMessage, ChatRequest, Message } from '@/lib/types/chat';

import { v4 } from 'uuid';
import { formatDate, getCurrentTime } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/authStore';

interface CharacterChatTemplateProps {
  character: AgentResponse | null;
  conversationId?: string;
  history: ChatMessage[] | null; // SSR данные
}

export default function CharacterChatTemplate({
  character,
  conversationId,
  history,
}: CharacterChatTemplateProps) {
  const { isAuthenticated } = useAuthStore((state) => state);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

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
  const [hasScrolledManually, setHasScrolledManually] = useState(false);
  const router = useRouter();
  const { isMobile, isDesktop } = useWindowSize();
  const { openModal, closeModal } = useModalStore();
  console.log(messages)
  // Используем хук для пагинации
  const {
    history: paginatedHistory,
    isLoadingMore,
    hasMore,
    loadMore,
    setInitialHistory,
  } = useConversationHistory(currentConversationId);

  // Scroll to bottom of messages
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });


  const onBack = () => {
    router.push('/');
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // Если контент помещается в контейнер, пагинация не нужна
      if (scrollHeight <= clientHeight) {
        return;
      }

      // Отмечаем, что пользователь начал скроллить вручную
      // Проверяем, что скролл больше небольшого порога (чтобы избежать ложных срабатываний)
      if (!hasScrolledManually && scrollTop > 50) {
        setHasScrolledManually(true);
      }
      // Загружаем только если:
      // 1. Пользователь уже скроллил вручную
      // 2. Достиг верха контейнера
      // 3. Есть еще данные для загрузки
      // 4. Не идет загрузка в данный момент
      if (hasScrolledManually && scrollTop === 0 && hasMore && !isLoadingMore) {
        console.log('Loading more messages...');
        loadMore();
      }
    },
    [hasScrolledManually, isLoadingMore, hasMore, loadMore]
  );

  useEffect(() => {
    if (!conversationId) return;
    setCurrentConversationId(conversationId);
    // Сбрасываем флаг при смене разговора
    setHasScrolledManually(false);
  }, [conversationId]);

  // Устанавливаем SSR историю при инициализации
  useEffect(() => {
    if (history && history.length > 0) {
      const preparedHistory: Message[] = history.map((msg) => ({
        id: String(msg.messageId),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'agent',
        time: formatDate(msg.timestamp),
        ...(msg?.metadata?.content && {
          media: {
            url: msg?.metadata?.content?.url,
            type: msg?.metadata?.content.mimeType,
            price: msg?.metadata?.content.price,
          },
        }),
      }));

      setMessages(preparedHistory);
      setInitialHistory(history);
      // Сбрасываем флаг при загрузке новой истории
      setHasScrolledManually(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, setInitialHistory]);

  // Обновляем сообщения при изменении пагинированной истории
  useEffect(() => {
    if (paginatedHistory.length > 0) {
      const preparedHistory: Message[] = paginatedHistory.map((msg) => ({
        id: String(msg.messageId),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'agent',
        time: formatDate(msg.timestamp),
        ...(msg?.metadata?.content && {
          media: {
            url: msg?.metadata?.content?.url,
            type: msg?.metadata?.content.mimeType,
            price: msg?.metadata?.content.price,
          },
        }),
      }));

      setMessages(preparedHistory);

    }
  }, [paginatedHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesEndRef, isTyping]);
  // Start recording
  const startRecording = async () => {
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
    if (messageText.trim() === '') return;
    const userMessageId = v4();

    // Добавляем сообщение пользователя локально
    const newUserMessage: Message = {
      id: userMessageId,
      text: messageText,
      sender: 'user',
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      setIsTyping(true);

      const chatRequest: ChatRequest = {
        agentId: character.id,
        message: messageText,
        ...(currentConversationId && { conversationId: currentConversationId }),
      };
      setMessageText('');

      const response = isAuthenticated
        ? await chatService.sendMessage(chatRequest)
        : await chatService.sendPublicMessage(chatRequest);

      if (response?.error && response?.status === 429) {
        openModal({
          type: 'message',
          content: (
            <AuthModal initialMode="signup" onClose={() => closeModal()} />
          ),
        });
        setIsTyping(false);
        return;
      }

      const messageId = v4();

      if (response.message) {
        const newAgentMessage: Message = {
          id: messageId,
          text: response.message,
          sender: 'agent',
          time: formatDate(response.timestamp),
          ...(response?.metadata?.content && {
            media: {
              url: response?.metadata?.content?.url,
              type: response?.metadata?.content.mimeType,
              price: response?.metadata?.content.price,
            },
          }),
        };

        setMessages((prev) => [...prev, newAgentMessage]);
        setIsTyping(false);
        scrollToBottom();
      }

      if (response.conversationId && !currentConversationId) {
        setCurrentConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      openModal({
        type: 'message',
        content: <div>Error sending message. Please try again.</div>,
      });
      setIsTyping(false);
    }
  };

  const handleRequestPhoto = () => {
    setShowPaywall(true);
  };

  const handlePurchaseContent = async () => {
    setShowPaywall(false);
    // Остальная логика...
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
      <div className={`flex h-[100%] w-full rounded-xl overflow-hidden`}>
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
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              playingStates={playingStates}
              togglePlayPause={togglePlayPause}
              onScroll={handleScroll}
              isMobile={isMobile}
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
            isMobile={isMobile}
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
