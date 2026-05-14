'use client';

import { useState } from 'react';

interface Props {
  variant?: 'inline' | 'section';
}

export function SubscribeCTA({ variant = 'section' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className={variant === 'section' ? 'bg-surface border border-border rounded-2xl p-8 text-center' : 'text-center py-4'}>
        <p className="font-medium text-accent">✓ 확인 이메일을 발송했습니다</p>
        <p className="text-sm text-text-muted mt-1">이메일을 열어 구독을 확정해주세요.</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : '구독'}
        </button>
      </form>
    );
  }

  return (
    <section id="subscribe" className="bg-surface border border-border rounded-2xl p-8 text-center">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-2">뉴스레터</p>
      <h2 className="text-xl font-bold text-text mb-2">주 2회, 이메일로 받아보세요</h2>
      <p className="text-sm text-text-muted mb-6">
        화요일 아침 · 금요일 저녁, 제주 IB 소식을 가장 먼저 전합니다.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          required
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : '구독하기'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500 mt-2">오류가 발생했습니다. 다시 시도해주세요.</p>}
      <p className="text-xs text-text-muted mt-4">수신 동의 후 언제든 구독 취소할 수 있습니다.</p>
    </section>
  );
}
