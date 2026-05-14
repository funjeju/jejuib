'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { MagazineItem } from '@/lib/firestore/types';

const TYPE_LABEL: Record<string, string> = {
  news: '뉴스', listing: '매물', interview: '인터뷰', place: '장소', voice: 'Voices', column: '칼럼',
};
const STATUS_LABEL: Record<string, string> = {
  draft: '초안', ready: '준비', used: '사용됨', archived: '보관',
};
const STATUS_COLOR: Record<string, string> = {
  draft: 'text-text-muted bg-border/40',
  ready: 'text-green-700 bg-green-50',
  used: 'text-blue-700 bg-blue-50',
  archived: 'text-text-muted bg-border/40',
};
const SECTION_LABEL: Record<string, string> = {
  ib_news: 'IB 뉴스', real_estate: '부동산', moving_in: '이주기', local: '로컬', voices: 'Voices',
};

export default function AdminItemsPage() {
  const [items, setItems] = useState<(MagazineItem & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadItems();
  }, [filterType, filterStatus]);

  async function loadItems() {
    setIsLoading(true);
    try {
      const constraints: any[] = [orderBy('createdAt', 'desc'), limit(50)];
      if (filterType) constraints.unshift(where('type', '==', filterType));
      if (filterStatus) constraints.unshift(where('status', '==', filterStatus));
      const q = query(collection(db, 'magazine_items'), ...constraints);
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MagazineItem & { id: string })));
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }

  async function setStatus(id: string, status: string) {
    await updateDoc(doc(db, 'magazine_items', id), { status });
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: status as any } : i));
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">아이템 풀</h1>
        <Link href="/admin/items/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">
          + 새 아이템
        </Link>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 flex-wrap">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">전체 타입</option>
          {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">전체 상태</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">등록된 아이템이 없습니다.</p>
          <Link href="/admin/items/new" className="text-accent hover:underline text-sm">첫 아이템 등록 →</Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">제목</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-20">타입</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-24">섹션</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-20">상태</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text line-clamp-1">{item.title}</p>
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{item.summary}</p>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{TYPE_LABEL[item.type] || item.type}</td>
                  <td className="px-4 py-3 text-text-muted">{SECTION_LABEL[item.section] || item.section}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[item.status] || ''}`}>
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {item.status === 'draft' && (
                        <button onClick={() => setStatus(item.id, 'ready')}
                          className="text-xs text-green-700 hover:underline">준비</button>
                      )}
                      {item.status === 'ready' && (
                        <button onClick={() => setStatus(item.id, 'archived')}
                          className="text-xs text-text-muted hover:underline">보관</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
