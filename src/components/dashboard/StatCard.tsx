import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, description, className }: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
          </div>
          {icon && <div className="text-slate-300">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
