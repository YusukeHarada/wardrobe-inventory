import { useMemo } from 'react';
import { Item } from '@/types/item';
import { Transaction } from '@/types/transaction';
import {
  groupByCategory,
  monthlyExpenseBreakdown,
  annualExpenseBreakdown,
  CategoryStat,
  MonthlyExpense,
  AnnualExpense,
} from '@/lib/utils/statistics';

export function useStatistics(items: Item[], transactions: Transaction[]) {
  const categoryStats: CategoryStat[] = useMemo(
    () => groupByCategory(items),
    [items]
  );

  const monthlyExpenses: MonthlyExpense[] = useMemo(
    () => monthlyExpenseBreakdown(items, transactions),
    [items, transactions]
  );

  const annualExpenses: AnnualExpense[] = useMemo(
    () => annualExpenseBreakdown(items, transactions),
    [items, transactions]
  );

  return { categoryStats, monthlyExpenses, annualExpenses };
}
