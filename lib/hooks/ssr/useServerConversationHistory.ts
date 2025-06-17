import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';
import { ChatMessage, ConversationSummary } from '@/lib/types/chat';
import { cache } from 'react';
import { serverConversationsService } from '@/lib/services/v1/ssr/conversations';

interface ServerConversationsResponse {
  history: ChatMessage[] | null;
  error: Error | null;
}
export const getConversationsHistorySSR = cache(
  async (conversationId: string): Promise<ServerConversationsResponse> => {
    try {
      const authState = await useAuthServerState();

      if (!authState.isAuthenticated || !authState.user || !conversationId) {
        return {
          history: null,
          error: null,
        };
      }
      const data =
        await serverConversationsService.getConversationHistory(conversationId);

      return {
        history: data,
        error: null,
      };
    } catch (error) {
      return {
        history: null,
        error: error as Error,
      };
    }
  }
);
