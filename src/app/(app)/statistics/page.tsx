'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { useStatistics } from '@/hooks/useStatistics';
import { PageHeader } from '@/components/layout/PageHeader';
import { CategoryBreakdownChart } from '@/components/statistics/CategoryBreakdownChart';
import { MonthlyExpenseChart } from '@/components/statistics/MonthlyExpenseChart';
import { AnnualSummaryTable } from '@/components/statistics/AnnualSummaryTable';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StatisticsPage() {
  const { user } = useAuth();
  const { items, loading } = useItems(user?.uid ?? null);
  const { categoryStats, monthlyExpenses, annualExpenses } = useStatistics(items, []);
  const [categoryMode, setCategoryMode] = useState<'count' | 'value'>('count');

  if (loading) return <LoadingSpinner fullPage />;

  const totalValue = items.reduce((sum, item) => sum + item.purchasePrice, 0);

  return (
    <div>
      <PageHeader title="統計" />

      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">総アイテム数</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">購入総額</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            ¥{totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">カテゴリ別内訳</p>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setCategoryMode('count')}
                  className={`px-3 py-1 text-xs font-medium ${
                    categoryMode === 'count'
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  件数
                </button>
                <button
                  onClick={() => setCategoryMode('value')}
                  className={`px-3 py-1 text-xs font-medium ${
                    categoryMode === 'value'
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  金額
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart data={categoryStats} mode={categoryMode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-slate-900">月次推移（購入金額）</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[400px]">
                <MonthlyExpenseChart data={monthlyExpenses} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-slate-900">年次サマリー</p>
          </CardHeader>
          <CardContent>
            <AnnualSummaryTable data={annualExpenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
