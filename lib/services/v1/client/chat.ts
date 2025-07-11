// Chat service functions
import { ChatRequest, ChatResponse } from '@/lib/types/chat';
import { clientApi } from '@/lib/clientApi';
export const chatService = {
  // Send message
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await clientApi.put<ChatResponse>('/chat/send', data);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async sendPublicMessage(data: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await clientApi.put<ChatResponse>(
        '/chat/public/send',
        data
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
