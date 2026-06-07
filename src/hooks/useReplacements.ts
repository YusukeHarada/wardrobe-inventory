import { useMemo } from 'react';
import { Item } from '@/types/item';
import { computeReplacementCandidates, ReplacementCandidate } from '@/lib/utils/replacement';

export function useReplacements(items: Item[]): ReplacementCandidate[] {
  return useMemo(() => computeReplacementCandidates(items), [items]);
}
