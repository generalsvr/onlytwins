import { ChatMessage, ConversationSummary } from '@/lib/types/chat';
import { serverApi } from '@/lib/serverApi';

export const serverConversationsService = {
  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await serverApi.get<ChatMessage[]>(
      `/conversations/${conversationId}`
    );
    return response.data;
  },

  // Get agent conversations
  async getAgentConversations(agentId: number): Promise<ConversationSummary[]> {
    const response = await serverApi.get<ConversationSummary[]>(
      `/conversations/agents/${agentId}`
    );
    return response.data;
  },

  // Get user conversations
  async getUserConversations(
    userId: number,
    agentId?: number
  ): Promise<ConversationSummary[]> {
    const response = await serverApi.get<ConversationSummary[]>(
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

}