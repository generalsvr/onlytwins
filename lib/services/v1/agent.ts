import { clientApi } from '@/lib/clientApi';
import {
  AgentCreateRequest,
  AgentResponse,
  AgentStatsResponse,
} from '@/lib/types/agents';

export const agentService = {
  // Get all agents
  async getAllAgents(): Promise<AgentResponse[]> {
    const response = await clientApi.get<AgentResponse[]>('/agents', {
      params: {
        limit: 50,
        offset: 0
      },
    });
    return response.data;
  },
  async getAllPublicAgents(): Promise<AgentResponse[]> {
    const response = await clientApi.get<AgentResponse[]>('/agents/public', {
      params: {
        limit: 50,
        offset: 0
      },
    });
    return response.data;
  },

  // Create agent
  async createAgent(data: AgentCreateRequest): Promise<AgentResponse> {
    const response = await clientApi.put<AgentResponse>('/agents', data);
    return response.data;
  },

  // Get user agents
  async getUserAgents(): Promise<AgentResponse[]> {
    const response = await clientApi.get<AgentResponse[]>('/agents/my-agents');
    return response.data;
  },

  // Get agent by ID
  async getAgent(agentId: number): Promise<AgentResponse> {
    const response = await clientApi.get<AgentResponse>(`/agents/${agentId}`);
    return response.data;
  },

  // Update agent
  async updateAgent(
    agentId: number,
    data: Partial<AgentCreateRequest>
  ): Promise<AgentResponse> {
    const response = await clientApi.patch<AgentResponse>(
      `/agents/${agentId}`,
      data
    );
    return response.data;
  },

  // Get agent stats
  async getAgentStats(agentId: number): Promise<AgentStatsResponse> {
    const response = await clientApi.get<AgentStatsResponse>(
      `/agents/${agentId}/stats`
    );
    return response.data;
  },
};
