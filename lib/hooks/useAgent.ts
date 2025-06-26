import { agentService } from '@/lib/services/v1/agent';
import { useState, useCallback } from 'react';
import { AgentResponse } from '@/lib/types/agents';
import { ValidationError } from '@/lib/types/auth';

interface RefetchState {
  isRefetching: boolean;
  error: Error | ValidationError | null;
}

export function useAgent(
  agentId: number,
  onSuccess?: (data: AgentResponse) => void
) {
  const [state, setState] = useState<RefetchState>({
    isRefetching: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ isRefetching: true, error: null });

    try {
      const data = await agentService.getAgent(agentId);
      setState({ isRefetching: false, error: null });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      setState({
        isRefetching: false,
        error: error as Error | ValidationError,
      });
      throw error;
    }
  }, [agentId, onSuccess]);

  return {
    refetch,
    isRefetching: state.isRefetching,
    error: state.error,
  };
}
