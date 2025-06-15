// Conversation Create Request
export interface ConversationCreate {
  // Add specific properties based on your application's needs
  // The Swagger doc doesn't provide detailed schema for ConversationCreate
  // Common properties might include:
  participant_ids?: number[]; // Array of user IDs for the conversation
  title?: string; // Optional conversation title
  isPublic: boolean;
  // Add other properties as needed
}

// Conversation Response
export interface ConversationResponse {
  id: number;
  title?: string;
  participant_ids: number[];
  created_at: string; // ISO 8601 date string, e.g., "2025-06-12T08:06:57.821Z"
  updated_at?: string; // ISO 8601 date string
  last_message?: MessageResponse; // Optional last message in the conversation
}

// Message Create Request
export interface MessageCreate {
  content: string; // The message content
  role?: string; // Optional role, e.g., "user" or "agent"
  // Add other optional properties as needed
}

// Message Response
export interface MessageResponse {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  role: string; // e.g., "user" or "agent"
  status: string; // e.g., "sent", "delivered", "read"
  created_at: string; // ISO 8601 date string, e.g., "2025-06-12T08:06:57.821Z"
  updated_at?: string; // ISO 8601 date string
}