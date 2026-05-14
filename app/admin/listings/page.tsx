'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Listing } from '@/lib/firestore/types';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<(Listing & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(50)))
      .then(snap => setListings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing & { id: string }))))
      .finally(() => setIsLoading(false));
  }, []);

  async function toggleActive(id: string, current: boolean) {
    await updateDoc(doc(db, 'listings', id), { isActive: !current });
    setListings(prev => prev.map(l => l.id === id ? { ...l, isActive: !current } : l));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">부동산 매물</h1>
        <Link href="/admin/listings/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">
          + 매물 등록
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">등록된 매물이 없습니다.</p>
          <Link href="/admin/listings/new" className="text-accent hover:underline text-sm">매물 등록하기 →</Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-xs text-text-muted">매물명</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-16">타입</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-28">가격</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted w-20">상태</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text line-clamp-1">{l.title}</p>
                    <p className="text-xs text-text-muted">{l.area}㎡ · {l.source}</p>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{l.type}</td>
                  <td className="px-4 py-3 text-text font-medium">{l.price.toLocaleString()}만원</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.isActive ? 'text-green-700 bg-green-50' : 'text-text-muted bg-border/40'}`}>
                      {l.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(l.id, l.isActive)} className="text-xs text-text-muted hover:text-accent">
                      {l.isActive ? '비공개' : '공개'}
                    </button>
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
