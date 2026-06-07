import { AuthGuard } from '@/components/layout/AuthGuard';
import { NavBar } from '@/components/layout/NavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen sm:pl-56">
        <NavBar />
        <main className="px-4 pt-6 pb-24 sm:pb-6 max-w-5xl mx-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}
