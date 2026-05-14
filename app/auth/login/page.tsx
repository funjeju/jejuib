'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { getIdToken } from 'firebase/auth';

async function maybeGrantAdminSession(firebaseUser: any, userProfile: any): Promise<boolean> {
  if (userProfile?.role !== 'admin') return false;
  try {
    const idToken = await getIdToken(firebaseUser);
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const redirectAfterLogin = async (fb: any, profile: any) => {
    const isAdmin = await maybeGrantAdminSession(fb, profile);
    const redirect = searchParams.get('redirect');
    if (isAdmin && redirect?.startsWith('/admin')) {
      router.push(redirect);
    } else if (isAdmin) {
      router.push('/admin');
    } else {
      router.push(redirect ?? '/');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    if (!email || !password) {
      setLocalError('이메일과 비밀번호를 입력해주세요');
      return;
    }
    try {
      await signIn(email, password);
      const { firebaseUser: fb, userProfile: profile } = useAuthStore.getState();
      await redirectAfterLogin(fb, profile);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    clearError();
    try {
      await signInWithGoogle();
      const { firebaseUser: fb, userProfile: profile } = useAuthStore.getState();
      await redirectAfterLogin(fb, profile);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">로그인</h1>
          <p className="text-text-muted">펀제주 커뮤니티에 접속하세요</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8">
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error || localError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 py-3 border border-border rounded-lg text-text font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '🔵 Google로 로그인'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">또는</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-accent font-semibold hover:underline">
              회원가입
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-text-muted hover:text-accent transition">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
