'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createWishlistItem } from '@/lib/firestore/wishlist';
import { WishlistFormData } from '@/types/wishlist';
import { PageHeader } from '@/components/layout/PageHeader';
import { WishlistForm } from '@/components/wishlist/WishlistForm';

export default function NewWishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(data: WishlistFormData) {
    if (!user) return;
    try {
      await createWishlistItem(user.uid, data);
      router.push('/wishlist');
    } catch {
      setSubmitError('追加に失敗しました。もう一度お試しください。');
    }
  }

  return (
    <div>
      <PageHeader title="ほしい物を追加" />
      <div className="max-w-lg">
        {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
        <WishlistForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
