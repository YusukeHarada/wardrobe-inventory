'use client';

import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { useReplacements } from '@/hooks/useReplacements';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReplacementCard } from '@/components/replacements/ReplacementCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ReplacementsPage() {
  const { user } = useAuth();
  const { items, loading } = useItems(user?.uid ?? null);
  const candidates = useReplacements(items);

  if (loading) return <LoadingSpinner fullPage />;

  const expired = candidates.filter(
    (c) => c.reason === 'expired' || c.reason === 'expired_and_low_stock'
  );
  const lowStock = candidates.filter((c) => c.reason === 'low_stock');

  return (
    <div>
      <PageHeader
        title="買い替え候補"
        description={`${candidates.length}件`}
      />

      {candidates.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle className="h-12 w-12" />}
          title="買い替え候補はありません"
          description="すべてのアイテムが良好な状態です"
        />
      ) : (
        <div className="space-y-6">
          {expired.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                期限超過 ({expired.length}件)
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {expired.map((c) => (
                  <ReplacementCard key={c.item.id} candidate={c} />
                ))}
              </div>
            </section>
          )}

          {lowStock.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                在庫少 ({lowStock.length}件)
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {lowStock.map((c) => (
                  <ReplacementCard key={c.item.id} candidate={c} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
