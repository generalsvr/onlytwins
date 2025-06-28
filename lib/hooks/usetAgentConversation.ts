import { useState, useEffect, useCallback } from 'react';
import { ConversationSummary } from '@/lib/types/chat';
import { useAuthContext } from '@/contexts/AuthContext';
import { conversationService } from '@/lib/services/v1/client/conversations';

interface UseConversationsResult {
  conversations: ConversationSummary | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useAgentConversation = (
  agentId: number | null
): UseConversationsResult => {
  const { isMeLoading } = useAuthContext();
  const [conversations, setConversations] = useState<ConversationSummary>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!agentId || isMeLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await conversationService.getAgentConversations(agentId);
      data.sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      );
      const uniqueConversations = data.reduce((acc, current) => {
        const existing = acc.find((item) => item.agent.id === current.agent.id);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, [] as ConversationSummary[]);
      if (uniqueConversations.length) {
        const [firstConversation] = uniqueConversations;
        if (firstConversation) {
          setConversations(firstConversation);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch conversations')
      );
    } finally {
      setIsLoading(false);
    }
  }, [agentId, isMeLoading]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, isLoading, error };
};
