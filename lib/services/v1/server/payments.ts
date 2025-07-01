'use server';
import { serverApi } from '@/lib/serverApi';
import { PaymentHistoryResponse } from '@/lib/types/payments';

export const getPaymentsHistory = async (
  page: number
): Promise<PaymentHistoryResponse> => {
  const response = await serverApi.get<PaymentHistoryResponse>(
    '/payments/history',
    {
      params: {
        page: page,
        pageSize: 10
      },
    }
  );
  return response.data;
};
