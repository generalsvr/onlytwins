import { billingService } from '@/lib/services/v1/client/billing';
import { SubscriptionResponse } from '@/lib/types/billing';

interface UseSubscriptionResponse {
  getTiers: () => Promise<SubscriptionResponse>;
}

export const useSubscription = (): UseSubscriptionResponse => {
  const getTiers = async () => {
    return await billingService.getSubscriptionTier();
  };

  return {
    getTiers
  };
};
