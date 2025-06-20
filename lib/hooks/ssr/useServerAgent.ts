// lib/ssr/agents-ssr.ts
import { cache } from 'react';
import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';
import { getAgent, getPublicAgent } from '@/lib/services/v1/ssr/agent';

export const getAgentSSR = cache(async (agentId: number) => {
  try {
    const authState = await useAuthServerState();

    const data = authState.isAuthenticated
      ? await getAgent(agentId)
      : await getPublicAgent(agentId);

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
});
