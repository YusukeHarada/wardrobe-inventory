import { useState, useEffect } from 'react';
import { Item } from '@/types/item';
import { getItem } from '@/lib/firestore/items';

export function useItem(itemId: string | null) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getItem(itemId)
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [itemId]);

  return { item, loading, error };
}
