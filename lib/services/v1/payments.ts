import { clientApi } from '@/lib/clientApi';
import {
  PutTransactionRequest,
  PutTransactionResponse,
} from '@/lib/types/payments';

export const paymentsService = {
  async putTransaction(
    data: PutTransactionRequest
  ): Promise<PutTransactionResponse> {
    const response = await clientApi.put(`/payments/transaction`, data);
    return response.data;
  },
};
