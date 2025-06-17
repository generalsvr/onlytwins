import { AgentResponse } from '@/lib/types/agents';
import { serverApi } from '@/lib/serverApi';
import { clientApi } from '@/lib/clientApi';

export const serverAgentService = {
  async getAllAgents(): Promise<AgentResponse[]> {
    const response = await serverApi.get<AgentResponse[]>('/agents', {
      params: {
        limit: 50,
        offset: 0
      },
    });
    return response.data;
  },
  async getAllPublicAgents(): Promise<AgentResponse[]> {
    const response = await serverApi.get<AgentResponse[]>('/public/agents/public', {
      params: {
        limit: 50,
        offset: 0
      },
    });
    return response.data;
  },
  async getAgent(agentId: number): Promise<AgentResponse> {
    const response = await serverApi.get<AgentResponse>(`/agents/${agentId}`);
    return response.data;
  },
  async getPublicAgent(agentId: number): Promise<AgentResponse> {
    const response = await serverApi.get<AgentResponse>(`/agents/public/${agentId}`);
    return response.data;
  },
};