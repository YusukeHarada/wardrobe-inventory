import Link from 'next/link';
import { Item } from '@/types/item';
import { ageInMonths, formatDateShort } from '@/lib/utils/date';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { ItemStatusBadge } from './ItemStatusBadge';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const age = ageInMonths(item.purchaseDate);

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{item.name}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <Badge>{item.category}</Badge>
                <Badge variant="info">
                  {item.managementType === 'individual' ? '個体' : 'ロット'}
                </Badge>
              </div>
            </div>
            <ItemStatusBadge item={item} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
            <div>
              <span className="font-medium text-slate-600">購入日：</span>
              {formatDateShort(item.purchaseDate)}
            </div>
            <div>
              <span className="font-medium text-slate-600">経過：</span>
              {age}ヶ月
              {item.expectedLifeMonths > 0 && ` / ${item.expectedLifeMonths}ヶ月`}
            </div>
            {item.purchasePrice > 0 && (
              <div>
                <span className="font-medium text-slate-600">価格：</span>
                ¥{item.purchasePrice.toLocaleString()}
              </div>
            )}
            {item.managementType === 'lot' && (
              <div>
                <span className="font-medium text-slate-600">残数：</span>
                {item.remainingQuantity} / {item.quantity}
              </div>
            )}
          </div>

          {item.managementType === 'lot' && item.quantity > 0 && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (item.remainingQuantity / item.quantity) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
