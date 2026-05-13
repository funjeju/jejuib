# 펀제주 SEO 콘텐츠 + 자동 발행 시스템 명세서

> 이 문서는 PROJECT_SPEC.md, MAGAZINE_SPEC.md를 보완하는 **세 번째 명세서**입니다.
> Claude Code는 앞 두 문서를 먼저 읽고, 그 위에 이 문서의 작업을 얹으세요.
> 앞 두 문서의 모든 절대 규칙이 동일하게 적용됩니다.

---

## 0. 한 줄 요약

IB·제주IB 관련 검색 키워드를 장악하기 위한 **두 트랙의 SEO 콘텐츠 전략**:

1. **Pillar Track (권위 글)** — 20편, 4,000자+, 논문 수준 깊이, 운영자 깊은 개입, 영구 자산
2. **Daily Track (이슈 분석)** — 매일 1~2편, IB 뉴스·이슈를 정리하고 펀제주의 분석 의견을 덧붙이는 자동 발행

발행 주체: **펀제주 편집부** (AI 보조, 사람 검수)

---

## 1. 절대 규칙 (Hard Rules)

이 규칙은 사이트 생존에 직결됩니다. 어떤 경우에도 위반 금지.

### 🚫 절대 금지

1. **무인 발행 금지.** 자동 생성 글이라도 발행 게이트(자동 필터 + 사후 검토 큐)를 통과해야 함.
2. **AI 워터마크 텍스트 노출 금지.** "ChatGPT", "Claude로 작성", "AI가 생성" 같은 표현은 본문에 절대 넣지 않음 (E-E-A-T 시그널 보호). 대신 **"펀제주 편집부 분석"** 또는 **"펀제주 AI 어시스트"** 같은 매체 명의 사용.
3. **명예훼손 콘텐츠 금지.** 특정 학교·교사·학생·기관에 대한 부정적 단정·비난·인격 평가 발행 금지. 사실 보도와 비평은 다름.
4. **정치적·이념적 콘텐츠 금지.** IB 도입 정책에 대한 찬반 의견 단정 금지. 다양한 관점 병치만 허용.
5. **출처 없는 통계·인용 금지.** 모든 수치·인용은 1차 출처 링크 필수.
6. **"thin content" 금지.** Pillar는 4,000자+, Daily는 1,500자+ 미만 발행 안 됨.
7. **하루 발행 한도**: 최대 3편 (스팸 시그널 방지).
8. **같은 키워드 7일 내 중복 발행 금지** (cannibalization 방지).
9. **검수 안 거친 외부 URL 자동 인용 금지.** RSS 자동 수집된 뉴스는 메타·요약만 사용, 본문 paraphrase 안 함.

### ✅ 의무

1. 모든 글 하단에 **검수자 + 검수일 + 출처 목록** 명시.
2. 모든 글에 **JSON-LD `Article` 스키마** 자동 주입.
3. 모든 글 발행 시 **`sitemap.xml` 자동 갱신** + **Google Indexing API** 호출.
4. 모든 글에 **최소 3개의 내부 링크** (다른 글·학교·매거진).
5. 모든 통계·뉴스 인용에 **출처 링크 + 접근일** 명시.
6. **발행 후 24시간 검토 큐**에서 운영자가 다시 한 번 확인 (오류 발견 시 즉시 수정·비공개).
7. **자동 발행 글은 발행 후 7일간 검색엔진 인덱싱 noindex 대기 옵션 제공** (운영자 설정).

---

## 2. 콘텐츠 전략

### 2.1 Tier 1 — Pillar Track (권위 글 20편)

깊이 우선. 영구 자산. 1년 이상 검색 결과 상위에 머무는 결정판.

**규격**
- 분량: 4,000~6,000자
- 구조: 도입(문제 정의) → 본론(섹션 5~8개) → 결론(요약 + 다음 액션)
- 인포그래픽·표·다이어그램 최소 3개
- 출처 10건 이상 (IBO 공식, 교육청 자료, 학술 논문, 통계청)
- 내부 링크 10건 이상
- 작성 방식: AI 초안 + 운영자 깊은 개입 (1편당 4~8시간 사람 작업)

**주제 목록 (확정)**

| # | 제목 | 타겟 키워드 |
|---|---|---|
| 1 | IB 교육과정 완벽 가이드 — 학부모가 알아야 할 모든 것 | IB 교육, 국제바칼로레아 |
| 2 | IB PYP 학부모 가이드 — 초등 6년의 흐름 | IB PYP, 초등 IB |
| 3 | IB MYP 학부모 가이드 — 중등 5년의 구조 | IB MYP, 중등 IB |
| 4 | IB DP 완벽 정리 — 6과목·코어·평가 | IB DP, 디플로마 |
| 5 | IB와 수능 비교 — 어느 길이 자녀에게 맞을까 | IB vs 수능 |
| 6 | IB DP 국내 대학 진학 — 19개 대학 인정 현황 | IB 국내 대학 |
| 7 | IB 점수 환산표 — 한국 대학별 반영 방식 | IB 점수 환산 |
| 8 | IB 학교 선택 가이드 — 5가지 기준 | IB 학교 선택 |
| 9 | IB와 사교육 — 진실과 오해 | IB 사교육 |
| 10 | IB 비용 정리 — 학비·로열티·시험·기숙사 | IB 학비 |
| 11 | IB 전학 가이드 — 학적·학년·인정 절차 | IB 전학 |
| 12 | 한국 IB 학교 전체 명단 — 인증·후보·관심 430교 | IB 학교 명단 |
| 13 | 제주 IB 학교 완벽 가이드 — 22교의 모든 것 | 제주 IB 학교 |
| 14 | 영어교육도시 입학 가이드 — NLCS·BHA·SJA·KIS | 영어교육도시 |
| 15 | 제주 이주 학부모 가이드 — 비용·생활·학교 | 제주 이주 |
| 16 | 표선고 IB 완벽 분석 — 한국 유일 공립 DP 학교 | 표선고 |
| 17 | 영교도 4교 비교 — NLCS vs BHA vs SJA vs KIS | NLCS BHA 비교 |
| 18 | IA·EE·TOK 완벽 가이드 — DP 코어 정복 | IA EE TOK |
| 19 | IB DP 과목 선택 가이드 — HL·SL 전략 | DP 과목 선택 |
| 20 | IB 학교 vs 국제학교 — 결정적 차이 5가지 | IB 국제학교 차이 |

### 2.2 Tier 2 — Daily Track (이슈 분석 자동 발행)

빠른 정보 + 펀제주의 관점. 검색 유입·신선도(freshness) 시그널 목적.

**규격**
- 분량: 1,500~2,500자
- 구조: 이슈 정리(50%) + 펀제주 편집부 분석(40%) + 학부모를 위한 함의(10%)
- 출처: 인용 매체 1~3개 + 우리 사이트 자체 데이터
- 내부 링크 3개 이상
- 작성 방식: 자동 생성 + 자동 필터 통과 + 사후 검토 큐

**이슈 발굴 소스**
- RSS: 제주의소리, 한라일보, 헤드라인제주, 교육플러스, 한국교육신문, 매일신문(대구)
- 시·도교육청 공지 (서울·경기·대구·제주·전북·전남·충남)
- IBO 공식 뉴스 (영문, AI가 한국어 정리)
- 우리 사이트 검색 로그 (사용자가 자주 찾는 키워드)

**Daily Track 주제 패턴**

| 패턴 | 예시 |
|---|---|
| 학교별 이슈 | "표선고 2025 졸업생 진학 결과 분석" |
| 정책 변화 | "서울 IB 관심학교 91교 선정 — 분석" |
| 입시 시즌 | "IB DP 평균 30점의 의미 — 한국 학생 기준" |
| 비교·해석 | "광주 IB 신규 도입 — 대구·제주와 다른 점" |
| 비용 분석 | "영교도 학비 1억의 진짜 구조" |
| 학원·사교육 | "IB Economics 사교육 시장 분석" |
| 부동산 | "영교도 매매가 12억 — 5년 추이" |
| 학부모 우려 | "IB 학교 다니다 일반고 전학할 수 있나" |

---

## 3. 데이터 모델

### 3.1 새 컬렉션

```
seo_ideas/{ideaId}
  keyword: string
  type: 'pillar' | 'daily'
  intent: 'informational' | 'navigational' | 'commercial' | 'investigational'
  source: 'manual' | 'rss' | 'search_log' | 'trends'
  sourceRef: string?              // RSS 항목 id, 검색어 등
  searchVolume: number?
  difficulty: number?             // 1~100
  status: 'queued' | 'drafting' | 'drafted' | 'published' | 'rejected' | 'archived'
  scheduledFor: Timestamp?
  notes: string
  createdAt: Timestamp

articles/{articleId}
  slug: string                    // URL slug (kebab-case)
  type: 'pillar' | 'daily'
  category: string                // "IB 입문" | "제주 IB" | "입시" | "정책" 등
  title: string
  metaTitle: string               // 60자 이내
  metaDescription: string         // 155자 이내
  excerpt: string                 // 카드용 발췌 (2~3문장)
  body: string                    // Markdown
  coverImageUrl: string?
  targetKeyword: string
  relatedKeywords: string[]
  sources: [                      // 인용 출처 (필수)
    {
      title: string,
      url: string,
      publisher: string,
      accessedAt: Timestamp
    }
  ]
  internalLinks: string[]         // 우리 사이트 내 경로
  
  // 작성·검수
  authorName: '펀제주 편집부'      // 고정
  generatedBy: 'ai' | 'human' | 'mixed'
  aiModel: string?
  generationPromptId: string?
  reviewedBy: string?             // 검수자 uid
  reviewedAt: Timestamp?
  postReviewedBy: string?         // 사후 검토자 uid (Daily Track)
  postReviewedAt: Timestamp?
  
  // 상태
  status: 'generated' | 'filtered' | 'pending_review' | 'published' | 'archived' | 'rejected' | 'flagged'
  publishedAt: Timestamp?
  noindex: boolean                // 7일 유예 옵션
  
  // 자동 필터 결과
  safetyChecks: {
    namedEntityRisk: boolean      // 학교·인물 부정 표현
    politicalRisk: boolean        // 정치 키워드
    factCheckRisk: boolean        // 검증 안 된 통계
    plagiarismRisk: boolean       // 유사도 검사
    minLengthOk: boolean
    sourceCountOk: boolean
    internalLinkOk: boolean
  }
  
  // 성과
  searchPerformance: {
    impressions: number,
    clicks: number,
    avgPosition: number,
    lastSyncedAt: Timestamp
  }
  
  // 자동 갱신
  freshnessScore: number?         // 0~100 (낮으면 재작성 큐)
  updatedAt: Timestamp

rss_items/{rssId}                  (자동 수집된 외부 뉴스 원본)
  source: string                   // "제주의소리", "한라일보" 등
  title: string
  url: string
  publishedAt: Timestamp
  fetchedAt: Timestamp
  rawContent: string?              // 원문 발췌 (저작권 주의, 분석 목적만)
  matchedKeywords: string[]        // 우리 키워드 풀과 매치된 것
  usedInArticleId: string?         // 어느 글에서 사용됐는지
  status: 'new' | 'matched' | 'used' | 'irrelevant'

content_filters/{filterId}          (필터 룰셋)
  name: string                     // "정치 키워드", "부정 표현" 등
  type: 'block' | 'flag'
  patterns: string[]               // 정규식 또는 키워드
  active: boolean
  notes: string
```

### 3.2 보안 규칙

```javascript
match /articles/{articleId} {
  allow read: if resource.data.status == 'published' && !resource.data.noindex;
  allow read: if isAdmin(request.auth.uid);
  allow write: if isAdmin(request.auth.uid);
}

match /seo_ideas/{ideaId} {
  allow read, write: if isAdmin(request.auth.uid);
}

match /rss_items/{rssId} {
  allow read, write: if isAdmin(request.auth.uid);
}

match /content_filters/{filterId} {
  allow read, write: if isAdmin(request.auth.uid);
}
```

---

## 4. 페이지 구조

### 4.1 공개 페이지

```
/articles                          블로그 메인 (최신·카테고리·검색)
/articles/[slug]                   개별 글
/articles/category/[name]          카테고리 페이지
/articles/keyword/[keyword]        키워드 페이지 (관련 글 묶음, SEO 강화용)
/articles/pillar                   권위 글 20편 모음 ⭐
/sitemap.xml                       동적 sitemap
/feed.xml                          RSS 피드
```

### 4.2 어드민 페이지

```
/admin/seo                         SEO 대시보드 (검색 노출·클릭·순위)
/admin/seo/ideas                   키워드 풀 (이슈 후보 큐)
/admin/seo/articles                초안 검수 큐 (pending_review)
/admin/seo/articles/[id]/review    개별 글 검수·편집
/admin/seo/published               발행된 글 관리
/admin/seo/post-review             사후 검토 큐 (발행 후 24시간 검토)
/admin/seo/generate                키워드 입력 → 즉시 초안 생성
/admin/seo/filters                 자동 필터 룰셋 관리
/admin/seo/rss                     RSS 수집 모니터링
```

### 4.3 글 페이지 레이아웃

```
┌──────────────────────────────────────────────────┐
│ 카테고리 · 5분 읽기                                │
│ ━━━                                               │
│ 글 제목 (대형)                                     │
│ 발췌 (2~3문장)                                     │
│ ━━━                                               │
│ 펀제주 편집부 · 2026.05.13 발행                    │
│ ━━━                                               │
│                                                   │
│ [커버 이미지 (선택)]                                │
│                                                   │
│ [본문 — Markdown 렌더]                             │
│  - 섹션별 헤딩                                     │
│  - 인포그래픽·표                                   │
│  - 내부 링크 강조                                  │
│  - 인용 출처는 footnote 스타일                     │
│                                                   │
│ ─────────────────                                 │
│                                                   │
│ 📚 인용 출처                                       │
│  1. [제목] — 매체, 2026.05.01                      │
│  2. ...                                           │
│                                                   │
│ 🔗 관련 글                                          │
│  - 관련 글 카드 3개                                 │
│                                                   │
│ ─────────────────                                 │
│ 발행: 펀제주 편집부 (법인 펀제주)                   │
│ 검수: 2026.05.13 [검수자명]                        │
│ 이 글은 펀제주 AI 어시스트로 초안 작성 후           │
│ 편집부 검수를 거쳐 발행되었습니다.                  │
└──────────────────────────────────────────────────┘
```

투명성 시그널이 신뢰를 만듭니다. AI 활용 사실을 숨기지 않되, **"AI가 썼다"가 아니라 "편집부가 AI 어시스트로 작성·검수했다"**의 톤.

---

## 5. AI 콘텐츠 생성 파이프라인

### 5.1 Pillar Track 워크플로우

```
[1] 운영자가 주제 선택 (20편 중 1편)
    ↓
[2] /admin/seo/generate 페이지에서 상세 입력
    - 타겟 키워드 + 보조 키워드
    - 글 구조 개요 (섹션 5~8개)
    - 필수 인용 출처 (URL 5~10개)
    - 사이트 자체 데이터 활용 지시 ("우리 DB 430교 기준" 등)
    ↓
[3] Cloud Function: generatePillarDraft
    - Claude API 호출 (최고 모델)
    - 시스템 프롬프트: 펀제주 톤·E-E-A-T 시그널·구조 가이드
    - Web search 도구로 최신 사실 확인
    - 분량 4,000~6,000자 강제
    ↓
[4] 초안 articles 컬렉션 저장 (status: pending_review)
    ↓
[5] 운영자 깊은 검수 (4~8시간)
    - 모든 사실·통계 출처 검증
    - 톤 다듬기, AI 어색함 제거
    - 인포그래픽·다이어그램 추가
    - 운영자 인사이트 1~2 단락 직접 작성
    - 내부 링크 보강
    ↓
[6] 발행 (status: published)
    + sitemap 갱신 + Indexing API
```

### 5.2 Daily Track 워크플로우 (자동)

```
[매시간] Cron: collectRssItems
  - 등록된 RSS 피드 8~10개 폴링
  - 키워드 매칭 ("IB", "국제바칼로레아", "영교도", "표선" 등)
  - 매칭 항목 rss_items에 저장 (status: new → matched)

[하루 2회 / 08:00, 16:00] Cron: generateDailyArticles
  ↓
[1] matched 상태 rss_items에서 후보 선정
  - 같은 주제 7일 내 발행 이력 체크 → 중복 제외
  - 우선순위 정렬 (출처 신뢰도 · 최신성 · 검색량)
  ↓
[2] 후보 1~2건 선택
  ↓
[3] Cloud Function: generateDailyDraft(rssItemId)
  - Claude API 호출
  - 프롬프트 구조:
    
    [시스템]
    당신은 펀제주 편집부의 IB 교육 분석가입니다.
    아래 뉴스를 정리하고 학부모 관점의 분석을 제공하세요.
    
    절대 규칙:
    1. 특정 학교·인물을 비난하지 마세요
    2. 정치적 입장을 단정하지 마세요
    3. 검증 안 된 통계를 인용하지 마세요
    4. 다양한 관점을 병치하세요
    5. 출처를 명확히 인용하세요
    6. 1,500~2,500자
    
    [구조]
    1. 이슈 정리 (50%) - 사실 위주
    2. 펀제주 편집부 분석 (40%) - 의미와 맥락
    3. 학부모를 위한 함의 (10%) - 실용 조언
    
    [본문 톤]
    - 단정 X, 추론 O
    - "~로 보입니다", "~할 가능성이 있습니다"
    - 통계는 출처와 함께
    - 비교·맥락 풍부
    
  - 우리 사이트 schools DB 데이터 자동 주입
  - 관련 학교·이전 글 내부 링크 추천
  ↓
[4] 자동 필터 게이트 (5.3 섹션 참조)
  ↓
[5] 통과: status: published, 즉시 발행
   실패: status: flagged, 운영자 큐로
  ↓
[6] 발행 시 자동 동작
  - JSON-LD 주입
  - sitemap.xml 갱신
  - Google Indexing API 호출
  - 내부 링크 자동 연결
  ↓
[7] 24시간 후 사후 검토 큐 알림
  - 운영자가 발행된 글 다시 확인
  - 문제 발견 시 즉시 수정·noindex 처리
```

### 5.3 자동 필터 게이트 (Critical)

발행 전 모든 자동 글이 통과해야 하는 검사:

```
[검사 1] 분량 (필수)
  Pillar: 4,000자+ / Daily: 1,500자+

[검사 2] 출처 (필수)
  최소 2개 이상의 외부 URL 인용, 모두 접근 가능 (200 OK)

[검사 3] 내부 링크 (필수)
  최소 3개의 우리 사이트 내부 링크 (실제 존재하는 페이지)

[검사 4] 정치 키워드 (block)
  - "보수", "진보", "민주당", "국민의힘", "좌파", "우파", "이념"
  - "장관 사퇴", "탄핵", "정부 비판" 등 특정 패턴
  → 감지되면 status: flagged, 운영자 검토

[검사 5] 부정 표현 (flag)
  - 특정 학교명 + 부정 형용사 ("문제 많은", "실패한", "부족한")
  - 특정 인물명 + 비난 표현
  → 감지되면 status: flagged

[검사 6] 검증 안 된 통계 (flag)
  - 숫자가 포함된 문장 + 출처 없음
  → 감지되면 status: flagged

[검사 7] 표절 (flag)
  - 외부 매체 본문과 텍스트 유사도 30% 초과
  → 감지되면 status: flagged

[검사 8] 사실 일관성 (info)
  - 우리 DB(schools)와 모순되는 진술 (예: 학교명·인증단계)
  → 감지되면 자동 수정 또는 flagged

[검사 9] 중복 발행 (block)
  - 동일 targetKeyword 7일 내 발행 이력
  → 발행 차단

[검사 10] AI 어색 표현 (warn)
  - "결론적으로", "다양한", "효과적인", "주목할 만한" 등 GPT-ism
  → 감지되면 자동 paraphrase 1회 재시도
```

모든 검사 통과 시 자동 발행. flagged 글은 운영자 검수 후 수동 발행.

### 5.4 프롬프트 자산 관리

프롬프트는 코드가 아니라 **데이터로 관리**:

```
prompts/{promptId}
  name: string
  version: number
  type: 'pillar' | 'daily'
  systemPrompt: string
  userPromptTemplate: string       // 변수 자리 포함
  variables: string[]              // 예: ["keyword", "rssTitle"]
  active: boolean
  createdAt: Timestamp
  performance: {                   // 이 프롬프트로 생성된 글들의 평균 성과
    avgImpressions: number,
    avgPostReviewIssues: number,
    avgPositionDay30: number
  }
```

운영자가 어드민에서 프롬프트 편집·테스트 가능. A/B 테스트 지원.

---

## 6. SEO 자동 최적화

### 6.1 JSON-LD 자동 주입

모든 글 페이지에 `Article` 스키마:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "글 제목",
  "description": "메타 디스크립션",
  "image": "커버이미지 URL",
  "author": {
    "@type": "Organization",
    "name": "펀제주 편집부",
    "url": "https://fundjeju.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "펀제주 (주)",
    "logo": { "@type": "ImageObject", "url": "..." }
  },
  "datePublished": "2026-05-13",
  "dateModified": "2026-05-13",
  "mainEntityOfPage": "https://fundjeju.com/articles/[slug]",
  "keywords": ["IB", "국제바칼로레아", "..."],
  "citation": [
    { "@type": "CreativeWork", "name": "출처1", "url": "..." }
  ]
}
```

### 6.2 메타 태그 자동 생성

Next.js `generateMetadata`:
- title (50~60자, 키워드 포함)
- description (140~155자)
- Open Graph (og:title, og:description, og:image, og:type=article)
- Twitter Card
- canonical URL

### 6.3 sitemap.xml 동적 생성

- 발행된 모든 글 + 학교 페이지 + 매거진 이슈
- `lastmod`: article.updatedAt
- `priority`: pillar 0.9 / daily 0.6 / 카테고리 0.7

### 6.4 Google Indexing API

발행 시 즉시 호출:

```typescript
// Cloud Function
async function notifyGoogleIndex(url: string) {
  await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({ url, type: 'URL_UPDATED' })
  });
}
```

사전 작업:
- Google Cloud Console에서 Indexing API 활성화
- 서비스 계정 생성, JSON 키 발급
- Google Search Console에서 사이트 소유 확인 + 서비스 계정 권한 추가

### 6.5 Google Search Console 연동

- Search Console API로 검색 노출·클릭·순위 매일 동기화
- 글별 성과를 `articles.searchPerformance`에 저장
- 어드민 대시보드에서 시각화

### 6.6 내부 링크 자동 연결

발행 시:
- 글 본문에서 학교명·다른 글 키워드 자동 감지
- 최초 1회만 링크 (반복 링크는 SEO 페널티)
- 우리 사이트의 가장 권위 있는 페이지로 연결

### 6.7 freshness 자동 갱신

- 글 발행 후 90일·180일·365일 시점에 자동 재검토
- 인용 출처 링크 헬스 체크 (404 발견 시 운영자 알림)
- 통계 데이터 노후 감지 → 재작성 큐로
- 인기 글은 분기별 업데이트 → "마지막 업데이트: 2026.08.01"

---

## 7. 환경 변수 추가

`.env.local.example`에 추가:

```bash
# AI 모델
ANTHROPIC_API_KEY=
# 또는
OPENAI_API_KEY=

# 웹 검색 (사실 확인용)
TAVILY_API_KEY=
# 또는
SERPER_API_KEY=

# Google APIs
GOOGLE_SERVICE_ACCOUNT_JSON=        # base64 인코딩
GOOGLE_INDEXING_API_ENABLED=true
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://fundjeju.com/

# RSS 수집 대상
RSS_FEEDS_JSON=                     // JSON 배열 (운영자가 어드민에서 편집)
```

---

## 8. 작업 체크리스트

### Phase S1 — 인프라 + Pillar 5편 (4~6주)

PROJECT_SPEC.md Phase 1 완료 후 시작 가능. Phase 2와 병행 가능.

- [ ] **S1-1. 데이터 모델 셋업**
  - [ ] Firestore 컬렉션 (`articles`, `seo_ideas`, `rss_items`, `content_filters`, `prompts`)
  - [ ] 보안 규칙 추가
  - [ ] TypeScript 타입 정의
  - [ ] `lib/firestore/articles.ts` CRUD 헬퍼

- [ ] **S1-2. 공개 페이지**
  - [ ] `/articles` 블로그 메인 (카테고리 탭 + 최신 글 그리드)
  - [ ] `/articles/[slug]` 글 상세 (4.3 레이아웃)
  - [ ] `/articles/category/[name]`
  - [ ] `/articles/pillar` 권위 글 모음 페이지 ⭐
  - [ ] 동적 `sitemap.xml`, `feed.xml`

- [ ] **S1-3. 어드민 기본**
  - [ ] `/admin/seo` 대시보드 (글 카운트·발행 현황)
  - [ ] `/admin/seo/ideas` 키워드 풀
  - [ ] `/admin/seo/generate` 수동 초안 생성 페이지
  - [ ] `/admin/seo/articles/[id]/review` 검수·편집기 (Markdown editor + 미리보기)

- [ ] **S1-4. Pillar 생성 파이프라인**
  - [ ] Claude API 클라이언트 + 시스템 프롬프트 (Pillar용)
  - [ ] Cloud Function `generatePillarDraft`
  - [ ] Web search 도구 연동 (사실 확인)
  - [ ] 사이트 자체 데이터 주입 (schools 컬렉션)

- [ ] **S1-5. SEO 자동화**
  - [ ] JSON-LD 자동 주입 (글 페이지)
  - [ ] Next.js `generateMetadata`
  - [ ] sitemap.xml 동적 생성
  - [ ] Google Indexing API 연동
  - [ ] Google Search Console 인증

- [ ] **S1-6. 첫 Pillar 5편 발행**
  - [ ] 1번 "IB 교육과정 완벽 가이드"
  - [ ] 2번 "IB PYP 학부모 가이드"
  - [ ] 4번 "IB DP 완벽 정리"
  - [ ] 13번 "제주 IB 학교 완벽 가이드"
  - [ ] 15번 "제주 이주 학부모 가이드"

### Phase S2 — 자동 발행 시스템 + Pillar 15편 (4~6주)

- [ ] **S2-1. RSS 수집**
  - [ ] RSS 파서 (Cloud Function `collectRssItems`, 매시간)
  - [ ] 키워드 매칭 로직
  - [ ] `/admin/seo/rss` 모니터링 페이지

- [ ] **S2-2. Daily 생성 파이프라인**
  - [ ] Cloud Function `generateDailyDraft` (Cron 1일 2회)
  - [ ] Daily 시스템 프롬프트
  - [ ] `prompts` 컬렉션 관리 UI

- [ ] **S2-3. 자동 필터 게이트**
  - [ ] 10가지 검사 구현 (5.3 섹션)
  - [ ] `content_filters` 컬렉션 + 어드민 룰셋 관리
  - [ ] flagged 큐 페이지 (`/admin/seo/articles?status=flagged`)

- [ ] **S2-4. 자동 발행 + 사후 검토**
  - [ ] 자동 발행 흐름 (필터 통과 시 즉시 published)
  - [ ] 24시간 후 사후 검토 큐 알림 (이메일 또는 어드민 배지)
  - [ ] `/admin/seo/post-review` 페이지

- [ ] **S2-5. 성과 추적**
  - [ ] Google Search Console API 매일 동기화
  - [ ] 글별 성과 대시보드
  - [ ] 저성과 글 재작성 큐

- [ ] **S2-6. 나머지 Pillar 15편 발행**
  - [ ] 3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20번

### Phase S3 — 운영 + 최적화 (지속)

- [ ] freshness 자동 재검토 (90·180·365일)
- [ ] 인용 출처 헬스 체크
- [ ] A/B 프롬프트 테스트
- [ ] 키워드 풀 자동 확장 (Search Console 데이터 기반)
- [ ] 카테고리·태그 자동 분류 개선
- [ ] 인기 글 인포그래픽 보강

---

## 9. 운영자 결정 사항 (작업 전 확정)

- [ ] AI 모델: **Claude API** vs OpenAI API vs 둘 다
- [ ] 웹 검색 도구: Tavily vs Serper vs 미사용
- [ ] Daily Track 발행 시간 (오전 8시 / 오후 4시?)
- [ ] 자동 발행 모드:
  - (A) **즉시 발행** + 사후 검토 (속도 우선)
  - (B) **noindex 7일 유예** + 사후 검토 후 인덱싱 (안전 우선)
  - (C) **선택적** (글 종류에 따라 다름)
- [ ] 필터 통과 기준 강도 (느슨 / 보통 / 엄격)
- [ ] 책임편집자명·검수자 명단

---

## 10. 함정 목록 (Claude Code가 빠지기 쉬운 실수)

- ❌ "AI 글임을 본문에 명시하겠다"
  → 거절. 매체 명의("펀제주 편집부 AI 어시스트") 사용, 본문에 "AI" 단어 노출 금지.
- ❌ "필터 통과 못 한 글도 일단 발행하고 사후 수정"
  → 거절. 필터는 절대 게이트.
- ❌ "분량을 늘리기 위해 같은 문장을 재구성해서 반복"
  → 거절. thin content보다 나쁨. 진짜 정보 추가만.
- ❌ "Claude로 작성한 뒤 GPT로 다시 한 번 돌려서 자연스럽게"
  → 굳이 X. 좋은 시스템 프롬프트 하나가 더 효과적.
- ❌ "유명 매체 글을 paraphrase해서 발행"
  → 거절. 표절·저작권 위험. 메타 요약 + 우리 분석만 사용.
- ❌ "AI가 출처를 만들어내는 hallucination 무시"
  → 거절. 모든 인용 URL은 200 OK 검증 후 발행.
- ❌ "Pillar 20편을 자동 생성으로 빨리 채우자"
  → 거절. Pillar는 사람 깊은 개입 필수. 1편당 4~8시간.
- ❌ "하루 10편씩 발행해서 검색 인덱싱 빨리 받자"
  → 거절. 스팸 시그널. 하루 3편 한도 엄수.

---

## 11. 첫 작업 시작 시 Claude Code에게 주는 명령

> "PROJECT_SPEC.md, MAGAZINE_SPEC.md를 먼저 읽고 SEO_CONTENT_SPEC.md를 시작합니다.
> 8번 체크리스트의 S1-1부터 S1-5까지 순서대로 진행하세요.
> 절대 규칙(섹션 1)과 자동 필터 게이트(섹션 5.3)는 어떤 경우에도 우회하지 마세요.
> Pillar 글은 운영자가 직접 작성·검수합니다. 자동 발행은 Daily Track에만 적용됩니다.
> 각 단계 끝에 변경 요약과 다음 단계 진행 여부 확인을 요청하세요."

---

## 12. 산출물 기대치

### Phase S1 완료 시점
1. ✅ `/articles/*` 공개 페이지 정상 동작
2. ✅ 어드민 검수 페이지 정상 동작
3. ✅ Pillar 5편 발행 완료
4. ✅ JSON-LD, sitemap, Indexing API 정상
5. ✅ Google Search Console 연동 완료

### Phase S2 완료 시점
1. ✅ RSS 자동 수집 정상
2. ✅ Daily Track 자동 발행 정상 (필터 게이트 포함)
3. ✅ 사후 검토 큐 정상
4. ✅ Pillar 20편 모두 발행
5. ✅ 성과 대시보드 정상

### 6개월 후 운영 목표 (현실적)
- 발행 글: Pillar 20 + Daily 200~300
- 월 검색 노출: 5만~10만회
- 월 클릭: 1,000~3,000
- 1페이지 진입 키워드: 10~30개
- 매거진·커뮤니티 트래픽 유입 기여

---

**시작합니다. 신뢰가 모든 SEO 자산의 기초입니다.**
