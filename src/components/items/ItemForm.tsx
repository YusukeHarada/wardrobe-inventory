'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Item, ItemFormData } from '@/types/item';
import { CATEGORIES, MANAGEMENT_TYPES, EXPECTED_LIFE_PRESETS, SEASONS } from '@/lib/constants';
import { todayISO } from '@/lib/utils/date';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z
  .object({
    name: z.string().min(1, '名前を入力してください').max(100),
    category: z.enum(['衣類', '靴', '靴下', '下着', 'バッグ', '帽子', 'その他']),
    managementType: z.enum(['individual', 'lot']),
    season: z.enum(['spring_summer', 'fall_winter', 'all_season']),
    purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付を入力してください'),
    purchasePrice: z.number({ error: '数値を入力してください' }).min(0, '0以上の値を入力してください'),
    expectedLifeMonths: z.number({ error: '数値を入力してください' }).min(0).max(600),
    quantity: z.number().min(1).optional(),
    remainingQuantity: z.number().min(0).optional(),
    memo: z.string().max(500),
  })
  .superRefine((data, ctx) => {
    if (data.managementType === 'lot') {
      if (data.quantity === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: '総数を入力してください', path: ['quantity'] });
      }
      if (data.remainingQuantity === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: '残数を入力してください', path: ['remainingQuantity'] });
      }
      if (data.quantity !== undefined && data.remainingQuantity !== undefined && data.remainingQuantity > data.quantity) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: '残数は総数以下である必要があります', path: ['remainingQuantity'] });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

interface ItemFormProps {
  defaultValues?: Partial<Item>;
  onSubmit: (data: ItemFormData) => Promise<void>;
  submitLabel?: string;
}

export function ItemForm({ defaultValues, onSubmit, submitLabel = '登録' }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? '衣類',
      managementType: defaultValues?.managementType ?? 'individual',
      season: defaultValues?.season ?? 'all_season',
      purchaseDate: defaultValues?.purchaseDate ?? todayISO(),
      purchasePrice: defaultValues?.purchasePrice ?? 0,
      expectedLifeMonths: defaultValues?.expectedLifeMonths ?? 12,
      quantity: defaultValues?.quantity,
      remainingQuantity: defaultValues?.remainingQuantity,
      memo: defaultValues?.memo ?? '',
    },
  });

  const managementType = watch('managementType');
  const season = watch('season');

  async function handleFormSubmit(values: FormValues) {
    const data: ItemFormData = {
      name: values.name,
      category: values.category,
      managementType: values.managementType,
      season: values.season,
      purchaseDate: values.purchaseDate,
      purchasePrice: values.purchasePrice,
      expectedLifeMonths: values.expectedLifeMonths,
      quantity: values.managementType === 'lot' ? (values.quantity ?? 1) : 0,
      remainingQuantity:
        values.managementType === 'lot' ? (values.remainingQuantity ?? values.quantity ?? 1) : 0,
      memo: values.memo,
    };
    await onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="name"
        label="名称 *"
        placeholder="例：黒ソックス、チェスターコート"
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">管理方式 *</label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          {MANAGEMENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue('managementType', t.value)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                managementType === t.value
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">シーズン</label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          {SEASONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setValue('season', s.value)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                season === s.value
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {managementType === 'lot' && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="quantity"
            label="総数 *"
            type="number"
            min={1}
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />
          <Input
            id="remainingQuantity"
            label="残数 *"
            type="number"
            min={0}
            error={errors.remainingQuantity?.message}
            {...register('remainingQuantity', { valueAsNumber: true })}
          />
        </div>
      )}

      <Input
        id="purchaseDate"
        label="購入日 *"
        type="date"
        max={todayISO()}
        error={errors.purchaseDate?.message}
        {...register('purchaseDate')}
      />

      <Input
        id="purchasePrice"
        label="購入価格（円）"
        type="number"
        min={0}
        error={errors.purchasePrice?.message}
        {...register('purchasePrice', { valueAsNumber: true })}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          想定寿命（0=無期限）
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {EXPECTED_LIFE_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setValue('expectedLifeMonths', p.value)}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {p.label}
            </button>
          ))}
        </div>
        <Input
          id="expectedLifeMonths"
          type="number"
          min={0}
          placeholder="月数を入力（0=無期限）"
          error={errors.expectedLifeMonths?.message}
          {...register('expectedLifeMonths', { valueAsNumber: true })}
        />
      </div>

      <Textarea
        id="memo"
        label="メモ"
        placeholder="ブランド、サイズ、色など"
        error={errors.memo?.message}
        {...register('memo')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '処理中...' : submitLabel}
      </Button>
    </form>
  );
}
