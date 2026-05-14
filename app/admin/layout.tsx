'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

const NAV = [
  { href: '/admin', label: '대시보드', icon: '🏠', exact: true },
  { href: '/admin/issues', label: '이슈 관리', icon: '📋' },
  { href: '/admin/items', label: '아이템 풀', icon: '📦' },
  { href: '/admin/listings', label: '부동산 매물', icon: '🏡' },
  { href: '/admin/news', label: '뉴스 큐레이션', icon: '📰' },
  { href: '/admin/places', label: '맛집·생활', icon: '🍴' },
  { href: '/admin/verifications', label: '인증 검수', icon: '✅' },
  { href: '/admin/notices', label: '공지 관리', icon: '📢' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseUser, userProfile, loading, initAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const ADMIN_EMAIL = 'naggu1999@gmail.com';

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace('/auth/login?redirect=' + pathname);
    }
    if (!loading && firebaseUser && firebaseUser.email !== ADMIN_EMAIL) {
      router.replace('/');
    }
  }, [loading, firebaseUser]);

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (firebaseUser.email !== ADMIN_EMAIL) return null;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== '/admin';
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* 사이드바 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-surface border-r border-border flex flex-col
        transition-transform duration-200
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-4 py-5 border-b border-border">
          <Link href="/" className="text-sm font-bold text-accent">펀제주 어드민</Link>
          <p className="text-xs text-text-muted mt-0.5">{firebaseUser.email}</p>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ href, label, icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                isActive(href, exact)
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border">
          <Link href="/" className="text-xs text-text-muted hover:text-text transition">
            ← 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 오버레이 (모바일) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 메인 영역 */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* 상단 바 */}
        <header className="bg-surface border-b border-border px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-text-muted hover:text-text"
            aria-label="메뉴"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="text-sm font-medium text-text">펀제주 어드민</span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
