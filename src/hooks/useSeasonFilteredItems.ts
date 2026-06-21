import { useMemo } from 'react';
import { useItems } from './useItems';
import { useSeason } from '@/contexts/SeasonContext';

export function useSeasonFilteredItems(userId: string | null) {
  const { items, loading, error } = useItems(userId);
  const { activeSeason } = useSeason();

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const s = item.season ?? 'all_season';
        return s === 'all_season' || s === activeSeason;
      }),
    [items, activeSeason]
  );

  return { items: filteredItems, loading, error };
}
