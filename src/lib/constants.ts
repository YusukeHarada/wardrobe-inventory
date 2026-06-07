import { Category, ManagementType } from '@/types/item';

export const CATEGORIES: Category[] = [
  '衣類',
  '靴',
  '靴下',
  '下着',
  'バッグ',
  '帽子',
  'その他',
];

export const MANAGEMENT_TYPES: { value: ManagementType; label: string }[] = [
  { value: 'individual', label: '個体管理' },
  { value: 'lot', label: 'ロット管理' },
];

export const MANAGEMENT_TYPE_LABELS: Record<ManagementType, string> = {
  individual: '個体管理',
  lot: 'ロット管理',
};

export const LOT_LOW_STOCK_THRESHOLD = 0.25;

export const EXPECTED_LIFE_PRESETS = [
  { label: '3ヶ月', value: 3 },
  { label: '6ヶ月', value: 6 },
  { label: '1年', value: 12 },
  { label: '2年', value: 24 },
  { label: '3年', value: 36 },
  { label: '5年', value: 60 },
];
