'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyExpense } from '@/lib/utils/statistics';

interface MonthlyExpenseChartProps {
  data: MonthlyExpense[];
}

export function MonthlyExpenseChart({ data }: MonthlyExpenseChartProps) {
  const last12 = data.slice(-12).map((d) => ({
    ...d,
    monthLabel: d.month.replace(/^(\d{4})-(\d{2})$/, '$1/$2'),
  }));

  if (last12.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={last12} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value, name) => {
            const n = Number(value ?? 0);
            if (name === '購入金額') return `¥${n.toLocaleString()}`;
            return `${n}点`;
          }}
        />
        <Legend />
        <Bar dataKey="purchaseAmount" name="購入金額" fill="#334155" />
        <Bar dataKey="disposalCount" name="廃棄数" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
