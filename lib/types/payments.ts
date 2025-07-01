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
export interface PutTransactionResponse extends Response {
  transaction_id: number;
  action: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'ERROR';
  url: string;
}
export interface Transaction {
  transactionId: number;
  hash: string;
  amount: number;
  currency: string;
  transactionType: string;
  status: string;
  direction: string;
  agentId: number;
  agentName: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}
export interface PaymentHistoryResponse extends Response {
  transactions: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  balanceSummary: {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
  };
  total_sent: {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
  };
  total_received: {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
  };
}
