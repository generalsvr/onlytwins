import {
  ConversationCreate,
  ConversationResponse,
  MessageCreate,
  MessageResponse,
} from '@/lib/types/conversation';
import { clientApi } from '@/lib/clientApi';

export const conversationService = {
  // Get all conversations
  async getConversations(): Promise<ConversationResponse[]> {
    const response = await clientApi.get<ConversationResponse[]>('/conversations/',{
      params:{
        skip:0,
        limit:50,
      }
    });
    return response.data;
  },

  // Create a new conversation
  async createConversation(data: ConversationCreate): Promise<ConversationResponse> {
    const response = await clientApi.put<ConversationResponse>('/conversations/', data);
    return response.data;
  },

  // Get a specific conversation by ID
  async getConversation(conversationId: string): Promise<ConversationResponse> {
    const response = await clientApi.get<ConversationResponse>(`/conversations/${conversationId}`);
    return response.data;
  },

  // Get messages for a specific conversation
  async getConversationMessages(conversationId: string): Promise<MessageResponse[]> {
    const response = await clientApi.get<MessageResponse[]>(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Create a new message in a conversation
  async createMessage(conversationId: string, data: MessageCreate): Promise<MessageResponse> {
    const response = await clientApi.put<MessageResponse>(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },
};