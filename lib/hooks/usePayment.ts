import { billingService } from '@/lib/services/v1/client/billing';
import {
  SessionResponse, SubscriptionResponse,
} from '@/lib/types/billing';
import {
  PutTransactionRequest,
  PutTransactionResponse,
} from '@/lib/types/payments';
import { paymentsService } from '@/lib/services/v1/client/payments';

interface PaymentResponse {
  createPaymentLink: (
    productName: string,
    customerEmail: string,
    customerName: string,
    amount: number,
    tokens: number
  ) => Promise<SessionResponse>;
  purchaseContent: (
    data: PutTransactionRequest
  ) => Promise<PutTransactionResponse>;
  purchaseSubscription: (interval: string, plan:string) => Promise<SessionResponse>;
  cancelSubscription: (id: string, atPeriodEnd: boolean) => Promise<SubscriptionResponse>
}

export const usePayment = (locale: string): PaymentResponse => {
  const purchaseContent = async (data: PutTransactionRequest) => {
    return await paymentsService.putTransaction(data).catch((err) => err);
  };
  const purchaseSubscription = async (interval: string, plan: string) => {
    return await billingService.createSubscription({
      subscriptionId: interval,
      successUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=success&type=subscription&plan=${plan}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=failed&type=subscription&plan=${plan}`,
    });
  };

  const cancelSubscription = async (id: string, atPeriodEnd: boolean) => {
    return await billingService.cancelSubscription(id, {
      atPeriodEnd: false,
      subscriptionId: id,
      action: 'cancel'
    });
  };

  const createPaymentLink = async (
    productName: string,
    customerEmail: string,
    customerName: string,
    amount: number,
    tokens: number
  ) => {
    return await billingService.createPaymentLink({
      product_name: productName,
      currency: 'usd',
      customer_email: customerEmail,
      customer_name: customerName,
      quantity: 1,
      unit_amount: amount * 100,
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=success&type=tokens&amount=${tokens}`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=failed&type=tokens&amount=${tokens}`,
    });
  };
  return {
    createPaymentLink,
    purchaseContent,
    purchaseSubscription,
    cancelSubscription
  };
};
