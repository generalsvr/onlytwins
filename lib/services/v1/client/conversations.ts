import { clientApi } from '@/lib/clientApi';
import { ChatMessage, ConversationSummary } from '@/lib/types/chat';

export const conversationService = {
  async getConversationHistory(
    conversationId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ChatMessage[]> {
    const response = await clientApi.get<{
      messages: ChatMessage[];
      hasMore: boolean;
      total: number;
    }>(`/conversations/${conversationId}`, {
      params: {
        limit,
        offset,
        sort_order: 'desc'
      },
    });
    return response.data;
  },

  // Get agent conversations
  async getAgentConversations(agentId: number): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      `/conversations/agents/${agentId}`
    );
    return response.data;
  },
  async getUserConversations(
    userId: number,
    agentId?: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      `/conversations/users/${userId}`,
      {
        params: {
          ...(agentId && { agent_id: agentId }),
          limit,
          offset,
          sort_by: 'last_activity',
          sort_order: 'desc',
        },
      }
    );
    return response.data;
  },
};
