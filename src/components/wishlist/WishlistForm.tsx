'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WishlistItem, WishlistFormData } from '@/types/wishlist';
import { CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(1, '名前を入力してください').max(100),
  category: z.enum(['衣類', '靴', '靴下', '下着', 'バッグ', '帽子', 'その他']),
  expectedPrice: z.number({ error: '数値を入力してください' }).min(0),
  memo: z.string().max(500),
});

type FormValues = z.infer<typeof schema>;

interface WishlistFormProps {
  defaultValues?: Partial<WishlistItem>;
  onSubmit: (data: WishlistFormData) => Promise<void>;
  submitLabel?: string;
}

export function WishlistForm({ defaultValues, onSubmit, submitLabel = '追加' }: WishlistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? '衣類',
      expectedPrice: defaultValues?.expectedPrice ?? 0,
      memo: defaultValues?.memo ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="商品名 *"
        placeholder="例：白いシャツ"
        error={errors.name?.message}
        {...register('name')}
      />

      <Select
        id="category"
        label="カテゴリ *"
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        error={errors.category?.message}
        {...register('category')}
      />

      <Input
        id="expectedPrice"
        label="想定価格（円）"
        type="number"
        min={0}
        error={errors.expectedPrice?.message}
        {...register('expectedPrice', { valueAsNumber: true })}
      />

      <Textarea
        id="memo"
        label="メモ"
        placeholder="ブランド、参考URL、メモなど"
        error={errors.memo?.message}
        {...register('memo')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '処理中...' : submitLabel}
      </Button>
    </form>
  );
}
