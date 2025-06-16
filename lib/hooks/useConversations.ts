import { useState, useEffect, useCallback } from 'react';
import { ConversationSummary } from '@/lib/types/chat';
import { useAuthContext } from '@/contexts/AuthContext';
import { conversationService } from '@/lib/services/v1/conversations';

interface UseConversationsResult {
  conversations: ConversationSummary[];
  isLoading: boolean;
  error: Error | null;
}

export const useConversations = (
  userId: number | null,
  agentId?: number | undefined
): UseConversationsResult => {
  const { isMeLoading } = useAuthContext();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!userId || isMeLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await conversationService.getUserConversations(userId, agentId);
      const uniqueConversations = data.reduce((acc, current) => {
        const existing = acc.find(
          (item) => item.agent.id === current.agent.id
        );
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, [] as ConversationSummary[]);
      setConversations(uniqueConversations);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch conversations')
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, isMeLoading, agentId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, isLoading, error };
};