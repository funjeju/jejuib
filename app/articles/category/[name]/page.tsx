'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/firestore/articles';
import { Article } from '@/lib/firestore/types';

const CATEGORIES = ['IB 입문', '제주 IB', '입시', '정책', '생활'];

export default function CategoryPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const [articles, setArticles] = useState<(Article & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    getPublishedArticles({ category: name, limitCount: 30 })
      .then(setArticles)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [name]);

  const isValidCategory = CATEGORIES.includes(name);

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/articles" className="text-sm text-text-muted hover:text-text transition">
            ← 아티클 홈
          </Link>
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-text">{name}</h1>
            <p className="text-sm text-text-muted mt-0.5">카테고리 — {name}</p>
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/articles/category/${encodeURIComponent(cat)}`}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${
                  cat === name
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-muted border-border hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <div className="text-4xl mb-4">✍️</div>
            <p className="font-medium text-text mb-2">
              {isValidCategory ? `${name} 카테고리 글을 준비 중입니다` : '카테고리를 찾을 수 없습니다'}
            </p>
            <p className="text-sm mb-6">
              {isValidCategory ? '곧 깊이 있는 아티클이 발행됩니다.' : '다른 카테고리를 확인해보세요.'}
            </p>
            <Link href="/articles" className="text-accent hover:underline text-sm">
              아티클 전체 보기 →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted mb-6">{articles.length}개 아티클</p>
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
      </div>
    </div>
  );
}
