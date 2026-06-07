'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Wardrobe Inventory</h1>
          <p className="mt-2 text-sm text-slate-500">ワードローブ資産管理アプリ</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 text-center mb-6">
            Googleアカウントでログインしてください
          </p>
          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 break-all">
              <p className="font-medium mb-1">ログインエラー</p>
              <p>{authError}</p>
            </div>
          )}
          <GoogleSignInButton />
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          ログインすることで、利用規約に同意したものとみなします
        </p>
      </div>
    </div>
  );
}
