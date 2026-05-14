'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { NewsItem } from '@/lib/firestore/types';

export default function AdminNewsPage() {
  const [items, setItems] = useState<(NewsItem & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'news_items'), orderBy('publishedAt', 'desc'), limit(50)))
      .then(snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem & { id: string }))))
      .finally(() => setIsLoading(false));
  }, []);

  async function remove(id: string) {
    if (!confirm('삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'news_items', id));
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">뉴스 큐레이션</h1>
        <Link href="/admin/news/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">
          + 뉴스 등록
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">등록된 뉴스가 없습니다.</p>
          <Link href="/admin/news/new" className="text-accent hover:underline text-sm">뉴스 등록하기 →</Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-xs text-text-muted">제목</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-24">출처</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-28">날짜</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const date = item.publishedAt?.toDate?.();
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                    <td className="px-4 py-3">
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="font-medium text-text hover:text-accent line-clamp-1">{item.title}</a>
                      <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{item.summary}</p>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">{item.source}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {date ? date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
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
