'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';
import { PlaceCategory } from '@/lib/firestore/types';
import { SCHOOLS } from '@/app/data/schools';

const JEJU_SCHOOLS = SCHOOLS.filter(s => s.region === '제주');
const CATEGORIES: PlaceCategory[] = ['맛집', '카페', '병원', '문화시설', '기타'];

export default function NewPlacePage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('맛집');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleSchool(id: string) {
    setSelectedSchools(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'places'), {
        name: name.trim(),
        category,
        description: description.trim(),
        photos: photos.split(',').map(u => u.trim()).filter(Boolean),
        nearSchoolIds: selectedSchools,
        lat: 0,
        lng: 0,
        createdAt: Timestamp.now(),
      });
      router.push('/admin/places');
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
        <h1 className="text-xl font-bold text-text">장소 등록</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={`px-3 py-1.5 border rounded-full text-sm transition ${category === c ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-muted hover:border-accent/50'}`}>
              {c}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">장소명 *</label>
          <input required value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">설명</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">사진 URL (쉼표 구분)</label>
          <input value={photos} onChange={e => setPhotos(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-2">인근 학교 (제주)</label>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
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
            className="px-5 py-2.5 border border-border text-sm text-text-muted rounded-lg hover:border-accent transition">취소</button>
        </div>
      </form>
    </div>
  );
}
