'use client';

import { Category, ManagementType } from '@/types/item';
import { CATEGORIES } from '@/lib/constants';
import { Search } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  categoryFilter: Category | 'all';
  managementTypeFilter: ManagementType | 'all';
  sortBy: 'createdAt' | 'purchaseDate' | 'name' | 'price';
  sortOrder: 'asc' | 'desc';
}

interface ItemFilterBarProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

export function ItemFilterBar({ filter, onChange }: ItemFilterBarProps) {
  return (
    <div className="space-y-3 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="名前で検索..."
          value={filter.searchQuery}
          onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
          className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.categoryFilter}
          onChange={(e) =>
            onChange({ ...filter, categoryFilter: e.target.value as Category | 'all' })
          }
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white"
        >
          <option value="all">すべてのカテゴリ</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filter.managementTypeFilter}
          onChange={(e) =>
            onChange({
              ...filter,
              managementTypeFilter: e.target.value as ManagementType | 'all',
            })
          }
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white"
        >
          <option value="all">すべての管理方式</option>
          <option value="individual">個体管理</option>
          <option value="lot">ロット管理</option>
        </select>

        <select
          value={`${filter.sortBy}_${filter.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('_') as [
              FilterState['sortBy'],
              FilterState['sortOrder'],
            ];
            onChange({ ...filter, sortBy, sortOrder });
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white"
        >
          <option value="createdAt_desc">登録順（新しい）</option>
          <option value="createdAt_asc">登録順（古い）</option>
          <option value="purchaseDate_desc">購入日（新しい）</option>
          <option value="purchaseDate_asc">購入日（古い）</option>
          <option value="name_asc">名前（昇順）</option>
          <option value="price_desc">価格（高い）</option>
        </select>
      </div>
    </div>
  );
}
