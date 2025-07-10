// Chat service functions
import {
  ChatRequest,
  ChatResponse,
  VoiceMessageRequest,
} from '@/lib/types/chat';
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
  async sendVoiceMessage(data: VoiceMessageRequest): Promise<ChatResponse> {
    try {
      const formData = new FormData();
      formData.append('audio_file', data.audioFile);
      formData.append('agent_id', data.agentId.toString());
      formData.append('conversation_id', data.conversationId);
      const response = await clientApi.post<ChatResponse>(
        '/chat/voice',
        formData,
        {
          headers: {
            // Don't set Content-Type - let axios handle it for FormData
            // 'Content-Type': 'multipart/form-data' // REMOVE THIS if it exists
          },
          // Prevent axios from transforming the data
          transformRequest: [(data) => data],
        }
      );

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
