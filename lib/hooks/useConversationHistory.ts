import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/lib/services/v1/chat';
import { ChatMessage } from '@/lib/types/chat';
import { useAuthContext } from '@/contexts/AuthContext';

interface UseConversationsResult {
  history: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
}

export const useConversationHistory = (
  conversationId: string | null
): UseConversationsResult => {
  const { isMeLoading } = useAuthContext();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!conversationId || isMeLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getConversationHistory(conversationId);
      setHistory(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch conversations')
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isMeLoading]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { history, isLoading, error };
};