import { ChatMessage, ConversationSummary } from '@/lib/types/chat';
import { serverApi } from '@/lib/serverApi';

export const serverChatService = {
  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await serverApi.get<ChatMessage[]>(
      `/chat/conversations/${conversationId}`
    );
    return response.data;
  },

  // Get agent conversations
  async getAgentConversations(agentId: number): Promise<ConversationSummary[]> {
    const response = await serverApi.get<ConversationSummary[]>(
      `/chat/agents/${agentId}/conversations`
    );
    return response.data;
  },

  // Get user conversations
  async getUserConversations(
    userId: number,
    agentId?: number
  ): Promise<ConversationSummary[]> {
    const response = await serverApi.get<ConversationSummary[]>(
      `/chat/users/${userId}/conversations`,
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