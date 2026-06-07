import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ageInMonths, isExpired, formatDateJa } from '@/lib/utils/date';

describe('ageInMonths', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for today', () => {
    vi.setSystemTime(new Date('2026-06-01'));
    expect(ageInMonths('2026-06-01')).toBe(0);
  });

  it('returns 13 for 13 months ago', () => {
    vi.setSystemTime(new Date('2026-06-01'));
    expect(ageInMonths('2025-05-01')).toBe(13);
  });
});

describe('isExpired', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false when expectedLifeMonths is 0 (indefinite)', () => {
    expect(isExpired({ purchaseDate: '2020-01-01', expectedLifeMonths: 0 })).toBe(false);
  });

  it('returns true when age exceeds expected life', () => {
    expect(isExpired({ purchaseDate: '2025-05-01', expectedLifeMonths: 12 })).toBe(true);
  });

  it('returns true at exactly expected life boundary', () => {
    expect(isExpired({ purchaseDate: '2025-06-01', expectedLifeMonths: 12 })).toBe(true);
  });

  it('returns false when within expected life', () => {
    expect(isExpired({ purchaseDate: '2026-01-01', expectedLifeMonths: 12 })).toBe(false);
  });
});

describe('formatDateJa', () => {
  it('formats ISO date to Japanese year/month', () => {
    expect(formatDateJa('2026-03-15')).toBe('2026年3月');
  });
});
