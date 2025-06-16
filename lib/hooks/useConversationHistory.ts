import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/lib/types/chat';
import { useAuthContext } from '@/contexts/AuthContext';
import { conversationService } from '@/lib/services/v1/conversations';

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
      const data = await conversationService.getConversationHistory(conversationId);
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