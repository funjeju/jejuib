'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { confirmSubscriber } from '@/lib/firestore/magazine';

type Status = 'loading' | 'success' | 'error' | 'missing';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'missing');

  useEffect(() => {
    if (!token) return;
    confirmSubscriber(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center">

        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text font-medium">구독을 확인하는 중입니다...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text mb-2">구독이 확정되었습니다!</h1>
            <p className="text-sm text-text-muted mb-6">
              이제 화요일 아침과 금요일 저녁, 제주 IB 매거진을 이메일로 받아보실 수 있습니다.
            </p>
            <Link
              href="/jeju"
              className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition"
            >
              매거진 읽기
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text mb-2">확인에 실패했습니다</h1>
            <p className="text-sm text-text-muted mb-4">
              링크가 만료되었거나 이미 사용된 링크입니다.
            </p>
            <p className="text-sm text-text-muted mb-6">
              이미 구독 중이시라면 별도 조치 없이 매거진을 받아보실 수 있습니다.
            </p>
            <Link
              href="/jeju"
              className="text-sm text-accent hover:underline"
            >
              매거진 홈으로 →
            </Link>
          </>
        )}

        {status === 'missing' && (
          <>
            <div className="w-14 h-14 bg-border rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text mb-2">잘못된 링크입니다</h1>
            <p className="text-sm text-text-muted mb-6">
              이메일에 포함된 링크를 통해 접근해주세요.
            </p>
            <Link href="/jeju" className="text-sm text-accent hover:underline">
              매거진 홈으로 →
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
