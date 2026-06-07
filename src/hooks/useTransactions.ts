import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { subscribeTransactions } from '@/lib/firestore/transactions';

export function useTransactions(itemId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!itemId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeTransactions(
      itemId,
      (data) => {
        setTransactions(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [itemId]);

  return { transactions, loading, error };
}
