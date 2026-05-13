'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { SchoolSearchModal } from './modals/SchoolSearchModal';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolSearchModalOpen, setSchoolSearchModalOpen] = useState(false);
  const { firebaseUser, userProfile, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="font-bold text-xl text-accent">
            펀제주
          </Link>

          {/* 메뉴 (데스크탑) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/guide" className="text-sm text-text hover:text-accent transition">
              가이드
            </Link>
            <button
              onClick={() => setSchoolSearchModalOpen(true)}
              className="text-sm text-text hover:text-accent transition cursor-pointer"
            >
              학교 검색
            </button>
            <Link href="/community" className="text-sm text-text hover:text-accent transition">
              커뮤니티
            </Link>
            <Link href="/jeju" className="text-sm text-text hover:text-accent transition">
              제주 정보
            </Link>
            {firebaseUser ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/me"
                  className="text-sm text-text hover:text-accent transition"
                >
                  {userProfile?.displayName || 'My Page'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm px-4 py-2 border border-accent text-accent rounded hover:bg-accent-soft transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition"
              >
                로그인
              </Link>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="/guide" className="text-sm text-text hover:text-accent transition">
                가이드
              </Link>
              <button
                onClick={() => {
                  setSchoolSearchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-sm text-text hover:text-accent transition text-left"
              >
                학교 검색
              </button>
              <Link href="/community" className="text-sm text-text hover:text-accent transition">
                커뮤니티
              </Link>
              <Link href="/jeju" className="text-sm text-text hover:text-accent transition">
                제주 정보
              </Link>
              {firebaseUser ? (
                <>
                  <Link href="/me" className="text-sm text-text hover:text-accent transition">
                    {userProfile?.displayName || 'My Page'}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-text hover:text-accent transition text-left"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="text-sm text-text hover:text-accent transition">
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 학교 검색 모달만 유지 */}
      {schoolSearchModalOpen && (
        <SchoolSearchModal onClose={() => setSchoolSearchModalOpen(false)} />
      )}
    </>
  );
}
