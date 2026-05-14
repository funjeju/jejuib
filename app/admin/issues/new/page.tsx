'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuthStore } from '@/lib/store/authStore';
import { MagazineItem, MagazineSectionSlug } from '@/lib/firestore/types';

const SECTIONS: { slug: MagazineSectionSlug; title: string }[] = [
  { slug: 'ib_news', title: '📰 이번 주 IB' },
  { slug: 'real_estate', title: '🏡 부동산 위클리' },
  { slug: 'moving_in', title: '👨‍👩‍👧 이주기' },
  { slug: 'local', title: '🍴 로컬' },
  { slug: 'voices', title: '💬 펀제주가 골랐어요' },
];

type SectionItems = Record<MagazineSectionSlug, string[]>; // itemId[]

export default function NewIssuePage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverCategory, setCoverCategory] = useState('이주기');
  const [coverItemId, setCoverItemId] = useState('');
  const [editorNote, setEditorNote] = useState('');
  const [publishNow, setPublishNow] = useState(true);

  const [pool, setPool] = useState<(MagazineItem & { id: string })[]>([]);
  const [sectionItems, setSectionItems] = useState<SectionItems>({
    ib_news: [], real_estate: [], moving_in: [], local: [], voices: [],
  });
  const [nextNumber, setNextNumber] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<MagazineSectionSlug>('ib_news');

  useEffect(() => {
    // 준비된 아이템 로드
    getDocs(query(collection(db, 'magazine_items'), where('status', '==', 'ready'), orderBy('createdAt', 'desc')))
      .then(snap => setPool(snap.docs.map(d => ({ id: d.id, ...d.data() } as MagazineItem & { id: string }))))
      .catch(console.error);

    // 다음 이슈 번호
    getDocs(query(collection(db, 'magazine_issues'), orderBy('number', 'desc'), { limit: 1 } as any))
      .then(snap => {
        if (!snap.empty) setNextNumber((snap.docs[0].data().number as number) + 1);
      })
      .catch(console.error);
  }, []);

  function toggleItem(slug: MagazineSectionSlug, itemId: string) {
    setSectionItems(prev => {
      const current = prev[slug];
      return {
        ...prev,
        [slug]: current.includes(itemId)
          ? current.filter(id => id !== itemId)
          : [...current, itemId],
      };
    });
  }

  function moveItem(slug: MagazineSectionSlug, itemId: string, dir: -1 | 1) {
    setSectionItems(prev => {
      const arr = [...prev[slug]];
      const idx = arr.indexOf(itemId);
      if (idx === -1) return prev;
      const next = idx + dir;
      if (next < 0 || next >= arr.length) return prev;
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return { ...prev, [slug]: arr };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!title.trim()) { alert('제목을 입력하세요'); return; }

    setSaving(true);
    try {
      const now = Timestamp.now();
      const sections = SECTIONS.map(s => ({
        slug: s.slug,
        title: s.title.replace(/^[^\s]+ /, ''), // 이모지 제거
        itemIds: sectionItems[s.slug],
        sponsorLabel: null,
      }));

      await addDoc(collection(db, 'magazine_issues'), {
        number: nextNumber,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        coverImageUrl: coverImageUrl.trim() || '',
        coverCategory: coverCategory.trim() || '이슈',
        coverItemId: coverItemId.trim() || null,
        editorNote: editorNote.trim() || null,
        status: publishNow ? 'published' : 'draft',
        publishedAt: publishNow ? now : null,
        scheduledAt: null,
        sections,
        newsletter: { sent: false },
        createdBy: firebaseUser.uid,
        createdAt: now,
        updatedAt: now,
      });

      router.push('/admin/issues');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    } finally {
      setSaving(false);
    }
  }

  const sectionPool = pool.filter(item => item.section === activeSection);
  const selected = sectionItems[activeSection];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text">← 뒤로</button>
        <h1 className="text-xl font-bold text-text">새 이슈 — ISSUE #{nextNumber}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">제목 (커버 헤드라인) *</label>
              <input required value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">부제</label>
              <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">커버 이미지 URL</label>
              <input type="url" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">커버 카테고리 라벨</label>
              <input value={coverCategory} onChange={e => setCoverCategory(e.target.value)}
                placeholder="이주기, 부동산, IB 뉴스 등"
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-text-muted mb-1">편집장의 말</label>
              <textarea value={editorNote} onChange={e => setEditorNote(e.target.value)} rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
            </div>
          </div>
        </div>

        {/* 섹션 구성 */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text">섹션별 아이템 선택</h2>

          {/* 섹션 탭 */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {SECTIONS.map(s => (
              <button key={s.slug} type="button" onClick={() => setActiveSection(s.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeSection === s.slug
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-text-muted hover:text-text'
                }`}>
                {s.title} {sectionItems[s.slug].length > 0 && `(${sectionItems[s.slug].length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 아이템 풀 */}
            <div>
              <p className="text-xs text-text-muted mb-2">아이템 풀 ({sectionPool.length}개)</p>
              {sectionPool.length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-lg">
                  이 섹션에 준비된 아이템이 없습니다
                </p>
              ) : (
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {sectionPool.map(item => (
                    <label key={item.id}
                      className={`flex items-start gap-2.5 p-2.5 border rounded-lg cursor-pointer transition ${
                        selected.includes(item.id) ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                      }`}>
                      <input type="checkbox" checked={selected.includes(item.id)}
                        onChange={() => toggleItem(activeSection, item.id)}
                        className="mt-0.5 accent-accent shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-text line-clamp-1">{item.title}</p>
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{item.summary}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 순서 */}
            <div>
              <p className="text-xs text-text-muted mb-2">선택된 아이템 순서 ({selected.length}개)</p>
              {selected.length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-lg">
                  왼쪽에서 아이템을 선택하세요
                </p>
              ) : (
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {selected.map((itemId, idx) => {
                    const item = pool.find(p => p.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex items-center gap-2 p-2 border border-border rounded-lg bg-bg">
                        <span className="text-xs text-text-muted w-5 text-center">{idx + 1}</span>
                        <p className="text-xs text-text flex-1 line-clamp-1">{item.title}</p>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveItem(activeSection, itemId, -1)}
                            disabled={idx === 0} className="text-xs text-text-muted disabled:opacity-30 hover:text-text">↑</button>
                          <button type="button" onClick={() => moveItem(activeSection, itemId, 1)}
                            disabled={idx === selected.length - 1} className="text-xs text-text-muted disabled:opacity-30 hover:text-text">↓</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 발행 옵션 */}
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={publishNow} onChange={e => setPublishNow(e.target.checked)}
              className="accent-accent" />
            <span className="text-sm text-text">즉시 발행 (unchecked = 초안 저장)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50">
            {saving ? '저장 중...' : (publishNow ? '발행하기' : '초안 저장')}
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
