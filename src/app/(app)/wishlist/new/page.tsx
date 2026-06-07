'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createWishlistItem } from '@/lib/firestore/wishlist';
import { WishlistFormData } from '@/types/wishlist';
import { PageHeader } from '@/components/layout/PageHeader';
import { WishlistForm } from '@/components/wishlist/WishlistForm';

export default function NewWishlistPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSubmit(data: WishlistFormData) {
    if (!user) return;
    await createWishlistItem(user.uid, data);
    router.push('/wishlist');
  }

  return (
    <div>
      <PageHeader title="ほしい物を追加" />
      <div className="max-w-lg">
        <WishlistForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
