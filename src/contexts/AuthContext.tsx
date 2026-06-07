'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// iOS Safari は signInWithPopup で sessionStorage が分離されエラーになるため
// モバイルブラウザは signInWithRedirect を使用する
function isMobileBrowser(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    // モバイルのリダイレクト結果を処理する。
    // getRedirectResult が完了してから loading を false にすることで
    // onAuthStateChanged(null) が先に発火するレース条件を防ぐ。
    getRedirectResult(auth)
      .catch((error: Error) => {
        setAuthError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    if (isMobileBrowser()) {
      // モバイル: ITP による sessionStorage 分離を回避するためリダイレクト方式
      await signInWithRedirect(auth, provider);
    } else {
      // デスクトップ: ポップアップ方式（ページ遷移なし）
      await signInWithPopup(auth, provider);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
