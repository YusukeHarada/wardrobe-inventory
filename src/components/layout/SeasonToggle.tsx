'use client';

import { Sun, Snowflake } from 'lucide-react';
import { useSeason } from '@/contexts/SeasonContext';
import { cn } from '@/lib/utils/cn';

interface SeasonToggleProps {
  className?: string;
}

export function SeasonToggle({ className }: SeasonToggleProps) {
  const { activeSeason, setActiveSeason } = useSeason();

  return (
    <div className={cn('flex rounded-lg border border-slate-200 overflow-hidden', className)}>
      <button
        onClick={() => setActiveSeason('spring_summer')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors',
          activeSeason === 'spring_summer'
            ? 'bg-sky-100 text-sky-700'
            : 'bg-white text-slate-500 hover:bg-slate-50'
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        春夏
      </button>
      <button
        onClick={() => setActiveSeason('fall_winter')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors',
          activeSeason === 'fall_winter'
            ? 'bg-slate-700 text-white'
            : 'bg-white text-slate-500 hover:bg-slate-50'
        )}
      >
        <Snowflake className="h-3.5 w-3.5" />
        秋冬
      </button>
    </div>
  );
}
