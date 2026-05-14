'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';

const REGIONS = ['전체', '제주', '서울', '경기', '부산', '기타'];

export default function NewNoticePage() {
  const router = useRouter();
  const { userProfile } = useAuthStore();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [regionScope, setRegionScope] = useState('전체');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: title.trim(),
        body: body.trim(),
        regionScope,
        authorName: userProfile?.displayName ?? '펀제주 편집부',
        publishedAt: Timestamp.now(),
      });
      router.push('/admin/notices');
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
        <h1 className="text-xl font-bold text-text">공지 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-text-muted mb-1.5">지역 범위</label>
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map(r => (
              <button key={r} type="button" onClick={() => setRegionScope(r)}
                className={`px-3 py-1.5 border rounded-full text-sm transition ${regionScope === r ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-muted hover:border-accent/50'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">제목 *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="공지 제목을 입력하세요"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">내용 *</label>
          <textarea required value={body} onChange={e => setBody(e.target.value)} rows={10}
            placeholder="공지 내용을 입력하세요. 마크다운 지원."
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50">
            {saving ? '저장 중...' : '게시하기'}
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
