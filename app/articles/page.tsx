import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IB 교육 아티클 | IBCommunity',
  description: 'IB 교육, 제주 IB 학교, 입시 전략에 관한 깊이 있는 분석 글을 만나보세요.',
};

const CATEGORIES = ['전체', 'IB 입문', '제주 IB', '입시', '정책', '생활'];

const PILLAR_ARTICLES = [
  { slug: 'ib-education-complete-guide', title: 'IB 교육과정 완벽 가이드 — 학부모가 알아야 할 모든 것', category: 'IB 입문', excerpt: 'PYP부터 DP까지, 한국 IB 교육의 전체 구조와 학부모가 꼭 알아야 할 핵심을 정리했습니다.', readMin: 12 },
  { slug: 'ib-pyp-parent-guide', title: 'IB PYP 학부모 가이드 — 초등 6년의 흐름', category: 'IB 입문', excerpt: '탐구 중심 학습 PYP의 6년 과정, 포트폴리오, 학부모 참여 방식을 상세히 안내합니다.', readMin: 10 },
  { slug: 'ib-dp-complete-guide', title: 'IB DP 완벽 정리 — 6과목·코어·평가', category: '입시', excerpt: 'HL·SL 과목 선택부터 EE·TOK·CAS까지 DP 전 과정을 학부모 눈높이로 풀어냈습니다.', readMin: 15 },
  { slug: 'jeju-ib-schools-guide', title: '제주 IB 학교 완벽 가이드 — 22교의 모든 것', category: '제주 IB', excerpt: '영어교육도시 4교부터 공립 IB까지, 제주 22개 IB 학교의 입학·비용·특징을 비교합니다.', readMin: 18 },
  { slug: 'jeju-relocation-parent-guide', title: '제주 이주 학부모 가이드 — 비용·생활·학교', category: '제주 IB', excerpt: '실제 이주 가정 30곳의 경험을 바탕으로 제주 IB 이주의 실질 비용과 준비 과정을 정리했습니다.', readMin: 14 },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="text-sm text-accent font-medium mb-2">펀제주 편집부</p>
          <h1 className="text-4xl font-bold text-text mb-3">IB 교육 아티클</h1>
          <p className="text-text-muted max-w-xl">
            IB 교육 전문 편집팀이 검수한 깊이 있는 분석 글. 학부모와 학생이 꼭 알아야 할 정보를 담습니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* 권위 글 (Pillar) 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-text">권위 글 모음</h2>
              <p className="text-sm text-text-muted mt-0.5">4,000자+ 심층 분석, 운영자 직접 검수</p>
            </div>
            <Link
              href="/articles/pillar"
              className="text-sm text-accent hover:underline"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 대형 첫 카드 */}
            <Link
              href={`/articles/${PILLAR_ARTICLES[0].slug}`}
              className="md:row-span-2 p-6 bg-surface border border-border rounded-xl hover:border-accent transition group"
            >
              <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded mb-3">
                {PILLAR_ARTICLES[0].category}
              </span>
              <h3 className="text-xl font-bold text-text mb-3 group-hover:text-accent transition leading-snug">
                {PILLAR_ARTICLES[0].title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                {PILLAR_ARTICLES[0].excerpt}
              </p>
              <span className="text-xs text-text-muted">{PILLAR_ARTICLES[0].readMin}분 읽기</span>
            </Link>

            {/* 나머지 카드들 */}
            {PILLAR_ARTICLES.slice(1, 5).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="p-5 bg-surface border border-border rounded-xl hover:border-accent transition group flex flex-col"
              >
                <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded mb-2 self-start">
                  {article.category}
                </span>
                <h3 className="text-base font-semibold text-text mb-2 group-hover:text-accent transition leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-3 flex-1 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="text-xs text-text-muted">{article.readMin}분 읽기</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 카테고리 필터 */}
        <section>
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  cat === '전체'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-muted border-border hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 빈 상태 — 실제 글 발행 전 placeholder */}
          <div className="py-24 text-center text-text-muted">
            <div className="text-4xl mb-4">✍️</div>
            <p className="font-medium text-text mb-1">첫 번째 아티클을 준비 중입니다</p>
            <p className="text-sm">권위 글 20편과 일간 분석 글이 곧 발행됩니다.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
