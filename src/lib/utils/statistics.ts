import { format, parseISO } from 'date-fns';
import { Item, Category } from '@/types/item';
import { Transaction } from '@/types/transaction';

export interface CategoryStat {
  category: Category;
  count: number;
  totalValue: number;
}

export interface MonthlyExpense {
  month: string;
  purchaseAmount: number;
  disposalCount: number;
}

export interface AnnualExpense {
  year: number;
  total: number;
}

export function groupByCategory(items: Item[]): CategoryStat[] {
  const map = new Map<Category, CategoryStat>();

  for (const item of items) {
    const existing = map.get(item.category);
    if (existing) {
      existing.count += 1;
      existing.totalValue += item.purchasePrice;
    } else {
      map.set(item.category, {
        category: item.category,
        count: 1,
        totalValue: item.purchasePrice,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function monthlyExpenseBreakdown(
  items: Item[],
  transactions: Transaction[]
): MonthlyExpense[] {
  const itemPriceMap = new Map<string, number>(
    items.map((i) => [i.id, i.purchasePrice])
  );

  const map = new Map<string, MonthlyExpense>();

  for (const tx of transactions) {
    const month = format(parseISO(tx.transactionDate), 'yyyy-MM');
    const existing = map.get(month) ?? {
      month,
      purchaseAmount: 0,
      disposalCount: 0,
    };

    if (tx.type === 'purchase') {
      const price = itemPriceMap.get(tx.itemId) ?? 0;
      existing.purchaseAmount += price * tx.quantity;
    } else {
      existing.disposalCount += tx.quantity;
    }

    map.set(month, existing);
  }

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

export function annualExpenseBreakdown(
  items: Item[],
  transactions: Transaction[]
): AnnualExpense[] {
  const itemPriceMap = new Map<string, number>(
    items.map((i) => [i.id, i.purchasePrice])
  );

  const map = new Map<number, number>();

  for (const tx of transactions) {
    if (tx.type !== 'purchase') continue;
    const year = parseISO(tx.transactionDate).getFullYear();
    const price = itemPriceMap.get(tx.itemId) ?? 0;
    map.set(year, (map.get(year) ?? 0) + price * tx.quantity);
  }

  return Array.from(map.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);
}
