import { clientApi } from '@/lib/clientApi';
import {
  PutTransactionRequest,
  PutTransactionResponse,
} from '@/lib/types/payments';
import { AxiosError } from 'axios';

export const paymentsService = {
  async putTransaction(
    data: PutTransactionRequest
  ): Promise<PutTransactionResponse> {
    try{
      const response = await clientApi.put(`/payments/transaction`, data);
      return response.data;
    } catch (error){
      console.log("error:",error);
      return error.response.data
    }
  },
};
