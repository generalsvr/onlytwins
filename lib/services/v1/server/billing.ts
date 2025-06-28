'use server';

import { SubscriptionResponse, UserSubscriptionResponse } from '@/lib/types/billing';
import { serverApi } from '@/lib/serverApi';

export const getSubscriptionTiers = async (): Promise<SubscriptionResponse> => {
  const response = await serverApi.get<SubscriptionResponse>(
    '/billing/subscriptions/tiers'
  );
  return response.data;
};
export const getUserSubscriptionTier =
  async (): Promise<UserSubscriptionResponse> => {
    const response = await serverApi.get<UserSubscriptionResponse>(
      '/billing/subscriptions/my'
    );
    return response.data;
  };
