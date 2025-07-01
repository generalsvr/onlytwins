import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/lib/types/chat';
import { useAuthContext } from '@/contexts/AuthContext';
import { conversationService } from '@/lib/services/v1/client/conversations';

interface UseConversationsResult {
  history: ChatMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  setInitialHistory: (messages: ChatMessage[]) => void;
}

export const useConversationHistory = (
  conversationId: string | null
): UseConversationsResult => {
  const { isMeLoading } = useAuthContext();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const LIMIT = 10;

  // Функция для установки начальной истории от SSR
  const setInitialHistory = useCallback(
    (messages: ChatMessage[]) => {
      if (!isInitialized) {
        setHistory(messages);
        setOffset(messages.length);
        setIsInitialized(true);
        // Если получили меньше лимита, значит больше сообщений нет
        setHasMore(messages.length >= LIMIT);
      }
    },
    [isInitialized, LIMIT]
  );

  // Загрузка дополнительных сообщений
  const loadMore = useCallback(async () => {
    if (!conversationId || isLoadingMore || isMeLoading) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const data = await conversationService.getConversationHistory(
        conversationId,
        LIMIT,
        offset
      );

      if (data && data.length > 0) {


        const merge = [...data.reverse(), ...history]
        setHistory(merge);
        setOffset((prev) => prev + data.length);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load more messages')
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, hasMore, isLoadingMore, isMeLoading, offset, LIMIT]);

  // Первоначальная загрузка (только если нет SSR данных)
  const fetchInitialConversations = useCallback(async () => {
    if (!conversationId || isMeLoading || isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await conversationService.getConversationHistory(
        conversationId,
        LIMIT,
        0
      );

      if (data.messages) {
        setHistory(data.messages);
        setOffset(data.messages.length);
        setHasMore(data.hasMore);
        setIsInitialized(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch conversations')
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isMeLoading, isInitialized, LIMIT]);

  useEffect(() => {
    fetchInitialConversations();
  }, [fetchInitialConversations]);

  return {
    history,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    setInitialHistory,
  };
};
