import { billingService } from '@/lib/services/v1/client/billing';
import {
  GlobalSubscription,
  SubscriptionResponse,
  UserSubscriptionResponse,
} from '@/lib/types/billing';
import { useEffect, useState } from 'react';

interface UseSubscriptionResponse {
  userTier: GlobalSubscription | null
  isLoading: boolean
}

export const useSubscription = (): UseSubscriptionResponse => {
  const [userTier, setUserTier] = useState<GlobalSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getUserTier = async () => {
    const data = await billingService.getUserSubscriptionTier();
    if (data) {
      setUserTier(data.globalSubscription);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getUserTier();
  }, []);

  return {
    userTier,
    isLoading
  };
};
