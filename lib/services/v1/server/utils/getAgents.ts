// lib/ssr/agents-ssr.ts
import { cache } from 'react';
import getAuthState from '@/lib/services/v1/server/utils/getAuthState';
import { getAllAgents, getAllPublicAgents } from '@/lib/services/v1/server/agent';

export const getAgents = cache(async () => {
  try {
    const authState = await getAuthState();
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