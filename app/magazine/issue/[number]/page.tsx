'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getIssueByNumber, getIssues, getItemsByIds } from '@/lib/firestore/magazine';
import { MagazineIssue, MagazineItem } from '@/lib/firestore/types';
import { IssueMeta } from '@/app/components/magazine/IssueMeta';
import { ItemCard } from '@/app/components/magazine/ItemCard';
import { SubscribeCTA } from '@/app/components/magazine/SubscribeCTA';
import { RealEstateSummary } from '@/app/components/magazine/RealEstateSummary';
import { ShareButtons } from '@/app/components/magazine/ShareButtons';

const SECTION_CONFIG: Record<string, { emoji: string; title: string }> = {
  ib_news:     { emoji: '📰', title: '이번 주 IB' },
  real_estate: { emoji: '🏡', title: '부동산 위클리' },
  moving_in:   { emoji: '👨‍👩‍👧', title: '이주기' },
  local:       { emoji: '🍴', title: '로컬' },
  voices:      { emoji: '💬', title: '펀제주가 골랐어요' },
};

export default function IssuePage() {
  const params = useParams();
  const issueNumber = Number(params.number);

  const [issue, setIssue] = useState<(MagazineIssue & { id: string }) | null>(null);
  const [adjacent, setAdjacent] = useState<{ prev?: MagazineIssue & { id: string }; next?: MagazineIssue & { id: string } }>({});
  const [sectionItems, setSectionItems] = useState<Record<string, (MagazineItem & { id: string })[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [found, allIssues] = await Promise.all([
          getIssueByNumber(issueNumber),
          getIssues(50),
        ]);
        setIssue(found);

        if (found) {
          const idx = allIssues.findIndex((i) => i.number === issueNumber);
          setAdjacent({
            next: idx > 0 ? allIssues[idx - 1] : undefined,
            prev: idx < allIssues.length - 1 ? allIssues[idx + 1] : undefined,
          });

          const itemMap: Record<string, (MagazineItem & { id: string })[]> = {};
          await Promise.all(
            found.sections.map(async (section) => {
              if (section.itemIds.length) {
                itemMap[section.slug] = await getItemsByIds(section.itemIds);
              } else {
                itemMap[section.slug] = [];
              }
            })
          );
          setSectionItems(itemMap);
          if (found.sections[0]) setActiveSection(found.sections[0].slug);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [issueNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="h-8 bg-surface rounded animate-pulse w-48" />
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-surface rounded animate-pulse w-32" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-40 bg-surface border border-border rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">이슈를 찾을 수 없습니다.</p>
          <Link href="/jeju" className="text-accent hover:underline text-sm">
            ← 매거진 홈으로
          </Link>
        </div>
      </div>
    );
  }

  const publishDate = issue.publishedAt?.toDate?.() || new Date();
  const activeSections = issue.sections.filter((s) => sectionItems[s.slug]?.length);

  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/jeju" className="text-sm text-text-muted hover:text-text transition">
            ← 매거진 홈
          </Link>
          <div className="mt-3">
            <IssueMeta issue={issue} />
          </div>
        </div>
      </div>

      {/* 커버 이미지 */}
      {issue.coverImageUrl && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={issue.coverImageUrl} alt={issue.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <p className="text-white/80 text-xs uppercase tracking-widest mb-2">{issue.coverCategory}</p>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2">{issue.title}</h1>
            {issue.subtitle && <p className="text-white/80 text-sm md:text-base">{issue.subtitle}</p>}
          </div>
        </div>
      )}

      {!issue.coverImageUrl && (
        <div className="bg-accent/10 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-accent text-xs uppercase tracking-widest mb-2">{issue.coverCategory}</p>
            <h1 className="text-2xl md:text-4xl font-bold text-text leading-tight mb-2">{issue.title}</h1>
            {issue.subtitle && <p className="text-text-muted text-sm md:text-base">{issue.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* 목차 사이드바 (데스크탑) */}
          <aside className="hidden md:block w-48 shrink-0">
            <div className="sticky top-8 space-y-1">
              <p className="text-xs text-text-muted uppercase tracking-widest mb-3">목차</p>
              {activeSections.map((section) => {
                const config = SECTION_CONFIG[section.slug];
                if (!config) return null;
                return (
                  <a
                    key={section.slug}
                    href={`#${section.slug}`}
                    onClick={() => setActiveSection(section.slug)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      activeSection === section.slug
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-text-muted hover:text-text hover:bg-surface'
                    }`}
                  >
                    <span>{config.emoji}</span>
                    <span className="line-clamp-1">{config.title}</span>
                  </a>
                );
              })}
              {issue.editorNote && (
                <a
                  href="#editor-note"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface transition"
                >
                  <span>✍️</span>
                  <span>편집장 노트</span>
                </a>
              )}
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 space-y-12 min-w-0">

            {/* 편집장 노트 */}
            {issue.editorNote && (
              <section id="editor-note" className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                <p className="text-xs text-accent uppercase tracking-widest mb-3">편집장 노트</p>
                <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">{issue.editorNote}</p>
                <p className="text-xs text-accent mt-4">
                  {publishDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>
            )}

            {/* 섹션별 아이템 */}
            {activeSections.map((section) => {
              const config = SECTION_CONFIG[section.slug];
              if (!config) return null;
              const items = sectionItems[section.slug] || [];
              return (
                <section key={section.slug} id={section.slug}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                      <span>{config.emoji}</span> {config.title}
                    </h2>
                    {section.sponsorLabel && (
                      <span className="text-xs text-text-muted border border-border px-2 py-0.5 rounded">
                        {section.sponsorLabel}
                      </span>
                    )}
                  </div>
                  {section.slug === 'real_estate' && (
                    <RealEstateSummary items={items} />
                  )}
                  <div className={section.slug === 'moving_in' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
                    {items.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        size={section.slug === 'moving_in' ? 'lg' : 'md'}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* 구독 CTA */}
            <SubscribeCTA />

            {/* 이슈 공유 */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-text-muted">이 이슈가 유용했다면 공유해주세요</p>
              <ShareButtons title={issue.title} />
            </div>

            {/* 다음/이전 이슈 */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {adjacent.prev ? (
                <Link
                  href={`/magazine/issue/${adjacent.prev.number}`}
                  className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition"
                >
                  <p className="text-xs text-text-muted mb-1">← 이전 이슈</p>
                  <p className="text-sm font-medium text-text line-clamp-2">ISSUE #{adjacent.prev.number}: {adjacent.prev.title}</p>
                </Link>
              ) : <div />}
              {adjacent.next ? (
                <Link
                  href={`/magazine/issue/${adjacent.next.number}`}
                  className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition text-right"
                >
                  <p className="text-xs text-text-muted mb-1">다음 이슈 →</p>
                  <p className="text-sm font-medium text-text line-clamp-2">ISSUE #{adjacent.next.number}: {adjacent.next.title}</p>
                </Link>
              ) : <div />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
