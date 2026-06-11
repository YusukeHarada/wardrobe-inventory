'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createItem } from '@/lib/firestore/items';
import { ItemFormData } from '@/types/item';
import { PageHeader } from '@/components/layout/PageHeader';
import { ItemForm } from '@/components/items/ItemForm';

function NewItemForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultName = searchParams.get('name') ?? undefined;
  const defaultCategory = searchParams.get('category') ?? undefined;
  const defaultPrice = searchParams.get('price') ? Number(searchParams.get('price')) : undefined;

  async function handleSubmit(data: ItemFormData) {
    if (!user) return;
    try {
      await createItem(user.uid, data);
      router.push('/items');
    } catch {
      setSubmitError('登録に失敗しました。もう一度お試しください。');
    }
  }

  return (
    <>
      {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
      <ItemForm
        onSubmit={handleSubmit}
        submitLabel="登録する"
        defaultValues={{
          name: defaultName,
          category: defaultCategory as ItemFormData['category'] | undefined,
          purchasePrice: defaultPrice,
        }}
      />
    </>
  );
}

export default function NewItemPage() {
  return (
    <div>
      <PageHeader title="アイテム登録" />
      <div className="max-w-lg">
        <Suspense fallback={null}>
          <NewItemForm />
        </Suspense>
      </div>
    </div>
  );
}
