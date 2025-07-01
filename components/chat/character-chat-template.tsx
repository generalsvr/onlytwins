'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/lib/stores/modalStore';

import AuthModal from '@/components/auth/auth-modal';
import ChatHeader from '@/components/chat/chat-header';
import MessageList from '@/components/chat/messages-list';
import ChatInput from '@/components/chat/chat-input';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useConversationHistory } from '@/lib/hooks/useConversationHistory';
import { AgentResponse, PrivateContent } from '@/lib/types/agents';
import { chatService } from '@/lib/services/v1/client/chat';
import { ChatMessage, ChatRequest, Message } from '@/lib/types/chat';

import { v4 } from 'uuid';
import { formatDate, getCurrentTime } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLocale } from '@/contexts/LanguageContext';
import { usePayment } from '@/lib/hooks/usePayment';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';
import { AxiosError } from 'axios';
import AudioRecorder from '@/components/chat/audio-recorder';
import { useVoiceRecording } from '@/lib/hooks/useVoiceRecording';

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
  const { isAuthenticated, user } = useAuthStore((state) => state);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledManually, setHasScrolledManually] = useState(false);
  const router = useRouter();
  const { isMobile, isDesktop } = useWindowSize();
  const { openModal, closeModal } = useModalStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { locale } = useLocale();
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const { purchaseContent } = usePayment(locale);
  const { errorHandler } = useErrorHandler();
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
          media: msg?.metadata?.content,
        }),
        // Add audio support from metadata
        ...(msg?.metadata?.audioUrl && {
          audio: msg.metadata.audioUrl,
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
          media: msg?.metadata?.content,
        }),
        // Add audio support from metadata
        ...(msg?.metadata?.audioUrl && {
          audio: msg.metadata.audioUrl,
        }),
      }));

      setMessages(preparedHistory);
    }
  }, [paginatedHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesEndRef, isTyping]);

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
            media: response.metadata.content,
          }),
          ...(response?.metadata?.audioUrl && {
            audio: response.metadata.audioUrl,
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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleViewProfile = () => {
    router.push(`/character/${character.id}`);
  };

  const handlePurchaseContent = async (
    content: PrivateContent,
    messageId: number
  ) => {
    setLoading(true);
    await purchaseContent({
      action: 'content_unlock',
      targetType: 'content',
      targetId: content?.id,
      currency: 'OTT',
    })
      .then((res) => {
        if (res.error) {
          errorHandler(res.error as AxiosError);
          return;
        }
        const newUrl = res.url;
        const newMessages = messages.map((item) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (item.id === messageId) {
            return {
              ...item,
              media: {
                ...item.media,
                url: newUrl,
                purchased: true,
              } as PrivateContent,
            };
          }
          return item;
        });
        if (newMessages.length) {
          setMessages(newMessages as Message[]);
        }
      })
      .catch((err) => {
        console.log('chat error', err);
      })
      .finally(() => setLoading(false));
  };
  // Инициализация хука записи голоса
  const {
    isRecording,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    isSupported,
    error: recordingError
  } = useVoiceRecording({
    maxDuration: 300, // 5 минут максимум
    onRecordingComplete: handleRecordingComplete,
    onError: handleRecordingError
  });

  // Обработка завершения записи
  function handleRecordingComplete(audioBlob: Blob, audioUrl: string) {

    // Сохраняем URL записи для прослушивания
    setRecordedAudioUrl(audioUrl);

    // Сохраняем blob для отправки на сервер
    // (можно сохранить в состоянии если нужно)
  }

  // Обработка ошибок записи
  function handleRecordingError(error: string) {
    console.error('Recording error:', error);
    // Показать уведомление пользователю
    alert(`Recording error: ${error}`);
  }

  // Отправка аудио на сервер (пример)
  async function sendAudioToServer(audioBlob: Blob) {
    try {


      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Замените на ваш API endpoint
      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // Если сервер вернул транскрипцию, можно добавить её как текстовое сообщение
        if (result.transcription) {
          const transcriptionMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: result.transcription,
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, transcriptionMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send audio:', error);
      handleRecordingError('Failed to send recording to server');
    }
  }
  const handleDeleteRecording = () => {
    setRecordedAudioUrl(null);
    resetRecording(); // из хука useVoiceRecording
  };
  const handleRetryRecording = async () => {
    setRecordedAudioUrl(null);
    resetRecording(); // из хука useVoiceRecording

    // Сразу начинаем новую запись
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  // Отправка текстового сообщения
  const handleSendVoiceMessage = async () => {
    if (recordedAudioUrl && audioUrl) {
      const userMessageId = v4();

      // Добавляем голосовое сообщение пользователя локально
      const newUserMessage: Message = {
        id: userMessageId,
        audio: recordedAudioUrl,
        sender: 'user',
        time: getCurrentTime()
      };

      setMessages((prev) => [...prev, newUserMessage]);

      setRecordedAudioUrl(null);
      resetRecording();

      return;
    }

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
            media: response.metadata.content,
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
              onScroll={handleScroll}
              isMobile={isMobile}
              handlePurchaseContent={handlePurchaseContent}
            />
          </div>
          <ChatInput
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendVoiceMessage}
            isAuthenticated={isAuthenticated}
            isMobile={isMobile}
            balance={user?.balances.oTT || 0}
            isLoading={isTyping}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            recordingTime={recordingTime}
            // Новые пропсы для режима прослушивания
            audioUrl={recordedAudioUrl}
            onDeleteRecording={handleDeleteRecording}
            onRetryRecording={handleRetryRecording}
          />
        </div>
      </div>
    </div>
  );
}
