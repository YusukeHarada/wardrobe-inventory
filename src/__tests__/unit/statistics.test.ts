import { describe, it, expect } from 'vitest';
import { groupByCategory, monthlyExpenseBreakdown, annualExpenseBreakdown } from '@/lib/utils/statistics';
import { Item } from '@/types/item';
import { Transaction } from '@/types/transaction';

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: '1',
  userId: 'u1',
  name: 'Test',
  category: '衣類',
  managementType: 'individual',
  purchaseDate: '2026-01-01',
  purchasePrice: 10000,
  expectedLifeMonths: 12,
  quantity: 0,
  remainingQuantity: 0,
  memo: '',
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

const makeTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx1',
  itemId: '1',
  userId: 'u1',
  type: 'purchase',
  quantity: 1,
  transactionDate: '2026-01-15',
  memo: '',
  createdAt: '',
  ...overrides,
});

describe('groupByCategory', () => {
  it('groups items by category with correct counts and totals', () => {
    const items = [
      makeItem({ id: '1', category: '衣類', purchasePrice: 5000 }),
      makeItem({ id: '2', category: '衣類', purchasePrice: 3000 }),
      makeItem({ id: '3', category: '靴', purchasePrice: 20000 }),
    ];
    const result = groupByCategory(items);
    const clothing = result.find((r) => r.category === '衣類')!;
    const shoes = result.find((r) => r.category === '靴')!;
    expect(clothing.count).toBe(2);
    expect(clothing.totalValue).toBe(8000);
    expect(shoes.count).toBe(1);
    expect(shoes.totalValue).toBe(20000);
  });

  it('returns empty array for empty input', () => {
    expect(groupByCategory([])).toEqual([]);
  });
});

describe('monthlyExpenseBreakdown', () => {
  it('aggregates purchase amounts and disposal counts by month', () => {
    const items = [makeItem({ id: '1', purchasePrice: 1000 })];
    const txs = [
      makeTx({ type: 'purchase', quantity: 2, transactionDate: '2026-01-10' }),
      makeTx({ id: 'tx2', type: 'disposal', quantity: 1, transactionDate: '2026-01-20' }),
      makeTx({ id: 'tx3', type: 'purchase', quantity: 3, transactionDate: '2026-02-05' }),
    ];
    const result = monthlyExpenseBreakdown(items, txs);
    const jan = result.find((r) => r.month === '2026-01')!;
    const feb = result.find((r) => r.month === '2026-02')!;
    expect(jan.purchaseAmount).toBe(2000);
    expect(jan.disposalCount).toBe(1);
    expect(feb.purchaseAmount).toBe(3000);
  });
});

describe('annualExpenseBreakdown', () => {
  it('sums purchase amounts by year', () => {
    const items = [makeItem({ id: '1', purchasePrice: 5000 })];
    const txs = [
      makeTx({ transactionDate: '2025-06-01', quantity: 1 }),
      makeTx({ id: 'tx2', transactionDate: '2026-03-01', quantity: 2 }),
    ];
    const result = annualExpenseBreakdown(items, txs);
    expect(result.find((r) => r.year === 2025)?.total).toBe(5000);
    expect(result.find((r) => r.year === 2026)?.total).toBe(10000);
  });
});
