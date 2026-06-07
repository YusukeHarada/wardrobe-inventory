import { useState, useEffect } from 'react';
import { Item } from '@/types/item';
import { subscribeItems } from '@/lib/firestore/items';

export function useItems(userId: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeItems(
      userId,
      (data) => {
        setItems(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId]);

  return { items, loading, error };
}
