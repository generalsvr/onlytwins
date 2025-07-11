// Interfaces for request/response bodies
export interface AgentCreateRequest {
  name: string;
  description?: string;
  configuration?: Record<string, number>;
}

interface PublicContent {
  createdAt: string;
  fileSize: string;
  mimeType: string;
  url: string;
  name: string;
  meta:{
    isPublic?: boolean;
    currency: string;
  }
}
export interface PrivateContent {
  currency: 'USD' | 'OTT';
  id: number;
  mimeType: 'string';
  price: number;
  url: string;
  purchased: boolean;
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
  publicContent?: PublicContent[]; // Adjust type based on actual content structure if known
  privateContent?: PrivateContent[];
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
