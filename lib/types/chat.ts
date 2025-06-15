import { AgentResponse } from '@/lib/types/agents';

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
  contentData: {
    type: string;
    url: string;
    name: string;
    paid: boolean;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  audio?: boolean;
  time: string;
  image?: string;
}

export interface ChatResponse {
  message: string;
  agentId: number;
  conversationId: string;
  responseTimeMs: number;
  timestamp: string;
  metadata: {
    content?:{
      url: string
    }
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
