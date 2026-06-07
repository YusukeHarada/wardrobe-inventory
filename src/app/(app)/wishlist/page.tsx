'use client';

import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { deleteWishlistItem } from '@/lib/firestore/wishlist';
import { PageHeader } from '@/components/layout/PageHeader';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, loading } = useWishlist(user?.uid ?? null);

  if (loading) return <LoadingSpinner fullPage />;

  async function handleDelete(id: string) {
    await deleteWishlistItem(id);
  }

  return (
    <div>
      <PageHeader
        title="ほしい物リスト"
        description={`${wishlist.length}件`}
        action={
          <Link href="/wishlist/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
          </Link>
        }
      />

      {wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="ほしい物リストは空です"
          description="購入予定のアイテムを追加しましょう"
          action={
            <Link href="/wishlist/new">
              <Button size="sm">追加する</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <WishlistCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
