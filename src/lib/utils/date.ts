import { differenceInMonths, format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Item } from '@/types/item';

export function ageInMonths(purchaseDateISO: string): number {
  return differenceInMonths(new Date(), parseISO(purchaseDateISO));
}

export function isExpired(item: Pick<Item, 'purchaseDate' | 'expectedLifeMonths'>): boolean {
  if (item.expectedLifeMonths === 0) return false;
  return ageInMonths(item.purchaseDate) >= item.expectedLifeMonths;
}

export function formatDateJa(isoDate: string): string {
  return format(parseISO(isoDate), 'yyyy年M月', { locale: ja });
}

export function formatDateShort(isoDate: string): string {
  return format(parseISO(isoDate), 'yyyy/MM/dd');
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM');
}
