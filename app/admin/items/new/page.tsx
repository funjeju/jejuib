'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';
import { MagazineItemType, MagazineSectionSlug } from '@/lib/firestore/types';

const TYPES: { value: MagazineItemType; label: string; desc: string }[] = [
  { value: 'news', label: '뉴스 큐레이션', desc: '외부 뉴스 URL + 요약' },
  { value: 'listing', label: '부동산 매물', desc: '제주 매물 정보' },
  { value: 'interview', label: '인터뷰', desc: '이주 가족 인터뷰' },
  { value: 'place', label: '장소', desc: '맛집·카페·생활 정보' },
  { value: 'voice', label: 'Voices', desc: '인증 회원 베스트 게시글' },
  { value: 'column', label: '칼럼', desc: '편집부 기고·분석' },
];

const SECTIONS: { value: MagazineSectionSlug; label: string }[] = [
  { value: 'ib_news', label: '이번 주 IB' },
  { value: 'real_estate', label: '부동산 위클리' },
  { value: 'moving_in', label: '이주기' },
  { value: 'local', label: '로컬' },
  { value: 'voices', label: '펀제주가 골랐어요' },
];

export default function NewItemPage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();

  const [type, setType] = useState<MagazineItemType>('news');
  const [section, setSection] = useState<MagazineSectionSlug>('ib_news');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');
  const [linkedPostId, setLinkedPostId] = useState('');
  const [status, setStatus] = useState<'draft' | 'ready'>('ready');
  const [saving, setSaving] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  async function fetchMeta() {
    if (!sourceUrl) return;
    setFetchingMeta(true);
    try {
      const res = await fetch(`/api/admin/og?url=${encodeURIComponent(sourceUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.image && !thumbnailUrl) setThumbnailUrl(data.image);
        if (data.siteName && !sourceName) setSourceName(data.siteName);
      }
    } catch { /* 무시 */ }
    finally { setFetchingMeta(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'magazine_items'), {
        type,
        section,
        title: title.trim(),
        summary: summary.trim(),
        body: body.trim() || '',
        sourceUrl: sourceUrl.trim() || null,
        sourceName: sourceName.trim() || null,
        authorName: authorName.trim() || null,
        thumbnailUrl: thumbnailUrl.trim() || null,
        linkedPostId: linkedPostId.trim() || null,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        relatedSchoolIds: [],
        usedInIssues: [],
        status,
        createdBy: firebaseUser.uid,
        publishedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
      router.push('/admin/items');
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
        <h1 className="text-xl font-bold text-text">새 아이템 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 타입 선택 */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">타입</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`p-3 border rounded-xl text-left transition ${
                  type === t.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                }`}
              >
                <p className="text-sm font-medium text-text">{t.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 섹션 */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">섹션</label>
          <select value={section} onChange={e => setSection(e.target.value as MagazineSectionSlug)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* 외부 URL (뉴스·매물) */}
        {(type === 'news' || type === 'listing' || type === 'place') && (
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">출처 URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={fetchMeta}
                disabled={!sourceUrl || fetchingMeta}
                className="px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:border-accent transition disabled:opacity-40"
              >
                {fetchingMeta ? '...' : '메타 가져오기'}
              </button>
            </div>
          </div>
        )}

        {/* 출처명 */}
        {(type === 'news') && (
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">매체명</label>
            <input value={sourceName} onChange={e => setSourceName(e.target.value)}
              placeholder="제주의소리, 한라일보 등"
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        )}

        {/* 필자 (인터뷰·칼럼) */}
        {(type === 'interview' || type === 'column') && (
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">필자 / 인터뷰이</label>
            <input value={authorName} onChange={e => setAuthorName(e.target.value)}
              placeholder="이름 또는 설명 (예: 영교도 3년차 학부모)"
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        )}

        {/* 연결 게시글 (Voices) */}
        {type === 'voice' && (
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">연결 게시글 ID</label>
            <input value={linkedPostId} onChange={e => setLinkedPostId(e.target.value)}
              placeholder="Firestore post ID"
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        )}

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">제목 <span className="text-red-500">*</span></label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        {/* 요약 */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">요약 (카드용 2~3문장) <span className="text-red-500">*</span></label>
          <textarea required value={summary} onChange={e => setSummary(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
        </div>

        {/* 본문 (인터뷰·칼럼·Voices) */}
        {(type === 'interview' || type === 'column' || type === 'voice') && (
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">본문 (Markdown)</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              rows={10}
              placeholder="## 섹션 제목&#10;&#10;본문 내용..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
          </div>
        )}

        {/* 썸네일 URL */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">썸네일 이미지 URL</label>
          <input type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="미리보기" className="mt-2 h-24 w-full object-cover rounded-lg" />
          )}
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">태그 (쉼표 구분)</label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="영교도, NLCS, 이주"
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        {/* 상태 */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">저장 상태</label>
          <div className="flex gap-3">
            {(['draft', 'ready'] as const).map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value={s} checked={status === s}
                  onChange={() => setStatus(s)} className="accent-accent" />
                <span className="text-sm text-text">{s === 'draft' ? '초안' : '준비 완료'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50">
            {saving ? '저장 중...' : '저장'}
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
