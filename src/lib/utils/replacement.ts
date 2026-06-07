import { Item } from '@/types/item';
import { LOT_LOW_STOCK_THRESHOLD } from '@/lib/constants';
import { isExpired } from './date';

export type ReplacementReason = 'expired' | 'low_stock' | 'expired_and_low_stock';

export interface ReplacementCandidate {
  item: Item;
  reason: ReplacementReason;
}

export function computeReplacementCandidates(items: Item[]): ReplacementCandidate[] {
  const candidates: ReplacementCandidate[] = [];

  for (const item of items) {
    const expired = isExpired(item);

    if (item.managementType === 'individual') {
      if (expired) {
        candidates.push({ item, reason: 'expired' });
      }
    } else {
      const lowStock =
        item.quantity > 0 &&
        item.remainingQuantity / item.quantity <= LOT_LOW_STOCK_THRESHOLD;

      if (expired && lowStock) {
        candidates.push({ item, reason: 'expired_and_low_stock' });
      } else if (expired) {
        candidates.push({ item, reason: 'expired' });
      } else if (lowStock) {
        candidates.push({ item, reason: 'low_stock' });
      }
    }
  }

  return candidates;
}
