import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// 권위 글 20편 정적 데이터 (발행 전 placeholder)
const PILLAR_ARTICLES: Record<string, {
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  excerpt: string;
  targetKeyword: string;
  readMin: number;
}> = {
  'ib-education-complete-guide': {
    title: 'IB 교육과정 완벽 가이드 — 학부모가 알아야 할 모든 것',
    metaTitle: 'IB 교육과정 완벽 가이드 — 학부모가 알아야 할 모든 것 | IBCommunity',
    metaDescription: 'PYP부터 DP까지, 한국 IB 교육의 전체 구조와 학부모가 꼭 알아야 할 핵심을 정리했습니다. 430개 인증 학교 데이터 기반.',
    category: 'IB 입문',
    excerpt: 'PYP부터 DP까지, 한국 IB 교육의 전체 구조와 학부모가 꼭 알아야 할 핵심을 정리했습니다.',
    targetKeyword: 'IB 교육',
    readMin: 12,
  },
  'ib-pyp-parent-guide': {
    title: 'IB PYP 학부모 가이드 — 초등 6년의 흐름',
    metaTitle: 'IB PYP 학부모 가이드 — 초등 6년의 흐름 | IBCommunity',
    metaDescription: '탐구 중심 학습 PYP의 6년 과정, 포트폴리오, 학부모 참여 방식을 상세히 안내합니다.',
    category: 'IB 입문',
    excerpt: '탐구 중심 학습 PYP의 6년 과정, 포트폴리오, 학부모 참여 방식을 상세히 안내합니다.',
    targetKeyword: 'IB PYP',
    readMin: 10,
  },
  'ib-dp-complete-guide': {
    title: 'IB DP 완벽 정리 — 6과목·코어·평가',
    metaTitle: 'IB DP 완벽 정리 — 6과목·코어·평가 | IBCommunity',
    metaDescription: 'HL·SL 과목 선택부터 EE·TOK·CAS까지 DP 전 과정을 학부모 눈높이로 풀어냈습니다.',
    category: '입시',
    excerpt: 'HL·SL 과목 선택부터 EE·TOK·CAS까지 DP 전 과정을 학부모 눈높이로 풀어냈습니다.',
    targetKeyword: 'IB DP',
    readMin: 15,
  },
  'jeju-ib-schools-guide': {
    title: '제주 IB 학교 완벽 가이드 — 22교의 모든 것',
    metaTitle: '제주 IB 학교 완벽 가이드 — 22교의 모든 것 | IBCommunity',
    metaDescription: '영어교육도시 4교부터 공립 IB까지, 제주 22개 IB 학교의 입학·비용·특징을 비교합니다.',
    category: '제주 IB',
    excerpt: '영어교육도시 4교부터 공립 IB까지, 제주 22개 IB 학교의 입학·비용·특징을 비교합니다.',
    targetKeyword: '제주 IB 학교',
    readMin: 18,
  },
  'jeju-relocation-parent-guide': {
    title: '제주 이주 학부모 가이드 — 비용·생활·학교',
    metaTitle: '제주 이주 학부모 가이드 — 비용·생활·학교 | IBCommunity',
    metaDescription: '실제 이주 가정 30곳의 경험을 바탕으로 제주 IB 이주의 실질 비용과 준비 과정을 정리했습니다.',
    category: '제주 IB',
    excerpt: '실제 이주 가정 30곳의 경험을 바탕으로 제주 IB 이주의 실질 비용과 준비 과정을 정리했습니다.',
    targetKeyword: '제주 이주',
    readMin: 14,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = PILLAR_ARTICLES[params.slug];
  if (!article) {
    return { title: '아티클을 찾을 수 없습니다 | IBCommunity' };
  }
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
    },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibcommunity.kr';

export default function ArticlePage({ params }: Props) {
  const article = PILLAR_ARTICLES[params.slug];

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: {
      '@type': 'Organization',
      name: '펀제주 편집부',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'IBCommunity (법인 펀제주)',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}/articles/${params.slug}`,
    keywords: [article.targetKeyword, 'IB', '국제바칼로레아'].join(','),
  };

  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* 브레드크럼 */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/articles" className="hover:text-accent transition">아티클</Link>
          <span>›</span>
          <span className="text-accent">{article.category}</span>
        </nav>

        {/* 헤더 */}
        <header className="mb-10">
          <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded mb-4">
            {article.category} · {article.readMin}분 읽기
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-text-muted leading-relaxed mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-sm text-text-muted border-t border-border pt-5">
            <span className="font-medium text-text">펀제주 편집부</span>
            <span>·</span>
            <span>발행 예정</span>
          </div>
        </header>

        {/* 콘텐츠 준비 중 */}
        <div className="bg-surface border border-border rounded-xl p-10 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-lg font-semibold text-text mb-2">콘텐츠 준비 중입니다</h2>
          <p className="text-sm text-text-muted mb-6">
            이 아티클은 편집부가 작성·검수 중입니다.<br />
            곧 발행될 예정이오니 뉴스레터를 구독하시면 알려드립니다.
          </p>
          <Link
            href="/jeju#subscribe"
            className="inline-block px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition"
          >
            뉴스레터 구독하기
          </Link>
        </div>

        {/* 관련 글 */}
        <div className="mt-12">
          <h3 className="text-base font-semibold text-text mb-4">다른 권위 글</h3>
          <div className="space-y-3">
            {Object.entries(PILLAR_ARTICLES)
              .filter(([slug]) => slug !== params.slug)
              .slice(0, 3)
              .map(([slug, art]) => (
                <Link
                  key={slug}
                  href={`/articles/${slug}`}
                  className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg hover:border-accent transition group"
                >
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded whitespace-nowrap mt-0.5">
                    {art.category}
                  </span>
                  <span className="text-sm font-medium text-text group-hover:text-accent transition">
                    {art.title}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* 푸터 메타 */}
        <div className="mt-12 pt-8 border-t border-border text-xs text-text-muted space-y-1">
          <p>발행: 펀제주 편집부 (법인 펀제주)</p>
          <p>이 글은 펀제주 AI 어시스트로 초안 작성 후 편집부 검수를 거쳐 발행됩니다.</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(PILLAR_ARTICLES).map((slug) => ({ slug }));
}
