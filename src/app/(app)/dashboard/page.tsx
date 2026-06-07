'use client';

import { format } from 'date-fns';
import { Package, AlertTriangle, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { useReplacements } from '@/hooks/useReplacements';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { ReplacementAlert } from '@/components/dashboard/ReplacementAlert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { items, loading } = useItems(user?.uid ?? null);
  const replacements = useReplacements(items);
  const router = useRouter();

  const currentMonth = format(new Date(), 'yyyy-MM');

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader
        title="ダッシュボード"
        description={user?.displayName ? `こんにちは、${user.displayName}さん` : undefined}
        action={
          <Button variant="ghost" size="sm" onClick={signOut}>
            ログアウト
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <StatCard
          title="保有アイテム"
          value={items.length}
          icon={<Package className="h-6 w-6" />}
          description="件"
        />
        <StatCard
          title="買い替え候補"
          value={replacements.length}
          icon={<AlertTriangle className="h-6 w-6" />}
          description="件"
          className={replacements.length > 0 ? 'border-amber-200 bg-amber-50' : ''}
        />
      </div>

      {replacements.length > 0 && (
        <div className="mb-6">
          <ReplacementAlert candidates={replacements} />
        </div>
      )}

      <div className="mt-4">
        <Button onClick={() => router.push('/items/new')} className="w-full sm:w-auto">
          アイテムを追加する
        </Button>
      </div>
    </div>
  );
}
