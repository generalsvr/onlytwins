// Interfaces for request/response bodies
export interface AgentCreateRequest {
  name: string;
  description?: string;
  configuration?: Record<string, any>;
}

interface Meta {
  age: number;
  name: string;
  gender: string;
  goals?: string;
  likes?: string;
  dislikes?: string;
  location?: string;
  keyTraits?: string;
  background?: string;
  occupation?: string;
  profileImage?: string;
  profileVideo?: string;
  physicalDescription?: string;
  publicContent?: any[]; // Adjust type based on actual content structure if known
}

export interface AgentResponse {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  isActive: boolean;
  meta: Meta;
  createdAt: string;
  updatedAt: string;
}

export interface AgentStatsResponse {
  agentId: number;
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  lastActive: string;
}

export interface ValidationError {
  detail: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
  }>;
}