'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase/admin';

interface Stats {
  issues: number;
  items: number;
  subscribers: number;
  pendingVerifications: number;
  listings: number;
  articles: number;
}

const QUICK_ACTIONS = [
  { href: '/admin/issues/new', label: '새 이슈 발행', icon: '📋', desc: '매거진 이슈 편집·발행' },
  { href: '/admin/items/new', label: '아이템 등록', icon: '📦', desc: '뉴스·매물·인터뷰 등록' },
  { href: '/admin/listings/new', label: '매물 등록', icon: '🏡', desc: '부동산 매물 추가' },
  { href: '/admin/news/new', label: '뉴스 등록', icon: '📰', desc: '뉴스 큐레이션 추가' },
  { href: '/admin/places/new', label: '장소 등록', icon: '🍴', desc: '맛집·카페·생활 추가' },
  { href: '/admin/verifications', label: '인증 검수', icon: '✅', desc: '대기 중인 인증 확인' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Partial<Stats>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // 통계 로드 실패는 무시
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: '발행 이슈', value: stats.issues, href: '/admin/issues' },
    { label: '아이템 풀', value: stats.items, href: '/admin/items' },
    { label: '구독자', value: stats.subscribers, href: '/admin/subscribers' },
    { label: '인증 대기', value: stats.pendingVerifications, href: '/admin/verifications' },
    { label: '등록 매물', value: stats.listings, href: '/admin/listings' },
    { label: '발행 아티클', value: stats.articles, href: '/admin/seo' },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">대시보드</h1>
        <p className="text-sm text-text-muted mt-1">펀제주 어드민에 오신 것을 환영합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statCards.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition"
          >
            <p className="text-xs text-text-muted mb-1">{label}</p>
            <p className="text-2xl font-bold text-text">
              {isLoading ? '—' : (value ?? 0).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">빠른 작업</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ href, label, icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition group"
            >
              <span className="text-2xl mb-2 block">{icon}</span>
              <p className="text-sm font-medium text-text group-hover:text-accent transition">{label}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
