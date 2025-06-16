// Chat service functions
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ConversationSummary,
} from '@/lib/types/chat';
import { clientApi } from '@/lib/clientApi';
export const chatService = {
  // Send message
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await clientApi.put<ChatResponse>('/chat/send', data);
    return response.data;
  },

  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await clientApi.get<ChatMessage[]>(
      `/chat/conversations/${conversationId}`
    );
    return response.data;
  },

  // Get agent conversations
  async getAgentConversations(agentId: number): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      `/chat/agents/${agentId}/conversations`
    );
    return response.data;
  },

  // Get dashboard conversations
  async getDashboardConversations(): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      '/chat/dashboard-conversations'
    );
    return response.data;
  },

  // Get user conversations
  async getUserConversations(
    userId: number,
    agentId?: number
  ): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
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

  // Get my conversations
  async getMyConversations(): Promise<ConversationSummary[]> {
    const response = await clientApi.get<ConversationSummary[]>(
      '/chat/my-conversations'
    );
    return response.data;
  },
};
