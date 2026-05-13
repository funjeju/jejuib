'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, loading, error, clearError } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // 유효성 검사
    if (!displayName || !email || !password || !confirmPassword) {
      setLocalError('모든 항목을 입력해주세요');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      setLocalError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    if (!agreeTerms) {
      setLocalError('약관에 동의해주세요');
      return;
    }

    try {
      await signUp(email, password, displayName);
      router.push('/verify');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError('');
    clearError();

    try {
      await signInWithGoogle();
      router.push('/verify');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">회원가입</h1>
          <p className="text-text-muted">펀제주 커뮤니티에 참여하세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-surface border border-border rounded-lg p-8">
          {/* 에러 메시지 */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error || localError}
            </div>
          )}

          {/* Google 회원가입 */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full mb-4 py-3 border border-border rounded-lg text-text font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            {loading ? '가입 중...' : '🔵 Google로 가입'}
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

          {/* 이메일 회원가입 */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled={loading}
              />
            </div>

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
              <p className="text-xs text-text-faint mt-1">최소 6자 이상</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* 약관 동의 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
                disabled={loading}
              />
              <label htmlFor="agree" className="text-sm text-text-muted">
                <a href="/terms" className="text-accent hover:underline">
                  이용약관
                </a>
                과{' '}
                <a href="/privacy" className="text-accent hover:underline">
                  개인정보처리방침
                </a>
                에 동의합니다
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm text-text-muted">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-accent font-semibold hover:underline">
              로그인
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
