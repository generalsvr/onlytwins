// lib/ssr/agents-ssr.ts
import { cache } from 'react';
import getAuthState from '@/lib/services/v1/server/utils/getAuthState';
import { getAgent, getPublicAgent } from '@/lib/services/v1/server/agent';

export const getAgentSSR = cache(async (agentId: number) => {
  try {
    const authState = await getAuthState();

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
