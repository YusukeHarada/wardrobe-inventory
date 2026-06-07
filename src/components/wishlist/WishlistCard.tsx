'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { WishlistItem } from '@/types/wishlist';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface WishlistCardProps {
  item: WishlistItem;
  onDelete: (id: string) => void;
}

export function WishlistCard({ item, onDelete }: WishlistCardProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate">{item.name}</p>
            <Badge className="mt-1">{item.category}</Badge>
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.expectedPrice > 0 && (
          <p className="text-sm text-slate-600 mb-2">
            想定価格：¥{item.expectedPrice.toLocaleString()}
          </p>
        )}

        {item.memo && <p className="text-xs text-slate-500 mb-3">{item.memo}</p>}

        <Link
          href={`/items/new?from=wishlist&name=${encodeURIComponent(item.name)}&category=${encodeURIComponent(item.category)}&price=${item.expectedPrice}`}
        >
          <Button variant="secondary" size="sm" className="w-full">
            購入済みとして登録
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
