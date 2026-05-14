'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/firestore/articles';
import { Article } from '@/lib/firestore/types';

// 주요 키워드와 관련 키워드 매핑 (SEO 클러스터링)
const KEYWORD_META: Record<string, { title: string; description: string; related: string[] }> = {
  'IB교육': {
    title: 'IB 교육 완벽 가이드',
    description: '국제바칼로레아(IB) 교육과정에 대한 모든 정보. PYP·MYP·DP 전 과정을 학부모 눈높이로 설명합니다.',
    related: ['IB PYP', 'IB MYP', 'IB DP', '국제바칼로레아'],
  },
  '국제바칼로레아': {
    title: '국제바칼로레아(IB) 완벽 이해',
    description: 'IB(국제바칼로레아) 교육의 철학, 구조, 평가 방식을 상세히 안내합니다.',
    related: ['IB교육', 'IB 학교', 'IB 학비'],
  },
  '제주IB학교': {
    title: '제주 IB 학교 완벽 가이드',
    description: '제주도의 IB 인증·후보 학교 정보. 영어교육도시부터 공립 IB까지 모두 정리했습니다.',
    related: ['영어교육도시', 'NLCS', '표선고', '제주이주'],
  },
  '영어교육도시': {
    title: '영어교육도시 입학 가이드',
    description: 'NLCS·BHA·SJA·KIS 4개 학교의 입학 조건, 비용, 특징을 비교합니다.',
    related: ['NLCS', 'BHA', 'SJA', 'KIS', '제주IB학교'],
  },
  '제주이주': {
    title: '제주 이주 학부모 완전 가이드',
    description: '제주 IB 학교 진학을 위한 이주 비용, 생활, 학교 선택 가이드.',
    related: ['제주IB학교', '영어교육도시', 'IB학비'],
  },
  'IBDP': {
    title: 'IB DP 완벽 정리',
    description: 'IB Diploma Programme의 6과목, 코어(IA·EE·TOK), 평가 방식을 모두 설명합니다.',
    related: ['IA', 'EE', 'TOK', 'IB점수', 'IB대학진학'],
  },
  'IB학비': {
    title: 'IB 학비·비용 완전 정리',
    description: '국제학교 학비, IB 로열티, 시험비, 기숙사비 등 IB 교육의 실제 비용을 분석합니다.',
    related: ['영어교육도시', '제주이주', 'IB교육'],
  },
};

export default function KeywordPage() {
  const params = useParams();
  const keyword = decodeURIComponent(params.keyword as string);
  const meta = KEYWORD_META[keyword];

  const [articles, setArticles] = useState<(Article & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;
    // targetKeyword 또는 relatedKeywords 매칭은 Firestore 한계상 전체 조회 후 클라이언트 필터
    getPublishedArticles({ limitCount: 50 })
      .then((all) => {
        const matched = all.filter(
          (a) =>
            a.targetKeyword === keyword ||
            a.relatedKeywords?.includes(keyword) ||
            a.title?.includes(keyword) ||
            a.category?.includes(keyword)
        );
        setArticles(matched);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [keyword]);

  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/articles" className="text-sm text-text-muted hover:text-text transition">
            ← 아티클 홈
          </Link>
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
              키워드
            </div>
            <h1 className="text-2xl font-bold text-text mb-1">
              {meta?.title || `"${keyword}" 관련 아티클`}
            </h1>
            {meta?.description && (
              <p className="text-sm text-text-muted max-w-xl">{meta.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* 관련 키워드 사이드바 */}
          {meta?.related && meta.related.length > 0 && (
            <aside className="hidden md:block w-44 shrink-0">
              <div className="sticky top-8">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-3">관련 키워드</p>
                <div className="flex flex-col gap-1.5">
                  {meta.related.map((rel) => (
                    <Link
                      key={rel}
                      href={`/articles/keyword/${encodeURIComponent(rel)}`}
                      className="text-sm text-text-muted hover:text-accent hover:underline transition"
                    >
                      {rel}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* 아티클 목록 */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 text-text-muted">
                <div className="text-4xl mb-4">🔍</div>
                <p className="font-medium text-text mb-2">"{keyword}" 관련 아티클을 준비 중입니다</p>
                <p className="text-sm mb-6">더 많은 콘텐츠가 곧 발행됩니다.</p>
                <Link href="/articles" className="text-accent hover:underline text-sm">
                  아티클 전체 보기 →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-text-muted mb-6">"{keyword}" 관련 {articles.length}개 아티클</p>
                {articles.map((article) => {
                  const date = article.publishedAt?.toDate?.() || new Date();
                  return (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="flex gap-4 bg-surface border border-border rounded-xl p-5 hover:border-accent transition group"
                    >
                      {article.coverImageUrl && (
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="w-24 h-20 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-0.5 rounded">
                            {article.category}
                          </span>
                          {article.type === 'pillar' && (
                            <span className="text-xs text-text-muted border border-border px-2 py-0.5 rounded">
                              심층 분석
                            </span>
                          )}
                        </div>
                        <h2 className="text-base font-semibold text-text mb-1 group-hover:text-accent transition line-clamp-2 leading-snug">
                          {article.title}
                        </h2>
                        <p className="text-xs text-text-muted line-clamp-1">{article.excerpt}</p>
                        <p className="text-xs text-text-muted mt-1.5">
                          {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 관련 키워드 (모바일) */}
            {meta?.related && meta.related.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border md:hidden">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-3">관련 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {meta.related.map((rel) => (
                    <Link
                      key={rel}
                      href={`/articles/keyword/${encodeURIComponent(rel)}`}
                      className="px-3 py-1.5 border border-border rounded-full text-sm text-text-muted hover:border-accent hover:text-accent transition"
                    >
                      {rel}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
