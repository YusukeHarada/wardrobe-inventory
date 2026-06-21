'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useItem } from '@/hooks/useItem';
import { updateItem } from '@/lib/firestore/items';
import { ItemFormData } from '@/types/item';
import { PageHeader } from '@/components/layout/PageHeader';
import { ItemForm } from '@/components/items/ItemForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { item, loading } = useItem(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (loading) return <LoadingSpinner fullPage />;
  if (!item) return <p className="text-slate-500">アイテムが見つかりません</p>;

  async function handleSubmit(data: ItemFormData) {
    try {
      await updateItem(id, data);
      router.push(`/items/${id}`);
    } catch {
      setSubmitError('更新に失敗しました。もう一度お試しください。');
    }
  }

  return (
    <div>
      <PageHeader title="アイテム編集" />
      <div className="max-w-lg">
        {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
        <ItemForm defaultValues={item} onSubmit={handleSubmit} submitLabel="更新する" />
      </div>
    </div>
  );
}
