// lib/ssr/agents-ssr.ts
import { cache } from 'react';
import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';
import { serverAgentService } from '@/lib/services/v1/ssr/agent';

export const getAgentsSSR = cache(async (isPublic: boolean = false) => {
  try {
    const authState = await useAuthServerState();

    const data = !authState.isAuthenticated
      ? await serverAgentService.getAllPublicAgents()
      : await serverAgentService.getAllAgents();
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