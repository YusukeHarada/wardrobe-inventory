import { ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { NavBar } from '@/components/layout/NavBar';
import { SeasonProvider } from '@/contexts/SeasonContext';
import { SeasonToggle } from '@/components/layout/SeasonToggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SeasonProvider>
        <div className="min-h-screen sm:pl-56">
          <NavBar />
          <main className="px-4 pt-6 pb-24 sm:pb-6 max-w-5xl mx-auto">
            <div className="sm:hidden mb-4">
              <SeasonToggle />
            </div>
            {children}
          </main>
        </div>
      </SeasonProvider>
    </AuthGuard>
  );
}
