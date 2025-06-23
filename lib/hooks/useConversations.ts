import { useState, useCallback } from 'react';
import { ConversationSummary } from '@/lib/types/chat';
import { conversationService } from '@/lib/services/v1/conversations';

interface UseConversationsOptions {
  initialData?: ConversationSummary[];
  pageSize?: number;
}

interface UseConversationsResult {
  conversations: ConversationSummary[];
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
}

export const useConversations = (
  userId: number | null,
  agentId?: number | undefined,
  options: UseConversationsOptions = {}
): UseConversationsResult => {
  const { initialData = [], pageSize = 20 } = options;

  const [conversations, setConversations] = useState<ConversationSummary[]>(initialData);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(initialData.length === pageSize);

  const loadMore = useCallback(async () => {
    if (!userId || !hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const currentOffset = conversations.length;

      const data = await conversationService.getUserConversations(
        userId,
        agentId,
        pageSize,
        currentOffset
      );

      // Remove duplicates based on agent.id
      const uniqueNewConversations = data.filter(newConv =>
        !conversations.some(existingConv => existingConv.agent.id === newConv.agent.id)
      );

      setConversations(prev => [...prev, ...uniqueNewConversations]);

      // Check if there are more items to load
      setHasMore(data.length === pageSize);

    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load more conversations')
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [userId, agentId, pageSize, conversations, hasMore, isLoadingMore]);

  return {
    conversations,
    error,
    hasMore,
    loadMore,
    isLoadingMore
  };
};