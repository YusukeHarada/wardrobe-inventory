'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryStat } from '@/lib/utils/statistics';

interface CategoryBreakdownChartProps {
  data: CategoryStat[];
  mode: 'count' | 'value';
}

const COLORS = ['#334155', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export function CategoryBreakdownChart({ data, mode }: CategoryBreakdownChartProps) {
  const chartData = data.map((d) => ({
    name: d.category,
    value: mode === 'count' ? d.count : d.totalValue,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const n = Number(value ?? 0);
            return mode === 'value' ? `¥${n.toLocaleString()}` : `${n}点`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
