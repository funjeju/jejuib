'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getItemsBySection } from '@/lib/firestore/magazine';
import { MagazineItem, MagazineSectionSlug } from '@/lib/firestore/types';
import { ItemCard } from '@/app/components/magazine/ItemCard';
import { SubscribeCTA } from '@/app/components/magazine/SubscribeCTA';

const SECTION_CONFIG: Record<string, { emoji: string; title: string; description: string }> = {
  ib_news: {
    emoji: '📰',
    title: '이번 주 IB',
    description: '제주 IB 학교 관련 주요 뉴스와 소식을 모았습니다.',
  },
  real_estate: {
    emoji: '🏡',
    title: '부동산 위클리',
    description: '제주 이주를 위한 매물 정보와 부동산 시세를 전합니다.',
  },
  moving_in: {
    emoji: '👨‍👩‍👧',
    title: '이주기',
    description: '제주 이주 가족의 생생한 이야기와 경험을 담습니다.',
  },
  local: {
    emoji: '🍴',
    title: '로컬',
    description: '제주 현지인이 추천하는 맛집, 카페, 문화 공간을 소개합니다.',
  },
  voices: {
    emoji: '💬',
    title: '펀제주가 골랐어요',
    description: '인증 회원들이 직접 추천하는 콘텐츠를 모았습니다.',
  },
};

const BATCH_SIZE = 12;

export default function SectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const config = SECTION_CONFIG[slug];

  const [items, setItems] = useState<(MagazineItem & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getItemsBySection(slug as MagazineSectionSlug, BATCH_SIZE)
      .then((data) => {
        setItems(data);
        setHasMore(data.length === BATCH_SIZE);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [slug]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const more = await getItemsBySection(slug as MagazineSectionSlug, BATCH_SIZE * 2);
      setItems(more);
      setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">섹션을 찾을 수 없습니다.</p>
          <Link href="/jeju" className="text-accent hover:underline text-sm">← 매거진 홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/jeju" className="text-sm text-text-muted hover:text-text transition">
            ← 매거진 홈
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl">{config.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-text">{config.title}</h1>
              <p className="text-sm text-text-muted mt-0.5">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {isLoading ? (
          <div className={slug === 'moving_in' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <p className="text-lg mb-2">{config.emoji}</p>
            <p>아직 등록된 콘텐츠가 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted">{items.length}개 콘텐츠</p>
            <div className={slug === 'moving_in' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  size={slug === 'moving_in' ? 'lg' : 'md'}
                />
              ))}
            </div>
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 border border-border rounded-lg text-sm text-text hover:border-accent transition disabled:opacity-50"
                >
                  {loadingMore ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}

        <SubscribeCTA />
      </div>
    </div>
  );
}
