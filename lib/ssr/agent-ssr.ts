// lib/ssr/agents-ssr.ts
import { cache } from 'react';
import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';
import { getAllAgents, getAllPublicAgents } from '@/lib/services/v1/ssr/agent';

export const getAgentsSSR = cache(async () => {
  try {
    const authState = await useAuthServerState();
    const data = !authState.isAuthenticated
      ? await getAllPublicAgents()
      : await getAllAgents();
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