import { AgentResponse, PrivateContent } from '@/lib/types/agents';
import { Request } from '@/lib/types/common';

export interface ChatRequest {
  agentId: number;
  message: string;
  conversationId?: string;
}

export interface ChatMessage {
  id: number;
  messageId: number;
  conversationId: number;
  senderId: number;
  senderType: string;
  content: string;
  createdAt: string;
  role: 'user' | 'assistant';
  status: string;
  timestamp: string;
  metadata?: {
    content: PrivateContent;
  };
}
export interface VoiceMessageRequest {
  audioFile: File;           // audio_file* (required)
  agentId: number;          // agent_id* (required)
  conversationId: string;  // conversation_id (optional)
  context?: string;         // context (optional)
  bypassActiveCheck?: boolean; // bypass_active_check (optional)
}
export interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'agent';
  audio?: string;
  time: string;
  media?: PrivateContent;
}

export interface ChatResponse extends Request {
  message: string;
  agentId: number;
  conversationId: string;
  responseTimeMs: number;
  timestamp: string;
  metadata?: {
    content: {
      url?: string;
      currency?: string;
      name?: string;
      paid?: boolean;
      price?: number | null;
      size?: number;
      mimeType?: string;
    };
  };
}

export interface ConversationResponse {
  id: number;
  userId: number;
  agentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: number;
  userId: number;
  conversationId: string;
  agent: AgentResponse;
  agentId: number;
  agentName: string;
  lastMessage: string;
  lastMessageAt: string;
  lastActivity: string;
}

export interface ValidationError {
  detail: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}
