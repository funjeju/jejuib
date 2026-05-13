# 펀제주 IB 포털 — Claude Code 작업 지시서

> 이 문서는 Claude Code 작업 지시문입니다.
> **반드시 처음부터 끝까지 읽고 시작하세요.**
> 임의 스코프 확장 금지. 체크리스트를 따르세요.

---

## 0. 한 줄 요약

기존 정적 IB 학부모 가이드 사이트(68개 HTML + 학교 검색기)는 **그대로 보존**하면서, 같은 도메인 안에 **인증 기반 커뮤니티 + 제주 특화 정보 허브를 Next.js + Firebase 별도 앱으로 추가**합니다.

운영 주체: **법인 펀제주**.

---

## 1. 절대 규칙 (Hard Rules)

이 규칙은 어떤 경우에도 위반하지 마세요.

### 🚫 절대 하지 말 것

1. **기존 68개 HTML 파일의 내용을 수정하지 말 것.**
   대상: `index.html`, `myp_index.html`, `bigpic.html`, `cycle.html`, `timeline.html`, `concepts.html`, `evaluation.html`, `forms.html`, `parent.html`, `glossary.html`, `pyp_*.html`, `schools.html`, `/docs/*.html`, `/docs/pyp/*.html`

2. **기존 18개 Node.js 빌드 스크립트를 실행하지 말 것.**
   대상: `update.js`, `glossary_*.js`, `make_portal.js`, `add_glossary.js`, `generalize.js`, `split_site.js`, `init_pyp.js`, `update_pyp_*.js`, `seo_and_*.js`, `blog_seo.js`, `fix_pyp_nav.js`
   → 단순히 `/legacy-scripts/` 폴더로 이동만 시킬 것 (보관 목적, 실행 안 함)

3. **기존 `style.css`를 수정하지 말 것.** (가이드 사이트의 시각을 유지)

4. **기존 `package.json`의 dependencies를 건드리지 말 것.** (jsdom 등)

5. **기존 사이트의 디자인 컨셉(코랄 계열)을 새 앱에 가져오지 말 것.**
   새 앱은 학교 검색기에서 쓴 디자인 토큰(웜 베이지 + 딥그린)을 따른다.

### ✅ 반드시 할 것

1. 기존 정적 자산은 `/public/legacy/` 로 이동 후 그대로 서빙
2. 새 기능은 모두 Next.js 앱 안에 구현
3. 새 앱은 Firebase 백엔드 사용 (Supabase 아님, 절대로)
4. 모든 UI 컴포넌트는 shadcn/ui 기반, 단 색상 토큰은 현재 학교 검색기 토큰 사용
5. 매 작업 단계 끝에 동작 테스트할 것 (검색기 깨졌는지, 가이드 페이지 열리는지 등)

---

## 2. 비즈니스 컨텍스트 (참고용)

- **타겟**: IB 학교 재학생·졸업생·학부모·예비 학부모·제주 이주 검토자
- **차별점**:
  (1) AI 인증된 회원만 글쓰기 (블라인드 방식)
  (2) 제주 특화 부동산·뉴스·맛집 통합
  (3) 법인 펀제주의 큐레이션 신뢰
- **수익**: 부동산 제휴, 학원·컨설팅 매칭, 학부모 멤버십 (장기)

---

## 3. 기술 스택 (고정)

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Next.js 14+ (App Router)** | TypeScript |
| 백엔드/DB | **Firebase** | Firestore + Auth + Storage + Functions |
| 인증 | **Firebase Auth** | Google + Email/Password |
| OCR | **네이버 클로바 OCR** | Cloud Functions에서 호출 |
| 스타일 | **Tailwind CSS** | |
| UI | **shadcn/ui** | 색상은 커스텀 토큰 적용 |
| 지도 | **카카오맵 JS SDK** | |
| 폼 | **React Hook Form + Zod** | |
| 호스팅 | **Vercel** | |
| 폰트 | **Pretendard Variable** | CDN 또는 npm 패키지 |
| 상태 | **Zustand** | 필요시만 |

---

## 4. 디렉토리 구조 (목표 상태)

```
/ (프로젝트 루트)
│
├── 📂 public/                    ← 정적 자산 보존 영역
│   └── legacy/                   ← 기존 68개 HTML + style.css 이동
│       ├── style.css
│       ├── guide/
│       │   ├── index.html
│       │   ├── myp/
│       │   │   ├── index.html (이전 myp_index.html)
│       │   │   ├── bigpic.html
│       │   │   ├── cycle.html
│       │   │   ├── timeline.html
│       │   │   ├── concepts.html
│       │   │   ├── evaluation.html
│       │   │   ├── forms.html
│       │   │   ├── parent.html
│       │   │   └── glossary.html
│       │   ├── pyp/
│       │   │   └── (pyp_*.html 8개 이동)
│       │   └── docs/
│       │       ├── myp/ (01_~30_.html 30개)
│       │       └── pyp/ (01_~30_.html 30개)
│       └── explore/
│           └── index.html (현재 학교 검색기 단일 HTML)
│
├── 📂 legacy-scripts/             ← 18개 빌드 스크립트 보관 (실행 안 함)
│   ├── README.md (이 폴더의 스크립트는 더이상 사용하지 않음 명시)
│   └── (기존 .js 파일들)
│
├── 📂 app/                       ← Next.js App Router (새 앱)
│   ├── layout.tsx                 (전역 레이아웃)
│   ├── page.tsx                   (랜딩 /)
│   ├── globals.css                (Tailwind + 커스텀 토큰)
│   ├── (legacy)/
│   │   ├── guide/[...slug]/page.tsx     (가이드 페이지 프록시)
│   │   └── explore/page.tsx              (검색기 프록시)
│   ├── school/[id]/page.tsx              (학교 상세 + 게시판)
│   ├── community/page.tsx                (통합 피드)
│   ├── jeju/
│   │   ├── page.tsx                       (제주 허브)
│   │   ├── news/page.tsx
│   │   ├── listings/page.tsx
│   │   └── places/page.tsx
│   ├── verify/page.tsx                    (AI 인증)
│   ├── me/page.tsx                        (마이페이지)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── notice/page.tsx                    (펀제주 공지)
│   └── api/
│       ├── verify/route.ts                (OCR 호출 엔드포인트)
│       └── moderation/route.ts            (신고 처리)
│
├── 📂 components/                 ← shadcn/ui + 자체 컴포넌트
│   ├── ui/                        (shadcn 기본)
│   ├── school/                    (학교 관련)
│   │   ├── SchoolCard.tsx
│   │   ├── SchoolDetail.tsx
│   │   ├── SchoolBoard.tsx
│   │   └── NearbyWidget.tsx
│   ├── community/                 (게시글 관련)
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   └── CommentTree.tsx
│   ├── auth/                       (로그인·인증 관련)
│   │   ├── LoginForm.tsx
│   │   ├── VerifyUpload.tsx
│   │   └── BadgePill.tsx
│   └── shared/                    (공통)
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Logo.tsx
│
├── 📂 lib/
│   ├── firebase/
│   │   ├── client.ts              (브라우저용 Firebase init)
│   │   ├── admin.ts               (서버용 Admin SDK)
│   │   └── auth.ts                (Auth 헬퍼)
│   ├── firestore/
│   │   ├── schools.ts             (학교 CRUD)
│   │   ├── posts.ts               (게시글 CRUD)
│   │   ├── verifications.ts
│   │   └── types.ts                (TypeScript 타입 정의)
│   ├── ocr/
│   │   └── clova.ts               (클로바 OCR 호출)
│   └── utils/
│       └── cn.ts                  (className 머지)
│
├── 📂 data/
│   └── schools.ts                  (430교 시드 데이터)
│
├── 📂 functions/                  ← Firebase Cloud Functions (별도 폴더)
│   ├── src/
│   │   ├── index.ts
│   │   ├── verifyDocument.ts     (OCR + 검증 자동 폐기)
│   │   └── moderation.ts
│   └── package.json               (별도 의존성)
│
├── 📄 next.config.js              (rewrites로 /legacy/* 라우팅)
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
├── 📄 components.json             (shadcn 설정)
├── 📄 firebase.json               (Firebase 프로젝트 설정)
├── 📄 firestore.rules             (보안 규칙)
├── 📄 storage.rules
├── 📄 .env.local.example
├── 📄 package.json                (새 의존성)
└── 📄 README.md
```

---

## 5. 라우팅 (Next.js + 정적 자산)

### Next.js `next.config.js`에 rewrites 설정

```js
module.exports = {
  async rewrites() {
    return [
      // 가이드 사이트는 /public/legacy/guide/* 에서 그대로 서빙
      { source: '/guide/:path*', destination: '/legacy/guide/:path*' },
      { source: '/explore', destination: '/legacy/explore/index.html' },
    ];
  },
};
```

### 최종 URL 구조

| URL | 처리 | 출처 |
|---|---|---|
| `/` | Next.js 랜딩 | `app/page.tsx` |
| `/guide` | 정적 가이드 대문 | `public/legacy/guide/index.html` |
| `/guide/myp/bigpic` | 정적 MYP 페이지 | `public/legacy/guide/myp/bigpic.html` |
| `/guide/pyp/...` | 정적 PYP 페이지 | `public/legacy/guide/pyp/*.html` |
| `/guide/docs/myp/01_*` | 정적 양식 문서 | `public/legacy/guide/docs/myp/*.html` |
| `/explore` | 정적 학교 검색기 | `public/legacy/explore/index.html` |
| `/school/[id]` | 동적 학교 상세 | `app/school/[id]/page.tsx` |
| `/community` | 동적 통합 피드 | `app/community/page.tsx` |
| `/jeju` | 동적 제주 허브 | `app/jeju/page.tsx` |
| `/verify` | 동적 인증 | `app/verify/page.tsx` |
| `/me` | 동적 마이페이지 | `app/me/page.tsx` |
| `/auth/login` | 동적 로그인 | `app/auth/login/page.tsx` |
| `/notice` | 동적 펀제주 공지 | `app/notice/page.tsx` |

**기존 가이드 페이지 내부 링크는 손대지 마세요.** rewrites로 자연스럽게 동작합니다.

---

## 6. 디자인 시스템

### 6.1 색상 토큰 (학교 검색기 기존 토큰 그대로 계승)

```css
/* app/globals.css */
@layer base {
  :root {
    --bg: 39 38% 97%;              /* #FAF8F4 웜 베이지 */
    --surface: 0 0% 100%;          /* #FFFFFF */
    --text: 0 0% 10%;              /* #1A1A1A */
    --text-muted: 0 0% 42%;        /* #6B6B6B */
    --text-faint: 0 0% 60%;        /* #9A9A9A */
    --border: 35 17% 89%;          /* #E7E3DB */
    --border-strong: 36 14% 80%;   /* #D4CFC4 */
    --accent: 158 43% 21%;         /* #1F4D3F 딥그린 */
    --accent-soft: 146 24% 92%;    /* #E8F0EC */

    /* 상태 배지 */
    --cert-bg: 158 50% 92%;        /* #E1F5EE */
    --cert-text: 158 78% 17%;      /* #085041 */
    --cand-bg: 33 79% 92%;         /* #FAEEDA */
    --cand-text: 28 88% 21%;       /* #633806 */
    --int-bg: 48 17% 92%;          /* #EFEDE6 */
    --int-text: 60 2% 27%;         /* #444441 */
    --prog-bg: 245 80% 96%;        /* #EEEDFE */
    --prog-text: 247 46% 37%;      /* #3C3489 */

    /* shadcn 표준 변수 매핑 */
    --background: var(--bg);
    --foreground: var(--text);
    --card: var(--surface);
    --card-foreground: var(--text);
    --primary: var(--accent);
    --primary-foreground: 0 0% 100%;
    --muted: var(--accent-soft);
    --muted-foreground: var(--text-muted);
    --radius: 0.625rem;
  }
}
```

### 6.2 타이포그래피

- **폰트**: Pretendard Variable (모든 텍스트)
- **CDN 로딩**:
  ```html
  <link rel="stylesheet" as="style"
    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css" />
  ```
- **Tailwind 기본 폰트 패밀리에 적용** (`tailwind.config.ts`)

### 6.3 컴포넌트 규칙

- **shadcn/ui** 기본 컴포넌트 그대로 사용 (Button, Card, Dialog, Input, Select 등)
- **그라데이션·드롭섀도우·화려한 색 사용 금지**
- **카드는 1px 보더, 매우 약한 그림자만 (없어도 됨)**
- **공간감 넉넉히** (padding 16~24px, gap 8~12px 기본)
- **라운드는 8~14px**
- **포인트 색은 `--accent` 딥그린 하나만**

---

## 7. Firebase 데이터 모델

### 7.1 Firestore 컬렉션 구조

```
users/{uid}
  email: string
  displayName: string
  role: 'student' | 'alumni' | 'parent' | 'staff' | 'visitor'
  verified: boolean
  verifiedSchoolIds: string[]      // 인증된 학교 id 배열 (재학·졸업·학부모)
  badge: string                     // 예: "2024 졸업생", "재학생", "학부모(중2)"
  createdAt: Timestamp
  updatedAt: Timestamp

schools/{schoolId}
  name: string
  nameEn: string
  region: string                    // "서울" | "경기" | ... | "제주"
  city: string
  address: string
  level: '초등' | '중등' | '고등' | '통합'
  type: '국제학교' | '공립' | '사립'
  stage: '인증' | '후보' | '관심'
  programs: string[]                // ["PYP", "MYP", "DP"]
  lat: number
  lng: number
  ratingAvg: number                 // 0~5 (집계 캐시)
  reviewCount: number
  postCount: number

verifications/{verificationId}
  userId: string
  schoolId: string
  documentType: 'student_id' | 'enrollment_cert' | 'graduation_cert' | 'family_relation'
  storagePath: string               // Storage 경로 (자동 폐기 대상)
  ocrConfidence: number             // 0~100
  extractedSchool: string           // OCR 추출 학교명
  extractedYear: string             // OCR 추출 연도
  status: 'pending' | 'auto_approved' | 'manual_review' | 'approved' | 'rejected'
  createdAt: Timestamp
  reviewedAt: Timestamp?
  expiresAt: Timestamp              // 즉시 폐기 타이머 (7일)

posts/{postId}
  schoolId: string                  // 어느 학교 게시판인지
  authorId: string
  authorBadge: string               // 작성 시점 배지 스냅샷
  type: 'review' | 'question' | 'share' | 'meetup' | 'notice' | 'experience'
  title: string
  body: string                      // Markdown 허용
  tags: string[]
  pinned: boolean                   // 펀제주 공지만 true 가능
  rating: number?                   // type='review'일 때만
  ratingCategories: {               // type='review'일 때만
    teaching: number,
    atmosphere: number,
    parentInvolvement: number,
    iaSupport: number,
    privateTutoring: number
  }
  viewCount: number
  commentCount: number
  reactionCounts: { like: number, helpful: number }
  createdAt: Timestamp
  updatedAt: Timestamp

posts/{postId}/comments/{commentId}    (서브컬렉션)
  authorId: string
  authorBadge: string
  body: string
  parentId: string?                  // 대댓글
  createdAt: Timestamp

reactions/{reactionId}
  userId: string
  targetType: 'post' | 'comment'
  targetId: string
  kind: 'like' | 'helpful' | 'report'
  createdAt: Timestamp

listings/{listingId}                  (제주 부동산)
  nearSchoolIds: string[]
  type: '매매' | '전세' | '월세'
  price: number
  area: number                       // ㎡
  source: string                     // 출처 (공인중개사명)
  sourceUrl: string?
  brokerId: string?                  // 회원가입한 중개사 uid
  title: string
  description: string
  photos: string[]                   // Storage URL
  lat: number
  lng: number
  isActive: boolean
  createdAt: Timestamp

news_items/{newsId}                   (큐레이션 뉴스)
  title: string
  summary: string                    // 펀제주가 요약 (2~3문장)
  source: string                     // 매체명 (예: "제주의소리")
  url: string                        // 원본 URL
  tags: string[]                     // ["영교도", "이주", "입시"...]
  schoolIds: string[]                // 관련 학교
  publishedAt: Timestamp
  curatedBy: string                  // 운영자 uid
  curatedAt: Timestamp

places/{placeId}                      (맛집·생활)
  name: string
  category: '맛집' | '카페' | '병원' | '문화시설' | '기타'
  nearSchoolIds: string[]
  description: string
  lat: number
  lng: number
  photos: string[]
  createdAt: Timestamp

notices/{noticeId}                    (펀제주 공식 공지)
  title: string
  body: string                       // Markdown
  regionScope: 'all' | 'jeju' | 'seoul' | ...
  publishedAt: Timestamp
  authorName: '펀제주'
```

### 7.2 Storage 구조

```
verifications/{userId}/{timestamp}-{filename}   (7일 후 자동 삭제)
listings/{listingId}/{filename}
places/{placeId}/{filename}
posts/{postId}/{filename}                       (게시글 첨부 이미지)
```

### 7.3 Firestore 보안 규칙 (핵심)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 학교는 모두 읽기 가능, 쓰기는 운영자만
    match /schools/{schoolId} {
      allow read: if true;
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 회원은 본인만 수정 가능
    match /users/{uid} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == uid;
      allow update: if request.auth.uid == uid
                    && !('verified' in request.resource.data.diff(resource.data).affectedKeys());
                    // 'verified' 필드는 클라이언트가 직접 수정 못 함
      allow delete: if false;
    }

    // 게시글: 읽기는 모두, 쓰기는 인증된 회원만
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
                    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.verified == true;
      allow update, delete: if request.auth.uid == resource.data.authorId;

      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null
                      && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.verified == true;
        allow update, delete: if request.auth.uid == resource.data.authorId;
      }
    }

    // 인증 기록은 본인 + 관리자만
    match /verifications/{verifId} {
      allow read: if request.auth.uid == resource.data.userId
                  || isAdmin(request.auth.uid);
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if isAdmin(request.auth.uid);
    }

    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
    }
  }
}
```

---

## 8. 인증 흐름

### 8.1 회원가입·로그인 (Firebase Auth)

지원 방식:
- **Google 로그인** (`signInWithPopup` with `GoogleAuthProvider`)
- **이메일/비밀번호** (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`)

회원가입 시 Firestore `users/{uid}` 문서 자동 생성 (role: 'visitor', verified: false).

### 8.2 학교 인증 흐름 (AI 인증)

```
[1] /verify 페이지 진입
    ↓
[2] 신분 선택: 재학생 / 졸업생 / 학부모 / 교직원
    ↓
[3] 학교 검색·선택
    ↓
[4] 필요 문서 안내 (신분별)
    ↓
[5] 사진 업로드 → Firebase Storage 임시 저장
    ↓
[6] Cloud Function `verifyDocument` 호출
    │   ├─ 네이버 클로바 OCR로 텍스트 추출
    │   ├─ 학교명 매칭 (Firestore schools)
    │   ├─ 졸업/재학 연도 파싱
    │   └─ 신뢰도 점수 산출
    ↓
[7] 분기 처리
    │   ├─ 95%+: 자동 승인 → users.verified=true, verifiedSchoolIds 추가, 배지 발급
    │   ├─ 70~95%: 운영자 수동 검수 큐로
    │   └─ 70% 미만: 재업로드 안내
    ↓
[8] 업로드 사진 즉시 폐기 (Cloud Function이 Storage에서 삭제)
    ↓
[9] 사용자에게 결과 알림 (이메일 또는 실시간)
```

### 8.3 신분별 필요 문서

| 신분 | 1차 문서 | 2차 문서(선택) |
|---|---|---|
| 재학생 | 학생증 (학교명·이름 보이게) | 재학증명서 |
| 졸업생 | 졸업증명서 | 생활기록부 일부 |
| 학부모 | 자녀 학생증 또는 재학증명서 | 가족관계증명서 (자녀 이름만 노출) |
| 교직원 | 재직증명서 | — (수동 검수만) |

### 8.4 개인정보 처리 원칙 (필수 명문화)

- 업로드 사진은 Storage에 암호화 저장
- OCR 처리 후 **7일 이내 자동 삭제** (Cloud Function 스케줄)
- 추출 데이터만 보관: 학교명, 신분, 연도
- 이름·학번·주민번호는 **저장 안 함** (OCR 결과에서 제거 후 폐기)
- 개인정보처리방침에 위 내용 명시 (푸터 링크)

---

## 9. 페이지별 상세 명세

### 9.1 `/` 랜딩

- 헤더: 로고(펀제주) + 메뉴(가이드 / 학교 / 커뮤니티 / 제주 / 로그인)
- 히어로: "한국 IB 학부모와 학생을 위한 신뢰의 정보 허브"
- 섹션:
  - 학교 검색 진입 (`/explore` 큰 카드)
  - 가이드 진입 (`/guide` 카드)
  - 제주 IB 허브 (`/jeju` 카드)
  - 최근 인기 게시글 (3개)
  - 펀제주 공지 (최근 2건)
- 푸터: 법인 정보 + 개인정보처리방침 + 청소년보호책임자

### 9.2 `/school/[id]` 학교 상세

레이아웃: 2열 (메인 + 사이드바)

**상단 헤더**
- 학교명, 영문명
- 별점 평균 (인증 회원 후기 기준) + 후기 개수
- 단계 배지 + 프로그램 배지 + 학교급
- 주소 / 홈페이지 / 전화

**메인 영역 — 탭형 게시판**
- 탭: 전체 / 후기 / 질문 / 정보 / 모임 / 공지
- 글쓰기 버튼 (비인증 시 → "인증하고 글쓰기" CTA)
- 게시글 리스트:
  - `PostCard`: 배지·작성자·작성시간·제목·본문 일부·반응 카운트
  - **비인증 방문자**에게는 본문 1~2줄만 보이고 흐림 처리 + "전체 보기는 인증 필요"

**사이드바 (제주 학교일 때만 표시)**
- 📍 학교 기본 정보 카드
- 🏠 인근 매물 (`listings` where `nearSchoolIds` contains schoolId, 최신 5건)
- 📰 관련 뉴스 (`news_items` where `schoolIds` contains schoolId, 최신 5건)
- 🍴 주변 맛집 (`places` where `nearSchoolIds` contains schoolId, 최신 5건)

### 9.3 `/community` 통합 피드

- 전국 모든 학교의 최신 게시글 통합
- 필터: 학교 / 게시글 타입 / 지역
- 정렬: 최신 / 인기 / 미해결 질문

### 9.4 `/jeju` 제주 허브

- 영교도·표선·성산 권역별 카드
- 제주 IB 학교 22개 빠른 진입
- 최신 매물 5건
- 최신 뉴스 5건
- 추천 맛집·생활 정보 6건
- 펀제주 제주 공지

### 9.5 `/verify` AI 인증

- 단계별 UI (Step 1: 신분 선택 → Step 2: 학교 선택 → Step 3: 업로드 → Step 4: 결과)
- 업로드 가이드라인 (이름 가림 처리 등)
- 결과 페이지: 자동승인/수동검수/재업로드 분기 메시지
- 개인정보 폐기 정책 명시

### 9.6 `/me` 마이페이지

- 내 배지 + 인증 학교
- 내가 쓴 게시글·댓글
- 북마크
- 알림 설정
- 추가 학교 인증 (전학·복수 학교)

### 9.7 `/auth/login`, `/auth/signup`

- Google 로그인 버튼 (1순위)
- 이메일/비밀번호 입력 (2순위)
- 약관 동의 (회원가입 시)

### 9.8 `/notice` 펀제주 공지

- 펀제주 운영진이 직접 작성하는 공식 공지 목록
- 출처: "펀제주" 명시
- Markdown 렌더링

---

## 10. 환경 변수 (`.env.local`)

```bash
# Firebase 클라이언트
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (서버 전용)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# 네이버 클로바 OCR
CLOVA_OCR_URL=
CLOVA_OCR_SECRET=

# 카카오맵
NEXT_PUBLIC_KAKAO_MAP_KEY=

# 사이트
NEXT_PUBLIC_SITE_URL=https://fundjeju.com
```

`.env.local.example`을 만들어 위 키들을 빈 값으로 두고 커밋.

---

## 11. Phase별 작업 체크리스트

### ✅ Phase 1 — 백본 + 정적 자산 통합 (우선 작업)

작업 순서대로:

- [ ] **1-1. 기존 파일 이동 (콘텐츠 수정 절대 금지)**
  - [ ] 루트의 68개 HTML을 `public/legacy/guide/` 하위로 이동
  - [ ] MYP 페이지 8개 → `public/legacy/guide/myp/` (myp_index.html → index.html로 rename)
  - [ ] PYP 페이지 8개 → `public/legacy/guide/pyp/`
  - [ ] `docs/*.html` (MYP) → `public/legacy/guide/docs/myp/`
  - [ ] `docs/pyp/*.html` → `public/legacy/guide/docs/pyp/`
  - [ ] `style.css` → `public/legacy/style.css`
  - [ ] 학교 검색기 단일 HTML → `public/legacy/explore/index.html`
  - [ ] HTML 안의 상대경로 링크가 깨지지 않는지 확인 (필요시 `<base href>` 추가 검토하되 원본 수정은 마지막 수단)

- [ ] **1-2. 빌드 스크립트 격리**
  - [ ] 18개 Node 스크립트를 `legacy-scripts/`로 이동
  - [ ] `legacy-scripts/README.md` 추가:
    > "이 폴더의 스크립트는 더 이상 실행하지 않습니다.
    > 과거 정적 사이트 빌드용으로 참고만 보관합니다."

- [ ] **1-3. Next.js 프로젝트 초기화**
  - [ ] `npx create-next-app@latest` (TypeScript, Tailwind, App Router)
  - [ ] shadcn/ui 초기화 (`npx shadcn-ui@latest init`)
  - [ ] Pretendard 폰트 설정 (`app/layout.tsx`)
  - [ ] `globals.css`에 6.1 색상 토큰 적용
  - [ ] `next.config.js`에 rewrites 추가 (섹션 5 참조)

- [ ] **1-4. Firebase 셋업**
  - [ ] Firebase 콘솔에서 프로젝트 생성
  - [ ] Firestore, Authentication, Storage 활성화
  - [ ] Auth: Google + Email/Password 활성화
  - [ ] `lib/firebase/client.ts`, `lib/firebase/admin.ts` 작성
  - [ ] `firebase.json`, `firestore.rules`, `storage.rules` 작성
  - [ ] `.env.local.example` 생성

- [ ] **1-5. 학교 데이터 시드**
  - [ ] `data/schools.ts`에 기존 430교 데이터 import
  - [ ] 시드 스크립트 작성 (`scripts/seed-schools.ts`)
  - [ ] Firestore `schools` 컬렉션에 일괄 업로드

- [ ] **1-6. 공통 레이아웃**
  - [ ] `app/layout.tsx`: Pretendard + 토큰 적용
  - [ ] `components/shared/Header.tsx`: 로고 + 메뉴
  - [ ] `components/shared/Footer.tsx`: 법인 펀제주 정보 + 정책 링크

- [ ] **1-7. 랜딩 + 학교 상세 (placeholder)**
  - [ ] `/` 랜딩 페이지 (섹션 9.1)
  - [ ] `/school/[id]` 학교 상세 (게시판은 "준비 중" placeholder, 사이드바 위젯도 placeholder)
  - [ ] `/notice` 공지 페이지 (빈 상태)

- [ ] **1-8. 라우팅 검증**
  - [ ] `/guide`, `/guide/myp/bigpic` 등 정적 페이지 정상 동작
  - [ ] `/explore` 학교 검색기 정상 동작
  - [ ] 새 페이지 `/`, `/school/[id]` 정상 동작
  - [ ] 모바일 반응형 확인

- [ ] **1-9. Vercel 배포**
  - [ ] GitHub repo 연결
  - [ ] 환경 변수 설정
  - [ ] 도메인 연결 (fundjeju.com 또는 임시 vercel 도메인)

### Phase 2 — 인증 + 커뮤니티 (Phase 1 완료 후 별도 지시)

요약만:
- Firebase Auth (Google + Email) 구현
- `/auth/login`, `/auth/signup`, `/me`
- AI 인증 시스템 (`/verify` + Cloud Function + 클로바 OCR)
- 학교 상세에 실제 게시판 구현 (post types 6개)
- 게시글·댓글·반응
- 신고/모더레이션 어드민

### Phase 3 — 제주 버티컬 (Phase 2 완료 후 별도 지시)

요약만:
- 부동산 매물 시스템 + 중개사 어드민
- 뉴스 RSS 자동 수집 + 큐레이션 어드민
- 맛집·생활 정보 (운영자 직접 입력)
- 제주 허브 페이지 통합
- 학교 상세 사이드바 위젯 실제 데이터 연결

---

## 12. 첫 작업 시작 시 Claude Code에게 주는 명령

다음 명령을 받으면 Phase 1을 시작하세요:

> "Phase 1을 시작합니다. PROJECT_SPEC.md의 절대 규칙(섹션 1)을 다시 확인하고,
> 11번 체크리스트의 1-1부터 1-9까지 순서대로 진행하세요.
> 각 단계 끝에 변경 사항 요약과 다음 단계 진행 여부 확인을 요청하세요.
> 기존 HTML 파일과 빌드 스크립트는 절대 내용 수정하지 마세요."

---

## 13. 자주 묻는 함정 (Claude Code가 빠지기 쉬운 실수)

- ❌ "기존 빌드 스크립트도 정리하면서 함께 리팩토링하겠다"
  → 절대 금지. 격리만.
- ❌ "Supabase로 가는 게 더 깔끔하지 않을까요?"
  → 거절. Firebase 확정.
- ❌ "기존 코랄 디자인을 새 앱에도 적용하겠다"
  → 거절. 새 앱은 딥그린 토큰.
- ❌ "OCR을 Google Cloud Vision으로 대체"
  → 거절. 네이버 클로바 OCR (한국 공문서 정확도).
- ❌ "Phase 1과 Phase 2를 한 번에 진행"
  → 거절. 반드시 Phase 1 검증 후 다음 Phase.
- ❌ "기존 HTML 파일에 새 헤더를 주입"
  → 거절. 원본 보존, 필요하면 prefix 라우트(`/guide/*`)로 분리만.

---

## 14. 산출물 기대치 (Phase 1 완료 시점)

다음이 동작해야 합니다:

1. ✅ 기존 가이드 사이트 `/guide/*` 모든 경로 정상
2. ✅ 기존 학교 검색기 `/explore` 정상
3. ✅ 새 랜딩 `/` 정상 (펀제주 브랜드, 메뉴 5개)
4. ✅ 학교 상세 `/school/[id]` 정상 (430교 데이터에서 가져옴, 게시판은 placeholder)
5. ✅ 펀제주 공지 페이지 `/notice` 정상 (빈 상태 OK)
6. ✅ Vercel에서 빌드·배포 성공
7. ✅ Firebase 프로젝트 연결 + Firestore에 schools 컬렉션 시드 완료
8. ✅ 모바일·데스크탑 반응형

이 상태가 되면 Phase 2 (인증·커뮤니티) 진입 가능합니다.

---

## 15. 마무리

이 문서가 모호하거나 결정이 필요한 부분이 나오면 **임의로 결정하지 말고 질문**해주세요.

특히 다음은 운영자 결정 사항입니다:
- 도메인 이름 (fundjeju.com 등)
- 법인 정보(사업자번호, 책임편집자명)
- 약관·개인정보처리방침 본문
- 모더레이션 정책 디테일

**시작합니다. 화이팅!**
