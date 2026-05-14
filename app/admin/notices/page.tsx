'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Notice } from '@/lib/firestore/types';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<(Notice & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'notices'), orderBy('publishedAt', 'desc'), limit(50)))
      .then(snap => setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice & { id: string }))))
      .finally(() => setIsLoading(false));
  }, []);

  async function remove(id: string) {
    if (!confirm('삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'notices', id));
    setNotices(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">공지사항</h1>
        <Link href="/admin/notices/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">
          + 공지 작성
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">등록된 공지가 없습니다.</p>
          <Link href="/admin/notices/new" className="text-accent hover:underline text-sm">공지 작성하기 →</Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-xs text-text-muted">제목</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-24">지역</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-24">작성자</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-28">날짜</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {notices.map(n => {
                const date = n.publishedAt?.toDate?.();
                return (
                  <tr key={n.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text line-clamp-1">{n.title}</p>
                      <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{n.body?.slice(0, 60)}...</p>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">{n.regionScope || '전체'}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{n.authorName}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {date ? date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(n.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
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
