import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { ReplacementCandidate } from '@/lib/utils/replacement';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ReplacementAlertProps {
  candidates: ReplacementCandidate[];
  maxDisplay?: number;
}

export function ReplacementAlert({ candidates, maxDisplay = 3 }: ReplacementAlertProps) {
  if (candidates.length === 0) return null;

  const displayed = candidates.slice(0, maxDisplay);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-900">買い替え候補</span>
            <Badge variant="warning">{candidates.length}</Badge>
          </div>
          <Link
            href="/replacements"
            className="flex items-center text-xs text-slate-500 hover:text-slate-700"
          >
            すべて見る
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-slate-50">
          {displayed.map((c) => (
            <li key={c.item.id} className="py-2">
              <Link
                href={`/items/${c.item.id}`}
                className="flex items-center justify-between hover:text-slate-600"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.item.name}</p>
                  <p className="text-xs text-slate-500">{c.item.category}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
