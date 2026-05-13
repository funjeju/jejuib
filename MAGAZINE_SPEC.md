# 펀제주 매거진 + 뉴스레터 명세서

> 이 문서는 PROJECT_SPEC.md를 **보완하는** 별도 명세서입니다.
> Claude Code는 PROJECT_SPEC.md를 먼저 읽고, 그 위에 이 문서의 작업을 얹으세요.
> PROJECT_SPEC.md의 모든 절대 규칙은 이 문서에도 동일하게 적용됩니다.

---

## 0. 한 줄 요약

기존 `/jeju` 페이지를 **격주간 매거진형 웹진**으로 구성하고, 같은 콘텐츠를 **뉴스레터로 주 2회 자동 발송**하는 시스템을 구축합니다.

운영 모델: **Web-First, Email-Curated** — 사이트가 본진이고 이메일은 hook.

발행 주체: **법인 펀제주**

---

## 1. 절대 규칙 (PROJECT_SPEC.md 보완)

- 🚫 PROJECT_SPEC.md의 모든 절대 규칙 그대로 적용
- 🚫 `/jeju`를 단순 게시판 그리드로 만들지 말 것 → **편집된 매거진 톤** 유지
- 🚫 뉴스레터 발송 코드를 직접 구현하지 말 것 → **Stibee API 사용** (또는 Resend, 운영자가 선택)
- ✅ 매거진 콘텐츠는 모두 Firestore에 영구 저장 (이메일 발송과 별개로 사이트 아카이브 운영)
- ✅ 비구독자도 매거진 전체 열람 가능 (SEO·바이럴 목적)
- ✅ 운영자는 어드민 페이지에서만 발행 작업 (직접 DB 만지지 않음)

---

## 2. 컨셉

### 매거진 아이덴티티

- **이름**: `펀제주 매거진` (영문: Fundjeju Magazine) — 운영자가 확정 시 반영
- **부제**: "제주 IB 학부모와 학생을 위한 격주 매거진"
- **발행 주기**: 주 2회 (화요일 오전 8시 · 금요일 오후 5시)
  - 화요일 = 이슈·뉴스 중심
  - 금요일 = 매물·로컬·주말 정보 중심
- **1회 분량**: 8~12분 읽기
- **이슈 번호**: ISSUE #1 부터 시작, 순차 증가

### 톤 & 무드

- 정제된 매거진 톤 (롱블랙·뉴닉·매거진 B 참조)
- 데이터 나열이 아닌 **편집장이 선별한 한 호의 흐름**
- 큐레이션의 신뢰 = 법인 펀제주의 책임
- 광고·제휴 콘텐츠는 명확히 표시 (`Sponsored`)

---

## 3. 페이지 레이아웃

### 3.1 `/jeju` — 매거진 표지 (최신 이슈)

스크롤 흐름 (위에서 아래로):

```
┌──────────────────────────────────────────────────────┐
│ [기존 헤더]                                            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  발행 메타                                             │
│  ─ 펀제주 매거진                                       │
│  ─ ISSUE #14 · 2026.05.13 화                          │
│                                                       │
│  [대형 커버 이미지 — 16:9 또는 4:3]                    │
│                                                       │
│  커버 카테고리 (예: 이주기)                            │
│  ━━━                                                  │
│  영교도 학부모 30인이 말하는                            │
│  진짜 제주 이주의 비용                                  │
│  ━━━                                                  │
│  by 펀제주 편집부 · 8분 읽기                            │
│  [전체 읽기 →]                                         │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  이번 호 목차                                          │
│  ─────────────                                        │
│                                                       │
│  📰 이번 주 IB                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐                    │
│  │ 카드 1  │ │ 카드 2  │ │ 카드 3  │                    │
│  │ 썸네일  │ │ 썸네일  │ │ 썸네일  │                    │
│  │ 제목    │ │ 제목    │ │ 제목    │                    │
│  │ 출처    │ │ 출처    │ │ 출처    │                    │
│  └────────┘ └────────┘ └────────┘                    │
│  [섹션 전체 보기 →]                                    │
│                                                       │
│  🏡 부동산 위클리                                       │
│  ┌─────────────────────────────────────────┐          │
│  │ 영교도 시세 요약 (이번 주 표)              │          │
│  │ 매매 평균 · 전세 평균 · 전주 대비 변동       │          │
│  └─────────────────────────────────────────┘          │
│  ┌────────┐ ┌────────┐ ┌────────┐                    │
│  │ 매물 1  │ │ 매물 2  │ │ 매물 3  │                    │
│  └────────┘ └────────┘ └────────┘                    │
│  [매물 전체 보기 →]                                    │
│                                                       │
│  👨‍👩‍👧 이주기                                            │
│  ┌──────────────────────────────────────────┐         │
│  │ [큰 카드 — 인터뷰 헤드샷 + 본문 발췌 3줄]    │         │
│  └──────────────────────────────────────────┘         │
│  [모든 이주기 →]                                       │
│                                                       │
│  🍴 로컬                                               │
│  ┌────────┐ ┌────────┐                                │
│  │ 맛집    │ │ 이벤트  │                                │
│  └────────┘ └────────┘                                │
│                                                       │
│  💬 펀제주가 골랐어요 (인증 회원 베스트)                │
│  ┌────────┐ ┌────────┐ ┌────────┐                    │
│  │ 게시글  │ │ 게시글  │ │ 게시글  │                    │
│  └────────┘ └────────┘ └────────┘                    │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ✉️  뉴스레터 구독                                      │
│  ─────────────                                        │
│  주 2회 화요일 아침 · 금요일 저녁                       │
│  이메일로 받아보세요                                    │
│                                                       │
│  [이메일 주소 입력]  [구독하기]                         │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  지난 이슈                                             │
│  ─────────                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ #13  │ │ #12  │ │ #11  │ │ #10  │ ...             │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│  [전체 아카이브 →]                                     │
│                                                       │
├──────────────────────────────────────────────────────┤
│ [기존 푸터]                                            │
└──────────────────────────────────────────────────────┘
```

### 3.2 `/magazine/issue/[issueNumber]` — 개별 이슈 상세

- `/jeju`와 동일한 흐름이되, 모든 섹션이 풀로 노출
- 상단 발행 메타 + 큰 커버
- 섹션별 모든 아이템 카드 그리드
- 좌측에 목차 sticky (데스크탑)
- 하단에 다음/이전 이슈 네비
- 하단에 구독 CTA + 공유 버튼

### 3.3 `/magazine/section/[sectionSlug]` — 섹션 아카이브

- 한 섹션만 모아보기 (예: 부동산 위클리 전체)
- 시간 역순 그리드
- 필터: 이슈 번호, 태그

### 3.4 `/magazine/archive` — 전체 이슈 아카이브

- 발행 시간순 그리드
- 검색·필터 (연도·태그·키워드)

### 3.5 어드민 페이지 (운영자 전용)

```
/admin                     — 어드민 대시보드
/admin/issues              — 이슈 목록
/admin/issues/new          — 새 이슈 편집기
/admin/issues/[id]/edit    — 이슈 편집
/admin/items               — 콘텐츠 아이템 풀 (재료 창고)
/admin/items/new           — 새 아이템 등록
/admin/subscribers         — 구독자 관리
/admin/newsletter          — 발송 로그 + 통계
```

**접근 권한**: Firestore `users.role === 'admin'` 인 회원만. middleware로 차단.

---

## 4. 데이터 모델 (PROJECT_SPEC.md에 추가)

### 4.1 새 컬렉션

```
magazine_issues/{issueId}
  number: number                  // ISSUE #14
  title: string                   // 커버 헤드라인
  subtitle: string?               // 커버 부제
  coverImageUrl: string           // 커버 이미지 (Firebase Storage)
  coverCategory: string           // 커버 카테고리 라벨 (예: "이주기")
  coverItemId: string?            // 커버 스토리로 지정한 아이템 id
  publishedAt: Timestamp
  scheduledAt: Timestamp?         // 예약 발행
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  sections: [                     // 섹션 순서·구성
    {
      slug: 'ib_news' | 'real_estate' | 'moving_in' | 'local' | 'voices'
      title: string               // 표시 제목
      itemIds: string[]           // 이 섹션에 들어갈 아이템들 (순서대로)
      sponsorLabel: string?       // 광고 표시 (있을 때만)
    }
  ]
  newsletter: {
    sent: boolean
    sentAt: Timestamp?
    stibeeMessageId: string?      // 발송 추적용
    openRate: number?             // 발송 후 통계 갱신
    clickRate: number?
  }
  editorNote: string?             // 편집장의 말
  createdBy: string               // 운영자 uid
  createdAt: Timestamp
  updatedAt: Timestamp

magazine_items/{itemId}
  type: 'news' | 'listing' | 'interview' | 'place' | 'voice' | 'column'
  section: 'ib_news' | 'real_estate' | 'moving_in' | 'local' | 'voices'
  title: string
  summary: string                 // 카드용 짧은 요약 (2~3줄)
  body: string                    // 본문 Markdown (interview·column 일 때 사용)
  thumbnailUrl: string?
  sourceUrl: string?              // 외부 출처 (뉴스 큐레이션 시)
  sourceName: string?             // 매체명
  authorName: string?             // 필자명 (interview, column)
  tags: string[]
  relatedSchoolIds: string[]
  linkedListingId: string?        // listing 타입일 때
  linkedPostId: string?           // voice 타입일 때 (인증 회원 게시글 인용)
  publishedAt: Timestamp
  usedInIssues: string[]          // 어느 이슈에 사용됐는지 (역참조)
  status: 'draft' | 'ready' | 'used' | 'archived'
  createdBy: string
  createdAt: Timestamp

subscribers/{subscriberId}
  email: string                   // 정규화 (소문자)
  name: string?
  source: 'web_form' | 'invite' | 'import'
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  confirmedAt: Timestamp?         // double opt-in 완료 시각
  unsubscribedAt: Timestamp?
  tags: string[]                  // 'jeju_resident' | 'considering_move' 등
  stibeeId: string?               // Stibee 동기화 id
  createdAt: Timestamp
```

### 4.2 보안 규칙 추가

```javascript
// magazine_issues
match /magazine_issues/{issueId} {
  allow read: if resource.data.status == 'published';
  allow write: if isAdmin(request.auth.uid);
}

// magazine_items
match /magazine_items/{itemId} {
  allow read: if resource.data.status in ['ready', 'used'];
  allow write: if isAdmin(request.auth.uid);
}

// subscribers
match /subscribers/{subId} {
  allow read: if isAdmin(request.auth.uid);
  allow create: if true;            // 구독 폼은 누구나
  allow update: if isAdmin(request.auth.uid);
  allow delete: if isAdmin(request.auth.uid);
}
```

---

## 5. 어드민 워크플로우

### 5.1 콘텐츠 라이프사이클

```
[수시] 운영자가 아이템 등록
  /admin/items/new
  ├─ 뉴스 큐레이션: URL 입력 → 자동 메타 추출 → 요약 작성 → status: ready
  ├─ 매물 등록: 사진·시세·학교 매핑 → status: ready
  ├─ 인터뷰·칼럼: 본문 직접 작성 → status: ready
  └─ Voices(베스트 게시글): 인증 게시글에서 선택 → 요약 → status: ready

  ↓ 아이템 풀에 쌓임

[발행일 직전] 운영자가 이슈 편집
  /admin/issues/new
  ├─ 커버 스토리 선택
  ├─ 섹션별로 ready 아이템들을 드래그앤드롭으로 배치
  ├─ 편집장의 말(editorNote) 작성
  ├─ 미리보기 (사이트 + 이메일 양쪽)
  └─ "발행" 또는 "예약 발행"

  ↓ 발행 트리거

[발행 시점] 자동 동작
  ├─ magazine_issues.status = 'published'
  ├─ 모든 itemIds의 status = 'used'
  ├─ /magazine/issue/[number] 페이지 자동 노출
  ├─ /jeju 표지를 최신 이슈로 갱신
  ├─ Stibee API 호출 → 구독자에게 이메일 발송
  ├─ Cloud Function이 발송 결과를 issue.newsletter에 기록
  └─ (옵션) 카카오톡 채널 알림

[발송 후] 통계 갱신
  ├─ Stibee webhook으로 openRate/clickRate 수신
  └─ issue.newsletter에 업데이트
```

### 5.2 어드민 페이지 상세

#### `/admin/items` — 아이템 풀

테이블 형식:
- 컬럼: 타입 | 섹션 | 제목 | 상태 | 등록일 | 사용된 이슈 | 액션
- 필터: 타입, 섹션, 상태
- 일괄 작업: 상태 변경, 삭제

#### `/admin/items/new` — 아이템 등록 폼

타입 선택 후 동적 폼:

**뉴스 큐레이션**
- URL 입력 → "메타 가져오기" 버튼 (Cloud Function이 og:title/description/image 추출)
- 자동 채워진 필드 편집 가능
- 요약(summary) 직접 작성 (2~3문장)
- 관련 학교 멀티 셀렉트

**매물**
- 학교 선택 → 인근 매물로 자동 매핑
- 사진 업로드 (최대 8장)
- 매매/전세/월세 + 가격 + 면적
- 출처(공인중개사명) 필수
- 설명 Markdown

**인터뷰·칼럼**
- 제목·필자·본문(Markdown 에디터)
- 썸네일 이미지
- 태그

**Voices (인증 회원 게시글)**
- posts에서 검색 → 선택
- 인용 허용 동의 표시 (운영자 책임)
- 발췌 부분 편집

#### `/admin/issues/new` — 이슈 편집기

레이아웃: 좌측 사이드(섹션 트리) + 메인(편집 영역) + 우측(아이템 풀 검색)

```
┌──────────┬─────────────────────────┬────────────┐
│ 섹션 트리 │ 이슈 편집                │ 아이템 풀   │
│           │                          │            │
│ ▸ 커버    │ ISSUE 번호: 자동(14)     │ [검색]      │
│ ▸ 이번주IB│ 발행일: [날짜피커]        │            │
│ ▸ 부동산  │ 제목: [입력]             │ 📰 카드     │
│ ▸ 이주기  │ 커버이미지: [업로드]      │ 📰 카드     │
│ ▸ 로컬    │                          │ 🏡 카드     │
│ ▸ Voices  │ [현재 선택 섹션 영역]    │            │
│           │ ┌────┐ ┌────┐ ┌────┐    │ ← 드래그   │
│           │ │아이│ │아이│ │아이│    │   해서 추가│
│           │ │템1 │ │템2 │ │템3 │    │            │
│           │ └────┘ └────┘ └────┘    │            │
│           │                          │            │
│           │ [미리보기] [발행]        │            │
└──────────┴─────────────────────────┴────────────┘
```

기능:
- **드래그앤드롭**으로 아이템 순서 변경
- **미리보기**: 사이트 뷰 + 이메일 뷰 토글
- **임시 저장** (status: draft)
- **예약 발행**: scheduledAt 설정
- **즉시 발행**: 즉시 Stibee 발송

#### `/admin/subscribers` — 구독자 관리

- 테이블: 이메일 | 이름 | 상태 | 태그 | 가입일
- CSV 가져오기·내보내기
- Stibee 동기화 버튼
- 태그 일괄 적용

#### `/admin/newsletter` — 발송 로그

- 발송한 이슈별 통계 (오픈율, 클릭률, 구독 취소율)
- Stibee와 동기화

---

## 6. 뉴스레터 발송 시스템

### 6.1 도구 선택

**1순위 추천: Stibee** (한국 매체 표준)
- 한국어 템플릿 풍부
- 도메인 인증·스팸 정책 한국 환경에 최적화
- API로 구독자 동기화 + 발송 트리거
- 통계 대시보드 우수
- 가격: 구독자 ~5,000명 무료 시작

**2순위 옵션: Resend + React Email**
- 개발자 친화, 코드로 템플릿 제어
- 글로벌 SaaS, 한국 도메인 평판 약간 약함
- 1만 명까지 무료

운영자가 결정. **이 명세서는 Stibee를 기본 가정**으로 작성.

### 6.2 발송 흐름

```
[1] 운영자가 어드민에서 "발행" 클릭
    ↓
[2] Next.js API Route: /api/magazine/publish
    ├─ Firestore: magazine_issues 상태 업데이트
    └─ 발송 트리거 호출
    ↓
[3] Cloud Function: publishNewsletter(issueId)
    ├─ Firestore에서 이슈 + 아이템 fetch
    ├─ React Email 또는 Stibee 템플릿으로 HTML 생성
    ├─ Stibee API: /v1/auto/templates 로 캠페인 생성
    ├─ Stibee API: 발송 트리거
    └─ 결과를 magazine_issues.newsletter 에 기록
    ↓
[4] Stibee가 구독자 전원에게 발송
    ↓
[5] 오픈·클릭 이벤트 webhook
    ├─ Cloud Function: handleStibeeWebhook
    └─ Firestore 통계 갱신
```

### 6.3 이메일 템플릿 디자인 원칙

- **모바일 우선** (600px 이하)
- **시각 톤**: 사이트 디자인 토큰 그대로 (`--bg`, `--accent`)
- **이미지 의존도 낮음**: 이메일 클라이언트가 이미지 차단해도 읽힘
- **링크 강조**: 본문은 사이트로 유도, 이메일에서 풀로 다 보여주지 않음 ("전체 읽기 →")
- **푸터 필수**:
  - 발행: 펀제주 (주)
  - 사업자번호·주소
  - 구독 취소 링크 (Stibee 자동)
  - 청소년보호책임자

### 6.4 구독 흐름 (Double Opt-In)

```
[1] 사용자가 사이트에서 이메일 입력
    ↓
[2] Firestore subscribers 생성 (status: pending)
    ↓
[3] 인증 메일 발송 (Stibee 또는 Resend)
    ↓
[4] 사용자가 이메일 안 "구독 확정" 링크 클릭
    ↓
[5] /api/subscribe/confirm?token=xxx
    ├─ subscribers.status = 'active'
    ├─ subscribers.confirmedAt = now
    └─ Stibee API로 구독자 동기화
    ↓
[6] "구독 완료" 페이지 노출
```

법적 의무: **수신 동의 명시** + **불법 스팸 방지법 준수** (구독 취소 1클릭, 발신자 정보 명시).

---

## 7. 컴포넌트 명세

### 7.1 사이트 컴포넌트

```
components/magazine/
  ├── IssueCover.tsx         — 표지(대형 커버 이미지 + 헤드라인)
  ├── IssueMeta.tsx          — 발행 메타 (번호·날짜·필자)
  ├── SectionHeader.tsx      — 섹션 제목 + "전체 보기" 링크
  ├── ItemCard.tsx           — 아이템 카드 (타입별 variant)
  │   ├── variant: news      — 썸네일 + 제목 + 출처
  │   ├── variant: listing   — 가격 + 평형 + 학교 매핑
  │   ├── variant: interview — 헤드샷 + 발췌
  │   ├── variant: place     — 카테고리 + 위치
  │   └── variant: voice     — 배지(작성자) + 발췌
  ├── RealEstateSummary.tsx  — 시세 요약 박스
  ├── SubscribeCTA.tsx       — 인라인 구독 폼
  ├── IssueGrid.tsx          — 지난 이슈 그리드
  └── ShareButtons.tsx       — 카톡·복사 공유

components/admin/
  ├── ItemForm.tsx           — 타입별 동적 폼
  ├── IssueEditor.tsx        — 드래그앤드롭 편집기
  ├── ItemPool.tsx           — 우측 아이템 풀
  ├── EmailPreview.tsx       — 이메일 뷰 미리보기
  ├── SubscriberTable.tsx
  └── StatsCard.tsx
```

### 7.2 이메일 템플릿 (React Email 또는 Stibee 템플릿)

```
emails/
  ├── IssueEmail.tsx         — 이슈 발송 템플릿
  │   ├── 헤더 (펀제주 로고 + 이슈 번호)
  │   ├── 커버 (이미지 + 헤드라인 + "전체 읽기" 버튼)
  │   ├── 섹션 반복 (제목 + 아이템 2~3개 + "더 보기" 링크)
  │   └── 푸터 (구독 취소 + 법적 정보)
  └── SubscribeConfirmEmail.tsx  — Double opt-in
```

---

## 8. 환경 변수 추가

`.env.local.example`에 추가:

```bash
# Stibee
STIBEE_API_KEY=
STIBEE_LIST_ID=               # 메인 구독자 리스트 ID
STIBEE_WEBHOOK_SECRET=

# (또는 Resend 선택 시)
RESEND_API_KEY=

# Open Graph 메타 추출 (뉴스 큐레이션)
OG_FETCHER_USER_AGENT=FundjejuBot/1.0
```

---

## 9. 작업 체크리스트

### Phase M1 — 매거진 기본 (Phase 2 완료 후 시작)

전제: PROJECT_SPEC.md의 Phase 1, Phase 2가 끝나 있어야 함.

- [ ] **M1-1. 데이터 모델 셋업**
  - [ ] Firestore에 `magazine_issues`, `magazine_items`, `subscribers` 컬렉션 보안 규칙 추가
  - [ ] `lib/firestore/magazine.ts` CRUD 헬퍼 작성
  - [ ] TypeScript 타입 정의

- [ ] **M1-2. 사이트 페이지**
  - [ ] `/jeju` 페이지 리뉴얼 — 최신 발행 이슈 표지 형태
  - [ ] `/magazine/issue/[number]` 개별 이슈 페이지
  - [ ] `/magazine/section/[slug]` 섹션 아카이브
  - [ ] `/magazine/archive` 전체 아카이브
  - [ ] 발행된 이슈가 없을 때 placeholder

- [ ] **M1-3. 컴포넌트**
  - [ ] `IssueCover`, `IssueMeta`, `SectionHeader`
  - [ ] `ItemCard` 5가지 variant
  - [ ] `RealEstateSummary`, `SubscribeCTA`, `IssueGrid`, `ShareButtons`

- [ ] **M1-4. 구독 폼**
  - [ ] 사이트 푸터·매거진 페이지에 구독 인라인 폼
  - [ ] `/api/subscribe` API Route (Firestore 저장 + 확인 메일)
  - [ ] `/subscribe/confirm` 페이지 (Double Opt-In 완료)

### Phase M2 — 어드민 + 발송

- [ ] **M2-1. 어드민 인프라**
  - [ ] `/admin` 미들웨어 (role: admin 만 접근)
  - [ ] 어드민 레이아웃 + 사이드바
  - [ ] 어드민 대시보드 기본

- [ ] **M2-2. 아이템 관리**
  - [ ] `/admin/items` 목록 + 필터
  - [ ] `/admin/items/new` 타입별 동적 폼
  - [ ] Cloud Function `fetchOgMeta` (URL → 메타 추출)
  - [ ] 이미지 업로드 (Firebase Storage)

- [ ] **M2-3. 이슈 편집기**
  - [ ] `/admin/issues` 목록
  - [ ] `/admin/issues/new` 드래그앤드롭 편집기
  - [ ] 사이트 미리보기 모드
  - [ ] 이메일 미리보기 모드
  - [ ] 임시 저장 + 예약 발행

- [ ] **M2-4. Stibee 연동**
  - [ ] Stibee API 클라이언트 작성
  - [ ] Cloud Function `publishNewsletter`
  - [ ] 발송 결과 Firestore 기록
  - [ ] Stibee webhook 핸들러 (오픈·클릭·구독취소)

- [ ] **M2-5. 구독자 관리**
  - [ ] `/admin/subscribers` 테이블 + 검색
  - [ ] CSV 가져오기·내보내기
  - [ ] Stibee 양방향 동기화

- [ ] **M2-6. 발송 로그·통계**
  - [ ] `/admin/newsletter` 통계 페이지
  - [ ] 이슈별 오픈율·클릭율 차트

### Phase M3 — 운영 자동화 (선택)

- [ ] RSS 자동 수집 (제주의소리·한라일보·헤드라인제주 등) → 아이템 후보로 자동 등록
- [ ] 인증 회원 게시글 중 좋아요 많은 글 자동 추천
- [ ] 매물 자동 갱신 (공인중개사 어드민 → 매거진 아이템 자동 연동)
- [ ] 예약 발행 cron 작업
- [ ] 발송 실패 자동 재시도

---

## 10. 첫 작업 시작 시 Claude Code에게 주는 명령

> "PROJECT_SPEC.md의 Phase 1, Phase 2가 모두 완료된 상태에서 시작합니다.
> MAGAZINE_SPEC.md의 절대 규칙(섹션 1)을 확인하고,
> 9번 체크리스트의 M1-1부터 M1-4까지 순서대로 진행하세요.
> 각 단계 끝에 변경 요약과 다음 단계 진행 여부 확인을 요청하세요.
> `/jeju` 페이지의 매거진 톤을 절대 게시판처럼 만들지 마세요."

---

## 11. 자주 빠지는 함정

- ❌ "매거진을 그냥 블로그 글 목록으로 만들겠다"
  → 거절. **이슈 단위**로 묶이는 매거진 구조 유지.
- ❌ "구독 폼을 푸터에만 두겠다"
  → 거절. 매거진 페이지 끝, 이슈 페이지 끝, 푸터 모두에 배치.
- ❌ "Stibee 대신 직접 SMTP로 발송"
  → 거절. 도메인 평판·법적 의무 처리 위험. 반드시 Stibee 또는 Resend.
- ❌ "임의로 발행 주기를 매일로 늘리겠다"
  → 거절. 주 2회 고정. 운영자 결정 사항.
- ❌ "이메일 본문에 모든 콘텐츠를 풀로 넣겠다"
  → 거절. 이메일은 hook, 사이트가 본진. 발췌 + 링크.
- ❌ "어드민 페이지 인증을 단순한 비밀번호 체크로"
  → 거절. 반드시 Firebase Auth + role 체크.

---

## 12. 운영자 결정 사항 (Claude Code 작업 전 확정)

- [ ] 매거진 정식 이름 (예: "펀제주 매거진")
- [ ] 발행 주기 확정 (주 2회 화·금? 주 1회?)
- [ ] 발행 시간 (오전 8시 / 오후 5시?)
- [ ] 뉴스레터 도구 (Stibee vs Resend)
- [ ] 발신 이메일 주소 (예: `magazine@fundjeju.com`)
- [ ] 첫 호 발행 목표일
- [ ] 책임편집자명·청소년보호책임자

---

## 13. 산출물 기대치 (Phase M1 완료 시점)

1. ✅ `/jeju` 페이지가 매거진 표지 형태로 동작
2. ✅ 이슈가 없을 때 "곧 첫 호가 발행됩니다" placeholder 노출
3. ✅ 구독 폼 동작 (Double Opt-In 완료)
4. ✅ `subscribers` 컬렉션에 데이터 쌓임
5. ✅ 모바일·데스크탑 반응형
6. ✅ 디자인 토큰 일관성 (PROJECT_SPEC.md 6.1 그대로)

## 14. 산출물 기대치 (Phase M2 완료 시점)

1. ✅ 운영자가 어드민에서 아이템 등록 가능
2. ✅ 운영자가 이슈 편집·발행 가능
3. ✅ Stibee 발송 정상 동작 (테스트 발송 성공)
4. ✅ 발송 후 통계 자동 수집
5. ✅ 구독자 양방향 동기화

---

**시작합니다. 매거진 톤을 잊지 마세요.**
