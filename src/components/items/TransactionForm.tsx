'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TransactionType } from '@/types/transaction';
import { todayISO } from '@/lib/utils/date';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  type: z.enum(['purchase', 'disposal']),
  quantity: z.number({ error: '数値を入力してください' }).min(1, '1以上の値を入力してください'),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  memo: z.string().max(500),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormProps {
  maxDisposalQuantity: number;
  defaultType?: TransactionType;
  onSubmit: (
    type: TransactionType,
    quantity: number,
    transactionDate: string,
    memo: string
  ) => Promise<void>;
}

export function TransactionForm({
  maxDisposalQuantity,
  defaultType = 'purchase',
  onSubmit,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      quantity: 1,
      transactionDate: todayISO(),
      memo: '',
    },
  });

  const type = watch('type');

  async function handleFormSubmit(values: FormValues) {
    if (values.type === 'disposal' && values.quantity > maxDisposalQuantity) {
      return;
    }
    await onSubmit(values.type, values.quantity, values.transactionDate, values.memo);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">種別 *</label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setValue('type', 'purchase')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              type === 'purchase'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            購入
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'disposal')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              type === 'disposal'
                ? 'bg-red-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            廃棄
          </button>
        </div>
      </div>

      <Input
        id="quantity"
        label={type === 'purchase' ? '購入数 *' : `廃棄数（最大 ${maxDisposalQuantity}）*`}
        type="number"
        min={1}
        max={type === 'disposal' ? maxDisposalQuantity : undefined}
        error={errors.quantity?.message}
        {...register('quantity', { valueAsNumber: true })}
      />

      <Input
        id="transactionDate"
        label="日付 *"
        type="date"
        max={todayISO()}
        error={errors.transactionDate?.message}
        {...register('transactionDate')}
      />

      <Textarea
        id="memo"
        label="メモ"
        placeholder="備考など"
        error={errors.memo?.message}
        {...register('memo')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '処理中...' : type === 'purchase' ? '購入登録' : '廃棄登録'}
      </Button>
    </form>
  );
}
