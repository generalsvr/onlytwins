'use server';
import { AgentResponse } from '@/lib/types/agents';
import { serverApi } from '@/lib/serverApi';

export const getAllAgents = async (): Promise<AgentResponse[]> => {
  const response = await serverApi.get<AgentResponse[]>('/agents', {
    params: {
      limit: 50,
      offset: 0,
      includePublicContent: true
    },
  });
  return response.data;
};
export const getAllPublicAgents = async (): Promise<AgentResponse[]> => {
  const response = await serverApi.get<AgentResponse[]>('/agents/public', {
    params: {
      limit: 50,
      offset: 0,
      includePublicContent: true
    },
  });
  return response.data;
};
export const getAgent = async (agentId: number): Promise<AgentResponse> => {
  const response = await serverApi.get<AgentResponse>(`/agents/${agentId}`,{
    params:{
      "include_private_content": true
    }
  });
  return response.data;
};
export const getPublicAgent = async (
  agentId: number
): Promise<AgentResponse> => {
  const response = await serverApi.get<AgentResponse>(
    `/agents/public/${agentId}`
  );
  return response.data;
};
