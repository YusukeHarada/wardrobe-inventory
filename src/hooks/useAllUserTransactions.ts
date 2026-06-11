import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { subscribeAllUserTransactions } from '@/lib/firestore/transactions';

export function useAllUserTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeAllUserTransactions(
      userId,
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
  }, [userId]);

  return { transactions, loading, error };
}
