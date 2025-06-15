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

export function useAgents(isPublic: boolean) {
  const { isMeLoading } = useAuthContext();
  const [state, setState] = useState<FetchState<AgentResponse[]>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchAgents = useCallback(async () => {
    if (isMeLoading) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const data = isPublic
        ? await agentService.getAllPublicAgents()
        : await agentService.getAllAgents();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error as Error | ValidationError,
      });
    }
  }, [isPublic, isMeLoading]);

  useEffect(() => {
    if (isMeLoading) return;
    fetchAgents();
  }, [fetchAgents, isMeLoading]);

  return { ...state, refetch: fetchAgents };
}
