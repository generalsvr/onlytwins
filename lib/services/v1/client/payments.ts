import { clientApi } from '@/lib/clientApi';
import {
  PaymentHistoryResponse,
  PutTransactionRequest,
  PutTransactionResponse,
} from '@/lib/types/payments';

export const paymentsService = {
  async putTransaction(
    data: PutTransactionRequest
  ): Promise<PutTransactionResponse> {
    try {
      const response = await clientApi.put(`/payments/transaction`, data);
      return response.data;
    } catch (error) {
      console.log('error:', error);
      return error.response.data;
    }
  },
  async getPaymentsHistory(page: number): Promise<PaymentHistoryResponse> {
    const response = await clientApi.get<PaymentHistoryResponse>(
      '/payments/history',
      {
        params: {
          page: page,
          pageSize: 10
        },
      }
    );
    return response.data;
  },
};
