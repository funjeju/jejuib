'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { MagazineIssue } from '@/lib/firestore/types';

const STATUS_LABEL: Record<string, string> = {
  draft: '초안', scheduled: '예약', published: '발행됨', archived: '보관',
};
const STATUS_COLOR: Record<string, string> = {
  draft: 'text-text-muted bg-border/40',
  scheduled: 'text-blue-700 bg-blue-50',
  published: 'text-green-700 bg-green-50',
  archived: 'text-text-muted bg-border/40',
};

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<(MagazineIssue & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'magazine_issues'), orderBy('createdAt', 'desc'), limit(30));
    getDocs(q)
      .then(snap => setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() } as MagazineIssue & { id: string }))))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  async function toggleStatus(id: string, current: string) {
    const next = current === 'published' ? 'archived' : 'published';
    await updateDoc(doc(db, 'magazine_issues', id), { status: next });
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: next as any } : i));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">이슈 관리</h1>
        <Link href="/admin/issues/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">
          + 새 이슈
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">발행된 이슈가 없습니다.</p>
          <Link href="/admin/issues/new" className="text-accent hover:underline text-sm">첫 이슈 만들기 →</Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">이슈</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-20">상태</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-32">발행일</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => {
                const date = issue.publishedAt?.toDate?.();
                return (
                  <tr key={issue.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text">ISSUE #{issue.number} — {issue.title}</p>
                      {issue.subtitle && <p className="text-xs text-text-muted mt-0.5">{issue.subtitle}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[issue.status]}`}>
                        {STATUS_LABEL[issue.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {date ? date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-end">
                        <Link href={`/magazine/issue/${issue.number}`}
                          className="text-xs text-text-muted hover:text-accent" target="_blank">보기</Link>
                        <button onClick={() => toggleStatus(issue.id, issue.status)}
                          className="text-xs text-text-muted hover:text-accent">
                          {issue.status === 'published' ? '비공개' : '발행'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
