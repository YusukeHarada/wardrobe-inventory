import { AnnualExpense } from '@/lib/utils/statistics';

interface AnnualSummaryTableProps {
  data: AnnualExpense[];
}

export function AnnualSummaryTable({ data }: AnnualSummaryTableProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">データがありません</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100">
          <th className="py-2 text-left font-medium text-slate-600">年</th>
          <th className="py-2 text-right font-medium text-slate-600">購入総額</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.year} className="border-b border-slate-50">
            <td className="py-2 text-slate-900">{row.year}年</td>
            <td className="py-2 text-right text-slate-900">¥{row.total.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
