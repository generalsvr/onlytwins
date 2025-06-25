// billing.types.ts

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
  customerId: string;
  productName: string;
  unitAmount: number;
  currency: string;
  interval: 'month' | 'year';
  cancelAt?: string;
  customerName?: string;
  customerPhone?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CancelSubscriptionRequest {
  subscription_id: string;
  at_period_end: boolean;
}

// Response types
export interface SessionResponse {
  id: string;
  url: string;
  customerId: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
}

export interface SubscriptionResponse {
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

// Error types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}