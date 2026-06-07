export type TransactionType = 'purchase' | 'disposal';

export interface Transaction {
  id: string;
  itemId: string;
  userId: string;
  type: TransactionType;
  quantity: number;
  transactionDate: string;
  memo: string;
  createdAt: string;
}
