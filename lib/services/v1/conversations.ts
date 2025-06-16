import { clientApi } from '@/lib/clientApi';
import { ChatMessage, ConversationSummary } from '@/lib/types/chat';

export const conversationService = {
  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await clientApi.get<ChatMessage[]>(
      `/conversations/${conversationId}`
    );
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
    agentId?: number
  ): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      `/conversations/users/${userId}`,
      {
        params: {
          ...(agentId && { agent_id: agentId }),
          limit: 20,
          offset: 0,
          sort_by: 'last_activity',
          sort_order: 'desc',
        },
      }
    );
    return response.data;
  },
};