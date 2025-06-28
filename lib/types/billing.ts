// billing.types.ts
import { Response } from '@/lib/types/common';
// Request types
export interface CreatePaymentLinkRequest {
  product_name: string;
  unit_amount: number;
  currency: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionRequest {
  subscriptionId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
  atPeriodEnd: boolean;
  action: string;
}

// Response types
export interface SessionResponse extends Response {
  id: string;
  url: string;
  customerId: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
}

export interface SubscriptionResponse extends Response {
  id: string;
  customer_id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export interface WebhookResponse {
  event_id: string;
  event_type: string;
  processed: boolean;
  message: string;
}
export interface SubscriptionTier {
  billingCycle: string;
  description: string;
  displayPrice: string;
  name: string;
  ottAllocation: number;
  priceCents: number;
  subscriptionId: string;
}
export interface SubscriptionResponse {
  currency: string;
  ott_allocation_per_tier: number;
  tiers: SubscriptionTier[];
}
export interface GlobalSubscription {
  activatedAt: string;
  billingCycle: string;
  monthlyOttAllocation: string;
  priceCents: number;
  sessionId: number;
  status: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  type: string;
}
export interface UserSubscriptionResponse {
  creatorSubscriptions: string;
  globalSubscription: GlobalSubscription;
  subscriptionCount: number;
  totalMonthlyOtt: number;
}
// Error types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
