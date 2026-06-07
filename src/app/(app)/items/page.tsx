'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { PageHeader } from '@/components/layout/PageHeader';
import { ItemFilterBar, FilterState } from '@/components/items/ItemFilterBar';
import { ItemList } from '@/components/items/ItemList';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const defaultFilter: FilterState = {
  searchQuery: '',
  categoryFilter: 'all',
  managementTypeFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function ItemsPage() {
  const { user } = useAuth();
  const { items, loading, error } = useItems(user?.uid ?? null);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        データの取得に失敗しました: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="アイテム一覧"
        description={`${items.length}件`}
        action={
          <Link href="/items/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
          </Link>
        }
      />
      <ItemFilterBar filter={filter} onChange={setFilter} />
      <ItemList items={items} filter={filter} />
    </div>
  );
}
