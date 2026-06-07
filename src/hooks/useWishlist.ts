import { useState, useEffect } from 'react';
import { WishlistItem } from '@/types/wishlist';
import { subscribeWishlist } from '@/lib/firestore/wishlist';

export function useWishlist(userId: string | null) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeWishlist(
      userId,
      (data) => {
        setWishlist(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId]);

  return { wishlist, loading, error };
}
