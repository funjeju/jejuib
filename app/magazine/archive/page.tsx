'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getIssues } from '@/lib/firestore/magazine';
import { MagazineIssue } from '@/lib/firestore/types';
import { SubscribeCTA } from '@/app/components/magazine/SubscribeCTA';

export default function ArchivePage() {
  const [issues, setIssues] = useState<(MagazineIssue & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getIssues(100)
      .then(setIssues)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = search.trim()
    ? issues.filter(
        (i) =>
          i.title.includes(search) ||
          i.subtitle?.includes(search) ||
          String(i.number).includes(search)
      )
    : issues;

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/jeju" className="text-sm text-text-muted hover:text-text transition">
            ← 매거진 홈
          </Link>
          <h1 className="text-3xl font-bold text-text mt-3 mb-1">전체 아카이브</h1>
          <p className="text-sm text-text-muted">펀제주 매거진 전체 이슈 목록</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* 검색 */}
        <div>
          <input
            type="text"
            placeholder="이슈 제목, 번호 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2.5 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            {search ? (
              <>
                <p className="mb-2">검색 결과가 없습니다.</p>
                <button onClick={() => setSearch('')} className="text-sm text-accent hover:underline">
                  검색 초기화
                </button>
              </>
            ) : (
              <p>아직 발행된 이슈가 없습니다.</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted">총 {filtered.length}개 이슈</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map((issue) => {
                const date = issue.publishedAt?.toDate?.() || new Date();
                return (
                  <Link
                    key={issue.id}
                    href={`/magazine/issue/${issue.number}`}
                    className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition group"
                  >
                    {issue.coverImageUrl ? (
                      <img
                        src={issue.coverImageUrl}
                        alt={issue.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="h-32 bg-accent/10 flex items-center justify-center">
                        <span className="text-accent/40 text-3xl font-bold">#{issue.number}</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs text-text-muted mb-1">
                        ISSUE #{issue.number} ·{' '}
                        {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm font-medium text-text line-clamp-2 group-hover:text-accent transition">
                        {issue.title}
                      </p>
                      {issue.subtitle && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">{issue.subtitle}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <SubscribeCTA />
      </div>
    </div>
  );
}
