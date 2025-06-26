import { Response } from '@/lib/types/common';

export interface PutTransactionRequest {
  action: 'content_unlock' | 'tip';
  targetType: string;
  targetId: number;
  amount?: number;
  currency: 'OTT' | 'USD';
  message?: string;
  metadata?: any;
}
export interface PutTransactionResponse extends Response{
  transaction_id: number;
  action: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'ERROR';
  url: string;
}
