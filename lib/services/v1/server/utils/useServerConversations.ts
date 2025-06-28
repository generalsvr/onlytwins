import getAuthState from '@/lib/services/v1/server/utils/getAuthState';
import { ConversationSummary } from '@/lib/types/chat';
import { cache } from 'react';
import { serverConversationsService } from '@/lib/services/v1/server/conversations';

interface ServerConversationsResponse {
  conversations: ConversationSummary[] | null;
  error: Error | null;
}
export const getConversationsSSR = cache(
  async (agentId?: number | undefined): Promise<ServerConversationsResponse> => {
    try {
      const authState = await getAuthState();

      if (!authState.isAuthenticated || !authState.user) {
        return {
          conversations: null,
          error: null,
        };
      }
      const data = await serverConversationsService.getUserConversations(
        authState?.user?.id,
        agentId
      );
      const uniqueConversations = data.reduce((acc, current) => {
        const existing = acc.find((item) => item.agent.id === current.agent.id);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, [] as ConversationSummary[]);
      return {
        conversations: uniqueConversations,
        error: null,
      };
    } catch (error) {
      return {
        conversations: null,
        error: error as Error,
      };
    }
  }
);
