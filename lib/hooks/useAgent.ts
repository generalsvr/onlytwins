import { agentService } from '@/lib/services/v1/agent';
import { useEffect, useState, useCallback } from 'react';
import { AgentResponse } from '@/lib/types/agents';
import { ValidationError } from '@/lib/types/auth';
import { useAuthContext } from '@/contexts/AuthContext';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | ValidationError | null;
}

export function useAgent(agentId: number) {
  const { isMeLoading } = useAuthContext();
  const [state, setState] = useState<FetchState<AgentResponse>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchAgent = useCallback(async () => {
    if (isMeLoading) return;
    try {
      const data = await agentService.getAgent(agentId);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error | ValidationError });
    }
  }, [agentId, isMeLoading]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return state;
}