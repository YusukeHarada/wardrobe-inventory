import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computeReplacementCandidates } from '@/lib/utils/replacement';
import { Item } from '@/types/item';

const baseItem: Item = {
  id: '1',
  userId: 'u1',
  name: 'Test',
  category: '衣類',
  managementType: 'individual',
  season: 'all_season',
  purchaseDate: '2024-01-01',
  purchasePrice: 10000,
  expectedLifeMonths: 12,
  quantity: 0,
  remainingQuantity: 0,
  memo: '',
  createdAt: '',
  updatedAt: '',
};

describe('computeReplacementCandidates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty array for empty input', () => {
    expect(computeReplacementCandidates([])).toEqual([]);
  });

  it('includes individual item past expected life', () => {
    const item = { ...baseItem, purchaseDate: '2025-05-01', expectedLifeMonths: 12 };
    const result = computeReplacementCandidates([item]);
    expect(result).toHaveLength(1);
    expect(result[0].reason).toBe('expired');
  });

  it('excludes individual item within expected life', () => {
    const item = { ...baseItem, purchaseDate: '2026-01-01', expectedLifeMonths: 12 };
    expect(computeReplacementCandidates([item])).toHaveLength(0);
  });

  it('includes lot item with low stock (20%)', () => {
    const item: Item = {
      ...baseItem,
      managementType: 'lot',
      purchaseDate: '2026-01-01',
      expectedLifeMonths: 0,
      quantity: 10,
      remainingQuantity: 2,
    };
    const result = computeReplacementCandidates([item]);
    expect(result).toHaveLength(1);
    expect(result[0].reason).toBe('low_stock');
  });

  it('excludes lot item with sufficient stock (30%)', () => {
    const item: Item = {
      ...baseItem,
      managementType: 'lot',
      purchaseDate: '2026-01-01',
      expectedLifeMonths: 0,
      quantity: 10,
      remainingQuantity: 3,
    };
    expect(computeReplacementCandidates([item])).toHaveLength(0);
  });

  it('marks lot item as expired_and_low_stock when both conditions met', () => {
    const item: Item = {
      ...baseItem,
      managementType: 'lot',
      purchaseDate: '2024-01-01',
      expectedLifeMonths: 12,
      quantity: 10,
      remainingQuantity: 2,
    };
    const result = computeReplacementCandidates([item]);
    expect(result).toHaveLength(1);
    expect(result[0].reason).toBe('expired_and_low_stock');
  });

  it('includes expired lot with sufficient remaining stock', () => {
    const item: Item = {
      ...baseItem,
      managementType: 'lot',
      purchaseDate: '2024-01-01',
      expectedLifeMonths: 12,
      quantity: 10,
      remainingQuantity: 8,
    };
    const result = computeReplacementCandidates([item]);
    expect(result).toHaveLength(1);
    expect(result[0].reason).toBe('expired');
  });
});
