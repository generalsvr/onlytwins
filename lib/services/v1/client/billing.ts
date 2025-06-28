// billingService.ts
import { clientApi } from '@/lib/clientApi';
import {
  CreatePaymentLinkRequest,
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  SessionResponse,
  SubscriptionResponse,
  WebhookResponse,
} from '@/lib/types/billing';
import { AxiosError } from 'axios';

export const billingService = {
  // Create Payment Link
  async createPaymentLink(
    data: CreatePaymentLinkRequest
  ): Promise<SessionResponse> {
    const response = await clientApi.post<SessionResponse>(
      '/billing/payment-link',
      data
    );
    return response.data;
  },

  // Create Subscription
  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<SessionResponse> {
    try {
      const response = await clientApi.post<SessionResponse>(
        '/billing/subscription',
        data
      );
      return response.data;
    } catch (error: AxiosError) {
      return error.response.data;
    }
  },

  async getSubscriptionTier(): Promise<SubscriptionResponse> {
    const response = await clientApi.get<SubscriptionResponse>(
      '/billing/subscriptions/tiers'
    );
    return response.data;
  },
  async getUserSubscriptionTier(): Promise<SubscriptionResponse> {
    const response = await clientApi.get<SubscriptionResponse>(
      '/billing/subscriptions/my'
    );
    return response.data;
  },
  // Process Stripe Webhook
  async processStripeWebhook(payload: any): Promise<WebhookResponse> {
    const response = await clientApi.post<WebhookResponse>(
      '/billing/webhook/stripe',
      payload
    );
    return response.data;
  },

  // Get Session
  async getSession(sessionId: string): Promise<SessionResponse> {
    const response = await clientApi.get<SessionResponse>(
      `/billing/session/${sessionId}`
    );
    return response.data;
  },

  // Get Subscription
  async getSubscription(subscriptionId: string): Promise<SubscriptionResponse> {
    const response = await clientApi.get<SubscriptionResponse>(
      `/billing/subscription/${subscriptionId}`
    );
    return response.data;
  },

  // Cancel Subscription
  async cancelSubscription(
    subscriptionId: string,
    data: CancelSubscriptionRequest
  ): Promise<SubscriptionResponse> {
    try {
      const response = await clientApi.delete<SubscriptionResponse>(
        `/billing/subscriptions/${subscriptionId}`,
        { data }
      );
      return response.data;
    } catch (error: AxiosError) {
      return error.response.data;
    }
  },
};
