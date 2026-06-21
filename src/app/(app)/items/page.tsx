'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, CheckSquare, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSeasonFilteredItems } from '@/hooks/useSeasonFilteredItems';
import { PageHeader } from '@/components/layout/PageHeader';
import { ItemFilterBar, FilterState } from '@/components/items/ItemFilterBar';
import { ItemList } from '@/components/items/ItemList';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { batchUpdateItemsSeason } from '@/lib/firestore/items';
import { Season } from '@/types/item';
import { SEASONS } from '@/lib/constants';

const defaultFilter: FilterState = {
  searchQuery: '',
  categoryFilter: 'all',
  managementTypeFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function ItemsPage() {
  const { user } = useAuth();
  const { items, loading, error } = useSeasonFilteredItems(user?.uid ?? null);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const handleBatchUpdate = async (season: Season) => {
    if (selectedIds.size === 0) return;
    setUpdating(true);
    try {
      await batchUpdateItemsSeason([...selectedIds], season);
      exitSelectMode();
    } finally {
      setUpdating(false);
    }
  };

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
          selectMode ? (
            <Button variant="ghost" size="sm" onClick={exitSelectMode}>
              <X className="h-4 w-4 mr-1" />
              キャンセル
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectMode(true)}>
                <CheckSquare className="h-4 w-4 mr-1" />
                選択
              </Button>
              <Link href="/items/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  追加
                </Button>
              </Link>
            </div>
          )
        }
      />
      <ItemFilterBar filter={filter} onChange={setFilter} />
      <ItemList
        items={items}
        filter={filter}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />

      {selectMode && selectedIds.size > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:left-[calc(14rem+1rem)] sm:right-4 z-50">
          <div className="bg-slate-800 text-white rounded-xl shadow-lg p-4">
            <p className="text-sm font-medium mb-3">{selectedIds.size}件選択中 — シーズンを変更：</p>
            <div className="flex gap-2 flex-wrap">
              {SEASONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleBatchUpdate(s.value)}
                  disabled={updating}
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
