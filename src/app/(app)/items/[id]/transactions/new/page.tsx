'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useItem } from '@/hooks/useItem';
import { createTransaction } from '@/lib/firestore/transactions';
import { TransactionType } from '@/types/transaction';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionForm } from '@/components/items/TransactionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function TransactionFormWrapper() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { item, loading } = useItem(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultType = (searchParams.get('type') as TransactionType) ?? 'purchase';

  if (loading) return <LoadingSpinner fullPage />;
  if (!item) return <p className="text-slate-500">アイテムが見つかりません</p>;

  async function handleSubmit(
    type: TransactionType,
    quantity: number,
    transactionDate: string,
    memo: string
  ) {
    if (!user) return;
    try {
      await createTransaction(id, user.uid, type, quantity, transactionDate, memo);
      router.push(`/items/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : '登録に失敗しました。もう一度お試しください。';
      setSubmitError(message);
    }
  }

  return (
    <div>
      <PageHeader title={item.name} description="購入 / 廃棄の登録" />
      <div className="max-w-sm">
        {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
        <TransactionForm
          maxDisposalQuantity={item.remainingQuantity}
          defaultType={defaultType}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default function NewTransactionPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <TransactionFormWrapper />
    </Suspense>
  );
}
