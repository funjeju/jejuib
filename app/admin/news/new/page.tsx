'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';
import { SCHOOLS } from '@/app/data/schools';

const JEJU_SCHOOLS = SCHOOLS.filter(s => s.region === '제주');

export default function NewNewsPage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  async function fetchMeta() {
    if (!url) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/admin/og?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.siteName && !source) setSource(data.siteName);
      }
    } catch { /* 무시 */ }
    finally { setFetching(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'news_items'), {
        title: title.trim(),
        summary: summary.trim(),
        source: source.trim(),
        url: url.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        schoolIds: selectedSchools,
        publishedAt: Timestamp.now(),
        curatedBy: firebaseUser.uid,
        curatedAt: Timestamp.now(),
      });
      router.push('/admin/news');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    } finally {
      setSaving(false);
    }
  }

  function toggleSchool(id: string) {
    setSelectedSchools(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text">← 뒤로</button>
        <h1 className="text-xl font-bold text-text">뉴스 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-text-muted mb-1">원본 URL *</label>
          <div className="flex gap-2">
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="button" onClick={fetchMeta} disabled={!url || fetching}
              className="px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:border-accent transition disabled:opacity-40">
              {fetching ? '...' : '자동 입력'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">매체명 *</label>
          <input required value={source} onChange={e => setSource(e.target.value)}
            placeholder="제주의소리, 한라일보 등"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">제목 *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">편집부 요약 (2~3문장) *</label>
          <textarea required value={summary} onChange={e => setSummary(e.target.value)} rows={4}
            placeholder="펀제주가 직접 요약하는 핵심 내용..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">태그 (쉼표 구분)</label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="영교도, 입시, 이주"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-2">관련 학교 (제주)</label>
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
