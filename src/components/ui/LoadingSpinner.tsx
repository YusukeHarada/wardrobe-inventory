import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ className, fullPage }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-200 border-t-slate-700',
        'h-6 w-6',
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="flex h-screen items-center justify-center">{spinner}</div>
    );
  }

  return spinner;
}
