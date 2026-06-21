'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  AlertTriangle,
  Heart,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SeasonToggle } from './SeasonToggle';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'ホーム', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/items', label: 'アイテム', icon: <Shirt className="h-5 w-5" /> },
  { href: '/replacements', label: '買い替え', icon: <AlertTriangle className="h-5 w-5" /> },
  { href: '/wishlist', label: 'ほしい物', icon: <Heart className="h-5 w-5" /> },
  { href: '/statistics', label: '統計', icon: <BarChart2 className="h-5 w-5" /> },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden sm:flex sm:flex-col sm:fixed sm:inset-y-0 sm:left-0 sm:w-56 sm:border-r sm:border-slate-200 sm:bg-white sm:py-4 sm:px-3">
        <div className="mb-6 px-2">
          <h1 className="text-base font-bold text-slate-800">Wardrobe</h1>
          <p className="text-xs text-slate-500">資産管理</p>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2 px-1">表示シーズン</p>
          <SeasonToggle />
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-slate-900'
                  : 'text-slate-400'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
