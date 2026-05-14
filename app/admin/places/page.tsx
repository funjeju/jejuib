'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Place } from '@/lib/firestore/types';

const CAT_EMOJI: Record<string, string> = { 맛집: '🍽', 카페: '☕', 병원: '🏥', 문화시설: '🎭', 기타: '📍' };

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<(Place & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'places'), orderBy('createdAt', 'desc'), limit(50)))
      .then(snap => setPlaces(snap.docs.map(d => ({ id: d.id, ...d.data() } as Place & { id: string }))))
      .finally(() => setIsLoading(false));
  }, []);

  async function remove(id: string) {
    if (!confirm('삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'places', id));
    setPlaces(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">맛집·생활 정보</h1>
        <Link href="/admin/places/new" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition">+ 장소 등록</Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
      ) : places.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-3">등록된 장소가 없습니다.</p>
          <Link href="/admin/places/new" className="text-accent hover:underline text-sm">장소 등록하기 →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {places.map(p => (
            <div key={p.id} className="bg-surface border border-border rounded-xl p-4 flex gap-3">
              {p.photos?.[0] && <img src={p.photos[0]} alt={p.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{CAT_EMOJI[p.category] || '📍'}</span>
                  <span className="text-xs text-text-muted">{p.category}</span>
                </div>
                <p className="text-sm font-medium text-text line-clamp-1">{p.name}</p>
                <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{p.description}</p>
              </div>
              <button onClick={() => remove(p.id)} className="text-xs text-red-400 hover:text-red-600 self-start">삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
