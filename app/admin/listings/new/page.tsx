'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';
import { SCHOOLS } from '@/app/data/schools';

const JEJU_SCHOOLS = SCHOOLS.filter(s => s.region === '제주');

export default function NewListingPage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'매매' | '전세' | '월세'>('매매');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [photos, setPhotos] = useState(''); // 쉼표 구분 URL
  const [saving, setSaving] = useState(false);

  function toggleSchool(id: string) {
    setSelectedSchools(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'listings'), {
        title: title.trim(),
        description: description.trim(),
        type,
        price: Number(price),
        area: Number(area),
        source: source.trim(),
        sourceUrl: sourceUrl.trim() || null,
        nearSchoolIds: selectedSchools,
        photos: photos.split(',').map(u => u.trim()).filter(Boolean),
        isActive: true,
        lat: 0,
        lng: 0,
        createdAt: Timestamp.now(),
      });
      router.push('/admin/listings');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text">← 뒤로</button>
        <h1 className="text-xl font-bold text-text">매물 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {(['매매', '전세', '월세'] as const).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`py-2.5 border rounded-xl text-sm font-medium transition ${type === t ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-muted hover:border-accent/50'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">가격 (만원) *</label>
            <input required type="number" value={price} onChange={e => setPrice(e.target.value)}
              placeholder="80000"
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">면적 (㎡) *</label>
            <input required type="number" value={area} onChange={e => setArea(e.target.value)}
              placeholder="84"
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">매물명 *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="영교도 A동 84㎡ 매매"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">설명</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">출처 (공인중개사명) *</label>
            <input required value={source} onChange={e => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">원본 URL</label>
            <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">이미지 URL (쉼표 구분)</label>
          <input value={photos} onChange={e => setPhotos(e.target.value)}
            placeholder="https://..., https://..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-2">인근 학교 (제주)</label>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
            {JEJU_SCHOOLS.map(s => (
              <label key={s.id} className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-lg cursor-pointer text-xs transition ${selectedSchools.includes(s.id) ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-muted hover:border-accent/50'}`}>
                <input type="checkbox" checked={selectedSchools.includes(s.id)}
                  onChange={() => toggleSchool(s.id)} className="accent-accent" />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50">
            {saving ? '저장 중...' : '등록하기'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 border border-border text-sm text-text-muted rounded-lg hover:border-accent transition">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
