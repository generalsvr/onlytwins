import { cookies } from 'next/headers';
import { authServerService } from '@/lib/ssr/auth-ssr';
import { UserResponse } from '@/lib/types/auth';
import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';
import { chatService } from '@/lib/services/v1/chat';
import { serverChatService } from '@/lib/services/v1/ssr/chat';
import { ConversationSummary } from '@/lib/types/chat';
import { cache } from 'react';
import { serverAgentService } from '@/lib/services/v1/ssr/agent';

interface ServerConversationsResponse {
  conversations: ConversationSummary[] | null;
  error: Error | null;
}
export const getConversationsSSR = cache(
  async (): Promise<ServerConversationsResponse> => {
    try {
      const authState = await useAuthServerState();

      if (!authState.isAuthenticated || !authState.user) {
        return {
          conversations: null,
          error: null,
        };
      }
      const data = await serverChatService.getUserConversations(
        authState?.user?.id
      );
      const uniqueConversations = data.reduce((acc, current) => {
        const existing = acc.find(
          (item) => item.agent.id === current.agent.id
        );
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
