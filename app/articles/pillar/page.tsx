import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IB 권위 글 모음 | IBCommunity',
  description: '4,000자+ 심층 분석, 편집부 직접 검수한 IB 교육 권위 글 20편.',
};

const PILLAR_ARTICLES = [
  { slug: 'ib-education-complete-guide', num: 1, title: 'IB 교육과정 완벽 가이드 — 학부모가 알아야 할 모든 것', keyword: 'IB 교육, 국제바칼로레아', readMin: 12 },
  { slug: 'ib-pyp-parent-guide', num: 2, title: 'IB PYP 학부모 가이드 — 초등 6년의 흐름', keyword: 'IB PYP, 초등 IB', readMin: 10 },
  { slug: 'ib-myp-parent-guide', num: 3, title: 'IB MYP 학부모 가이드 — 중등 5년의 구조', keyword: 'IB MYP, 중등 IB', readMin: 11 },
  { slug: 'ib-dp-complete-guide', num: 4, title: 'IB DP 완벽 정리 — 6과목·코어·평가', keyword: 'IB DP, 디플로마', readMin: 15 },
  { slug: 'ib-vs-suneung', num: 5, title: 'IB와 수능 비교 — 어느 길이 자녀에게 맞을까', keyword: 'IB vs 수능', readMin: 12 },
  { slug: 'ib-dp-korean-university', num: 6, title: 'IB DP 국내 대학 진학 — 19개 대학 인정 현황', keyword: 'IB 국내 대학', readMin: 10 },
  { slug: 'ib-score-conversion', num: 7, title: 'IB 점수 환산표 — 한국 대학별 반영 방식', keyword: 'IB 점수 환산', readMin: 8 },
  { slug: 'ib-school-selection-guide', num: 8, title: 'IB 학교 선택 가이드 — 5가지 기준', keyword: 'IB 학교 선택', readMin: 9 },
  { slug: 'ib-private-education', num: 9, title: 'IB와 사교육 — 진실과 오해', keyword: 'IB 사교육', readMin: 10 },
  { slug: 'ib-cost-guide', num: 10, title: 'IB 비용 정리 — 학비·로열티·시험·기숙사', keyword: 'IB 학비', readMin: 11 },
  { slug: 'ib-transfer-guide', num: 11, title: 'IB 전학 가이드 — 학적·학년·인정 절차', keyword: 'IB 전학', readMin: 9 },
  { slug: 'ib-schools-full-list', num: 12, title: '한국 IB 학교 전체 명단 — 인증·후보·관심 430교', keyword: 'IB 학교 명단', readMin: 15 },
  { slug: 'jeju-ib-schools-guide', num: 13, title: '제주 IB 학교 완벽 가이드 — 22교의 모든 것', keyword: '제주 IB 학교', readMin: 18 },
  { slug: 'jeju-english-city-guide', num: 14, title: '영어교육도시 입학 가이드 — NLCS·BHA·SJA·KIS', keyword: '영어교육도시', readMin: 16 },
  { slug: 'jeju-relocation-parent-guide', num: 15, title: '제주 이주 학부모 가이드 — 비용·생활·학교', keyword: '제주 이주', readMin: 14 },
  { slug: 'pyoseon-ib-analysis', num: 16, title: '표선고 IB 완벽 분석 — 한국 유일 공립 DP 학교', keyword: '표선고', readMin: 12 },
  { slug: 'jeju-4schools-comparison', num: 17, title: '영교도 4교 비교 — NLCS vs BHA vs SJA vs KIS', keyword: 'NLCS BHA 비교', readMin: 14 },
  { slug: 'ia-ee-tok-guide', num: 18, title: 'IA·EE·TOK 완벽 가이드 — DP 코어 정복', keyword: 'IA EE TOK', readMin: 13 },
  { slug: 'ib-dp-subject-selection', num: 19, title: 'IB DP 과목 선택 가이드 — HL·SL 전략', keyword: 'DP 과목 선택', readMin: 10 },
  { slug: 'ib-vs-international-school', num: 20, title: 'IB 학교 vs 국제학교 — 결정적 차이 5가지', keyword: 'IB 국제학교 차이', readMin: 9 },
];

export default function PillarPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/articles" className="hover:text-accent transition">아티클</Link>
            <span>›</span>
            <span>권위 글</span>
          </nav>
          <h1 className="text-3xl font-bold text-text mb-3">권위 글 20편</h1>
          <p className="text-text-muted">
            4,000자+ 심층 분석, 운영자 직접 검수. 한국 IB 교육의 결정판 자료를 만나보세요.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {PILLAR_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="flex items-start gap-4 p-5 bg-surface border border-border rounded-xl hover:border-accent transition group"
            >
              <span className="text-lg font-bold text-border w-8 text-center shrink-0 mt-0.5">
                {article.num}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-text group-hover:text-accent transition leading-snug mb-1">
                  {article.title}
                </h2>
                <p className="text-xs text-text-muted">{article.keyword}</p>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap shrink-0 mt-1">
                {article.readMin}분
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
