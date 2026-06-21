'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ActiveSeason = 'spring_summer' | 'fall_winter';

interface SeasonContextValue {
  activeSeason: ActiveSeason;
  setActiveSeason: (season: ActiveSeason) => void;
}

const SeasonContext = createContext<SeasonContextValue>({
  activeSeason: 'spring_summer',
  setActiveSeason: () => {},
});

function getDefaultSeason(): ActiveSeason {
  const month = new Date().getMonth() + 1;
  return month >= 4 && month <= 9 ? 'spring_summer' : 'fall_winter';
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [activeSeason, setActiveSeasonState] = useState<ActiveSeason>(getDefaultSeason);

  useEffect(() => {
    const saved = localStorage.getItem('activeSeason');
    if (saved === 'spring_summer' || saved === 'fall_winter') {
      setActiveSeasonState(saved);
    }
  }, []);

  const setActiveSeason = (season: ActiveSeason) => {
    setActiveSeasonState(season);
    localStorage.setItem('activeSeason', season);
  };

  return (
    <SeasonContext.Provider value={{ activeSeason, setActiveSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  return useContext(SeasonContext);
}
