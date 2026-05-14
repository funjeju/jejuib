'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLatestIssue, getItemsByIds, getIssues } from '@/lib/firestore/magazine';
import { MagazineIssue, MagazineItem } from '@/lib/firestore/types';
import { IssueCover } from '@/app/components/magazine/IssueCover';
import { IssueMeta } from '@/app/components/magazine/IssueMeta';
import { SectionHeader } from '@/app/components/magazine/SectionHeader';
import { ItemCard } from '@/app/components/magazine/ItemCard';
import { IssueGrid } from '@/app/components/magazine/IssueGrid';
import { SubscribeCTA } from '@/app/components/magazine/SubscribeCTA';
import { RealEstateSummary } from '@/app/components/magazine/RealEstateSummary';

const SECTION_CONFIG = [
  { slug: 'ib_news', emoji: '📰', title: '이번 주 IB' },
  { slug: 'real_estate', emoji: '🏡', title: '부동산 위클리' },
  { slug: 'moving_in', emoji: '👨‍👩‍👧', title: '이주기' },
  { slug: 'local', emoji: '🍴', title: '로컬' },
  { slug: 'voices', emoji: '💬', title: '펀제주가 골랐어요' },
];

export default function JejuPage() {
  const [latestIssue, setLatestIssue] = useState<(MagazineIssue & { id: string }) | null>(null);
  const [pastIssues, setPastIssues] = useState<(MagazineIssue & { id: string })[]>([]);
  const [sectionItems, setSectionItems] = useState<Record<string, (MagazineItem & { id: string })[]>>({});
  const [coverItem, setCoverItem] = useState<(MagazineItem & { id: string }) | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [issue, allIssues] = await Promise.all([
          getLatestIssue(),
          getIssues(8),
        ]);

        setLatestIssue(issue);
        setPastIssues(allIssues.slice(1)); // 최신 제외

        if (issue) {
          // 각 섹션의 첫 3개 아이템만 로드
          const itemMap: Record<string, (MagazineItem & { id: string })[]> = {};
          await Promise.all(
            issue.sections.map(async (section) => {
              const ids = section.itemIds.slice(0, 3);
              if (ids.length) {
                itemMap[section.slug] = await getItemsByIds(ids);
              } else {
                itemMap[section.slug] = [];
              }
            })
          );
          setSectionItems(itemMap);

          // 커버 아이템
          if (issue.coverItemId) {
            const items = await getItemsByIds([issue.coverItemId]);
            setCoverItem(items[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">펀제주 매거진</p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-text">제주 IB 매거진</h1>
            <Link href="/magazine/archive" className="text-sm text-accent hover:underline">
              전체 아카이브 →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* 커버 스토리 */}
        {isLoading ? (
          <div className="bg-surface border border-border rounded-2xl h-80 animate-pulse" />
        ) : latestIssue ? (
          <IssueCover issue={latestIssue} coverItem={coverItem} linkToIssue />
        ) : (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="bg-accent/10 h-64 md:h-80 flex items-center justify-center">
              <div className="text-center px-8">
                <p className="text-accent font-semibold text-sm mb-3">COMING SOON</p>
                <p className="text-2xl md:text-3xl font-bold text-text leading-tight mb-2">
                  첫 번째 이슈가 곧 발행됩니다
                </p>
                <p className="text-text-muted text-sm">제주 IB 학부모와 학생을 위한 격주 매거진</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                ISSUE #1 · 준비 중
              </span>
              <h2 className="text-xl font-bold text-text mt-3 mb-2">
                영교도 학부모 30인이 말하는 진짜 제주 이주의 비용
              </h2>
              <p className="text-sm text-text-muted">by 펀제주 편집부 · 약 12분 읽기</p>
            </div>
          </div>
        )}

        {/* 섹션들 */}
        {latestIssue ? (
          SECTION_CONFIG.map(({ slug, emoji, title }) => {
            const items = sectionItems[slug] || [];
            if (!items.length && !isLoading) return null;
            return (
              <section key={slug}>
                <SectionHeader
                  emoji={emoji}
                  title={title}
                  sectionSlug={slug}
                  issueNumber={latestIssue.number}
                />
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 bg-surface border border-border rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {slug === 'real_estate' && <RealEstateSummary items={items} />}
                    <div className={slug === 'moving_in' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
                      {items.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          size={slug === 'moving_in' ? 'lg' : 'md'}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })
        ) : (
          /* 이슈 없을 때 섹션 스켈레톤 */
          !isLoading && SECTION_CONFIG.map(({ slug, emoji, title }) => (
            <section key={slug}>
              <SectionHeader emoji={emoji} title={title} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl p-4 opacity-40">
                    <div className="h-3 bg-border rounded mb-3 w-2/3" />
                    <div className="h-4 bg-border rounded mb-2" />
                    <div className="h-3 bg-border rounded w-4/5" />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        {/* 뉴스레터 구독 */}
        <SubscribeCTA />

        {/* 지난 이슈 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">지난 이슈</h2>
            <Link href="/magazine/archive" className="text-sm text-accent hover:underline">
              전체 보기 →
            </Link>
          </div>
          <IssueGrid issues={pastIssues} />
        </section>

        {/* 제주 IB 학교 권역 */}
        <section>
          <h2 className="text-lg font-bold text-text mb-4">제주 IB 학교 찾기</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['영어교육도시', '표선·성산', '제주시', '서귀포시'].map((area) => (
              <button
                key={area}
                className="p-4 bg-surface border border-border rounded-xl text-center hover:border-accent transition"
              >
                <p className="text-sm font-medium text-text">{area}</p>
                <p className="text-xs text-text-muted mt-1">IB 학교 보기</p>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
