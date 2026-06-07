import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { ReplacementCandidate } from '@/lib/utils/replacement';
import { ageInMonths, formatDateShort } from '@/lib/utils/date';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ReplacementCardProps {
  candidate: ReplacementCandidate;
}

const reasonLabels: Record<ReplacementCandidate['reason'], { label: string; variant: 'danger' | 'warning' }> = {
  expired: { label: '期限超過', variant: 'danger' },
  low_stock: { label: '在庫少', variant: 'warning' },
  expired_and_low_stock: { label: '期限超過・在庫少', variant: 'danger' },
};

export function ReplacementCard({ candidate }: ReplacementCardProps) {
  const { item, reason } = candidate;
  const age = ageInMonths(item.purchaseDate);
  const reasonInfo = reasonLabels[reason];

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="font-medium text-slate-900 truncate">{item.name}</p>
          </div>
          <Badge variant={reasonInfo.variant}>{reasonInfo.label}</Badge>
        </div>

        <div className="text-xs text-slate-500 space-y-0.5 mb-3">
          <p>
            <span className="font-medium text-slate-600">カテゴリ：</span>
            {item.category}
          </p>
          <p>
            <span className="font-medium text-slate-600">購入日：</span>
            {formatDateShort(item.purchaseDate)}
          </p>
          <p>
            <span className="font-medium text-slate-600">経過：</span>
            {age}ヶ月
            {item.expectedLifeMonths > 0 && ` / 想定${item.expectedLifeMonths}ヶ月`}
          </p>
          {item.managementType === 'lot' && (
            <p>
              <span className="font-medium text-slate-600">残数：</span>
              {item.remainingQuantity} / {item.quantity}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/items/${item.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              詳細
            </Button>
          </Link>
          {item.managementType === 'lot' && (
            <Link href={`/items/${item.id}/transactions/new?type=purchase`} className="flex-1">
              <Button size="sm" className="w-full">
                購入登録
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
