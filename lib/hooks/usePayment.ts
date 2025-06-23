import { billingService } from '@/lib/services/v1/billing';
import { SessionResponse } from '@/lib/types/billing';

interface PaymentResponse {
  createPaymentLink: (
    productName: string,
    customerEmail: string,
    customerName: string,
    amount: number
  ) => Promise<SessionResponse>;
}
export const usePayment = (): PaymentResponse => {
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
      unit_amount: amount*100,
      success_url:`${process.env.NEXT_PUBLIC_HOST_URL}?payment_status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}?payment_status=cancel`,
    });
  };
  return {
    createPaymentLink,
  };
};
