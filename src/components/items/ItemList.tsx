import { useMemo } from 'react';
import { Package } from 'lucide-react';
import { Item } from '@/types/item';
import { ageInMonths } from '@/lib/utils/date';
import { FilterState } from './ItemFilterBar';
import { ItemCard } from './ItemCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ItemListProps {
  items: Item[];
  filter: FilterState;
  selectMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export function ItemList({ items, filter, selectMode, selectedIds, onToggleSelect }: ItemListProps) {
  const filtered = useMemo(() => {
    let result = [...items];

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    if (filter.categoryFilter !== 'all') {
      result = result.filter((item) => item.category === filter.categoryFilter);
    }

    if (filter.managementTypeFilter !== 'all') {
      result = result.filter((item) => item.managementType === filter.managementTypeFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (filter.sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name, 'ja');
          break;
        case 'purchaseDate':
          cmp = a.purchaseDate.localeCompare(b.purchaseDate);
          break;
        case 'price':
          cmp = a.purchasePrice - b.purchasePrice;
          break;
        default:
          cmp = a.createdAt.localeCompare(b.createdAt);
      }
      return filter.sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [items, filter]);

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="アイテムが見つかりません"
        description={
          filter.searchQuery || filter.categoryFilter !== 'all'
            ? '検索条件を変更してください'
            : undefined
        }
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          selectMode={selectMode}
          selected={selectedIds?.has(item.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
