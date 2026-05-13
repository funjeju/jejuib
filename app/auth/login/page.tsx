'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

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
      router.push('/');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    clearError();

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">로그인</h1>
          <p className="text-text-muted">펀제주 커뮤니티에 접속하세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-surface border border-border rounded-lg p-8">
          {/* 에러 메시지 */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error || localError}
            </div>
          )}

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 py-3 border border-border rounded-lg text-text font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '🔵 Google로 로그인'}
          </button>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">또는</span>
            </div>
          </div>

          {/* 이메일 로그인 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                이메일
              </label>
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
              <label className="block text-sm font-semibold text-text mb-2">
                비밀번호
              </label>
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

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center text-sm text-text-muted">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-accent font-semibold hover:underline">
              회원가입
            </Link>
          </div>
        </div>

        {/* 돌아가기 */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-text-muted hover:text-accent transition">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
