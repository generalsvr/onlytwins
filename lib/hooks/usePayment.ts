import { billingService } from '@/lib/services/v1/billing';
import { CreateSubscriptionRequest, SessionResponse } from '@/lib/types/billing';
import { PutTransactionRequest, PutTransactionResponse } from '@/lib/types/payments';
import { paymentsService } from '@/lib/services/v1/payments';

interface PaymentResponse {
  createPaymentLink: (
    productName: string,
    customerEmail: string,
    customerName: string,
    amount: number
  ) => Promise<SessionResponse>;
  purchaseContent: (data: PutTransactionRequest) => Promise<PutTransactionResponse>;
  purchaseSubscription: (data: CreateSubscriptionRequest) => Promise<SessionResponse>;
}

export const usePayment = (locale: string): PaymentResponse => {

  const purchaseContent = async (data: PutTransactionRequest) => {
      return await paymentsService.putTransaction(data).catch((err) => err)
  }
  const purchaseSubscription = async (data: CreateSubscriptionRequest) => {
    return await billingService.createSubscription(data)
  }

  const createPaymentLink = async (
    productName: string,
    customerEmail: string,
    customerName: string,
    amount: number
  ) => {
    return await billingService.createPaymentLink({
      product_name: productName,
      currency: 'usd',
      customer_email: customerEmail,
      customer_name: customerName,
      quantity: 1,
      unit_amount: amount * 100,
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/${locale || 'en'}?payment_status=failed`,
    });
  };
  return {
    createPaymentLink,
    purchaseContent,
    purchaseSubscription
  };
};
