export interface PutTransactionRequest {
  action: 'content_unlock' | 'tip';
  targetType: string;
  targetId: number;
  amount?: number;
  currency: 'OTT' | 'USD';
  message?: string;
  metadata?: any;
}
export interface PutTransactionResponse {
  transactionId: number;
  hash: string;
  action: string;
  targetType: string;
  targetId: number;
  amount: number;
  currency: string;
  senderId: number;
  receiverId: number;
  status: string;
  message: string;
  metadata: any;
  createdAt: string;
  contentAccess: any;
}
