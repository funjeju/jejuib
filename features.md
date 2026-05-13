# IB 학부모 가이드 - 기능 및 콘텐츠

## 📌 프로젝트 목적
IB(국제바칼로레아) 교육 과정을 자녀가 받는 학부모들을 위한 한글 안내 사이트

---

## 🎯 주요 섹션

### MYP (Middle Years Programme) 학부모 가이드
- **큰 그림**: MYP 개요 및 특징
- **수업 진행**: 단원 구조 및 수업 방식
- **1년 흐름**: 연간 학사일정 및 이정표
- **개념 사전**: IB의 핵심 개념 설명
- **평가**: 평가 방식 및 루브릭 이해
- **양식**: 학부모용 참고 문서 및 체크리스트
- **자녀와 대화**: 학부모가 물어볼 수 있는 질문들
- **용어 사전**: IB 용어 검색 기능 포함

### PYP (Primary Years Programme) 학부모 가이드
- 초등 과정 특화 문서들 (30개)
- 단원별 학습 일지, 성찰, 포트폴리오 관련 양식

---

## ⚙️ 기능

| 기능 | 위치 | 상세 |
|------|------|------|
| 용어 검색 | glossary.html | 한글/영어 검색 가능 |
| 용어 모달 팝업 | glossary_ui.js | 용어 클릭 시 상세 설명 + 관련 페이지 표시 |
| 양식 인라인 미리보기 | forms.html | iframe으로 양식 문서 미리보기 |
| 내비게이션 | 모든 페이지 | 섹션 간 이동 |
| SEO 최적화 | 모든 페이지 | 한국어 메타데이터 포함 |
| 반응형 디자인 | style.css | 모바일/태블릿 대응 |

---

## 📁 현재 파일 구조

```
/ib (루트)
├── 📄 HTML 페이지 (메인 가이드)
│   ├── index.html (전체 통합 대문)
│   ├── myp_index.html (MYP 홈)
│   ├── bigpic.html (MYP - 큰 그림)
│   ├── cycle.html (MYP - 수업 진행)
│   ├── timeline.html (MYP - 1년 흐름)
│   ├── concepts.html (MYP - 개념 사전)
│   ├── evaluation.html (MYP - 평가)
│   ├── forms.html (MYP - 양식)
│   ├── parent.html (MYP - 자녀와 대화)
│   ├── glossary.html (MYP - 용어 사전)
│   ├── pyp_index.html (PYP 홈)
│   ├── pyp_bigpic.html ~ pyp_glossary.html (PYP 8개 페이지)
│   └── schools.html (학교 소개)
│
├── 📁 /docs (MYP 양식 문서 - 30개)
│   ├── 01_learner_profile.html
│   ├── 02_atl_assessment.html
│   ├── 03_goal_setting.html
│   ├── 04_kwl_chart.html
│   ├── 05_task_plan.html
│   ├── 06_learning_journal.html
│   ├── 07_self_assessment.html
│   ├── 08_unit_reflection.html
│   ├── ... (09~30번)
│   └── 30_cp_assessment.html
│
├── 📁 /docs/pyp (PYP 양식 문서 - 30개)
│   ├── 01_learner_treasure_map.html
│   ├── 02_atl_muscle.html
│   ├── 03_class_agreement.html
│   ├── ... (04~30번)
│   └── 30_feedback_board.html
│
├── 🎨 style.css (전체 스타일)
│
├── 🔧 Node.js 빌드 스크립트 (18개 파일)
│   ├── update.js (메인 페이지에 CSS/JS 추가)
│   ├── glossary_data.js (용어 데이터)
│   ├── glossary_ui.js (용어 검색 UI/모달)
│   ├── make_portal.js (포털 자동 생성)
│   ├── add_glossary.js (기존 HTML에 용어 추가)
│   ├── generalize.js (일반화 처리)
│   ├── split_site.js (MYP/PYP 사이트 분할)
│   ├── init_pyp.js (PYP 초기화)
│   ├── update_pyp_cycle.js
│   ├── update_pyp_timeline.js
│   ├── update_pyp_concepts.js
│   ├── update_pyp_eval.js
│   ├── update_pyp_forms_iframe.js
│   ├── seo_and_ib_intro.js (SEO 메타데이터)
│   ├── deep_seo_and_layout.js
│   ├── blog_seo.js
│   ├── fix_pyp_nav.js (네비게이션 수정)
│   └── update_pyp_parent_forms.js
│
├── 📦 package.json
├── 📚 node_modules (jsdom 라이브러리)
└── 📝 (백업) ib_myp_parent_guide.html.bak

```

---

## 🔄 시스템 동작 방식

### 1️⃣ **데이터 기반 구조**
- `glossary_data.js`: 모든 IB 용어를 객체 배열로 저장
  - `term` (용어), `en` (영어), `def` (정의), `pages` (사용된 페이지)
  - 예: `{ term: "IBO", en: "International Baccalaureate Organization", ... }`

### 2️⃣ **HTML 생성 및 업데이트 파이프라인**
```
Node.js 스크립트 실행
  ↓
기존 HTML 파일 읽기 (fs.readFileSync)
  ↓
CSS/JS 코드 주입 또는 메타데이터 추가
  ↓
수정된 HTML 파일 저장 (fs.writeFileSync)
  ↓
브라우저에서 즉시 반영
```

### 3️⃣ **주요 스크립트별 역할**

| 스크립트 | 역할 | 입력 | 출력 |
|---------|------|-----|------|
| `update.js` | 양식 미리보기 기능 주입 | ib_myp_parent_guide.html | CSS + JS 스타일/상호작용 추가 |
| `glossary_ui.js` | 용어 검색 UI & 모달 | glossary.html | 검색바 + 모달 팝업 기능 |
| `glossary_data.js` | 용어 데이터 저장소 | (수동 작성) | 검색 & 모달에 필요한 데이터 |
| `seo_and_ib_intro.js` | SEO 메타데이터 | HTML 파일 | title, description, keywords 추가 |
| `split_site.js` | MYP/PYP 분리 | 통합 HTML | MYP 폴더, PYP 폴더 생성 |
| `update_pyp_*.js` | PYP 특화 콘텐츠 | PYP HTML | 개념, 타임라인, 평가 등 업데이트 |

---

## 🎨 프론트엔드 구현

### HTML 구조
- **공통 네비게이션**: 모든 페이지 상단에 일관된 네비게이션 바
- **섹션 타입별 레이아웃**:
  - 큰 그림 / 수업 진행 / 1년 흐름: 콘텐츠 + 예시
  - 개념 사전: 표 형식
  - 평가: 루브릭 설명
  - 양식: iframe으로 PDF/HTML 문서 임베드
  - 용어: 검색바 + 정렬된 목록

### CSS 설계
- **색상 변수**: `--coral`, `--coral-dark`, `--coral-pale` 등
- **반응형**: max-width 640px 브레이크포인트
- **폰트**: Pretendard (Google CDN)
- **인터랙션**: 호버 효과, 모달, 팝업

### JavaScript 기능
1. **검색 기능** (glossary.html)
   - 실시간 한글/영어 검색
   - 일치 항목 필터링 & 강조

2. **용어 모달**
   - 클릭 시 팝업 열기
   - 용어 정의 표시
   - 관련 페이지 링크 표시

3. **양식 미리보기**
   - data-form 속성으로 문서 경로 지정
   - 클릭 시 iframe으로 로드
   - active 클래스로 열기/닫기 상태 관리

---

## 📊 콘텐츠 현황

### MYP 문서 (30개)
```
학습자 역량 관련: 01-07 (학습자 프로필, ATL, 목표 설정, KWL, 과제 계획, 학습일지, 자기평가)
단원 관련: 08-10 (단원 성찰, 학습 과정일지, 학문적 정직성)
전문 활동: 11-16 (사전 탐구, 연구 노트, 진행도 체크리스트, 협력 로그, 과제 명확화, 동료 평가)
종합 프로젝트: 17-30 (IDU 성찰, 봉사 활동 제안/로그/성찰, ATL 추적, 포트폴리오, 교사 피드백, 학부모 피드백, CP 제안/일지/보고서/평가)
```

### PYP 문서 (30개)
- 유사한 구조: 학습자 특성, 탐구 과정, 성찰, 포트폴리오, 전시회 관련

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|-----|------|
| 마크업 | HTML5 |
| 스타일 | CSS3 (변수, 반응형) |
| 상호작용 | Vanilla JavaScript (jQuery 없음) |
| 빌드/자동화 | Node.js + fs (파일 시스템) |
| DOM 조작 | jsdom (Node.js 환경에서 HTML 파싱) |
| 폰트 | Pretendard (CDN) |
| 배포 | Static HTML (서버 필요 없음) |

---

## 💡 현재 시스템의 장점
- ✅ 정적 HTML이므로 빠르고 배포 간단
- ✅ 모든 데이터가 파일 기반이므로 버전 관리 용이
- ✅ Node.js 스크립트로 자동화하여 반복 작업 최소화
- ✅ 검색 & 용어 모달로 사용자 경험 향상

---

## ⚠️ 현재 시스템의 문제점
- ❌ 68개 HTML 파일이 모두 하드코딩되어 있음
- ❌ 새로운 양식 추가 시 HTML 파일을 직접 생성해야 함
- ❌ 콘텐츠 수정 시 여러 스크립트를 순서대로 실행해야 함
- ❌ 양식 목록이 하드코딩되어 있어 관리 어려움
- ❌ 메타데이터(SEO, 제목, 설명)가 파일에 분산되어 있음
