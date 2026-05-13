const fs = require('fs');

const userSnippet = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IB PYP 용어 사전 · 학부모용 (MYP로 가는 토대)</title>
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
<style>
:root {
  --coral: #E07856;
  --coral-dark: #B85A3D;
  --coral-light: #FCE4DC;
  --coral-pale: #FFF4EF;
  --bg: #FFFBF8;
  --surface: #FFFFFF;
  --text: #2C2522;
  --text-soft: #5C5048;
  --muted: #9A8D85;
  --line: #EFE5DD;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.75;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

.container { max-width: 880px; margin: 0 auto; padding: 60px 32px; }

.page-header { margin-bottom: 32px; }
.page-header .section-num {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--coral-dark);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 5px 12px;
  background: var(--coral-pale);
  border-radius: 100px;
}
.page-header .pyp-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 3px 10px;
  background: var(--coral);
  color: white;
  border-radius: 100px;
  font-size: 11px;
  letter-spacing: 0.05em;
}
.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin-bottom: 14px;
}
.page-header .sub {
  font-size: 16px;
  color: var(--text-soft);
  line-height: 1.7;
  max-width: 720px;
}
.page-header .sub strong { color: var(--coral-dark); font-weight: 600; }

.intro-box {
  margin-bottom: 28px;
  padding: 18px 22px;
  background: var(--coral-pale);
  border-left: 4px solid var(--coral);
  border-radius: 0 12px 12px 0;
  font-size: 14.5px;
  color: var(--text-soft);
  line-height: 1.75;
}
.intro-box strong { color: var(--coral-dark); font-weight: 600; }
.intro-box .intro-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--coral-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.glossary-search {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  margin-bottom: 24px;
  background: var(--surface);
  outline: none;
  transition: border-color 0.2s;
}
.glossary-search:focus { border-color: var(--coral); }

.glossary { margin-top: 12px; }
.gloss-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.gloss-item:last-child { border-bottom: none; }
.gloss-term {
  font-size: 15.5px;
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}
.gloss-term .en {
  font-size: 13px;
  color: var(--muted);
  font-weight: 400;
  margin-left: 4px;
}
.gloss-term .star {
  color: var(--coral-dark);
  font-weight: 700;
  font-size: 14px;
}
.gloss-def {
  font-size: 14.5px;
  color: var(--text-soft);
  line-height: 1.65;
  margin-bottom: 6px;
}
.gloss-def .myp-connect {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--coral-dark);
}
.gloss-def .myp-connect::before {
  content: '→ MYP 연결: ';
  font-weight: 600;
}
.gloss-pages {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.gloss-pages .label {
  font-size: 11px;
  color: var(--muted);
  margin-right: 2px;
  align-self: center;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.gloss-pages a {
  font-size: 12px;
  padding: 3px 9px;
  background: var(--coral-pale);
  color: var(--coral-dark);
  text-decoration: none;
  border-radius: 100px;
  border: 1px solid var(--coral-light);
  transition: all 0.15s;
}
.gloss-pages a:hover {
  background: var(--coral);
  color: white;
  border-color: var(--coral);
}

.no-result {
  padding: 40px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 14.5px;
  display: none;
}

.forms-legend {
  margin-top: 36px;
  padding: 22px 26px;
  background: var(--coral-pale);
  border-left: 3px solid var(--coral);
  border-radius: 0 12px 12px 0;
  font-size: 14px;
  color: var(--text-soft);
  line-height: 1.8;
}
.forms-legend strong { color: var(--coral-dark); font-weight: 600; }

@media (max-width: 640px) {
  .container { padding: 36px 18px; }
  .page-header h1 { font-size: 26px; }
}
</style>
</head>
<body>
<div class="container">

  <div class="page-header">
    <span class="section-num">학부모용 용어 사전 <span class="pyp-badge">PYP</span></span>
    <h1>PYP 용어 사전 — IB 교육의 가장 기초가 되는 말들</h1>
    <p class="sub">PYP에서 큰 개념을 잡으면 MYP·DP가 자연스럽게 따라옵니다. <strong>핵심 아이디어(CI) → 탐구 진술문(SoI)</strong>, <strong>7대 핵심 개념 → 16개 주요 개념</strong>, <strong>실천(Action) → 봉사(Service as Action) → CAS</strong>처럼, PYP가 토대를 만들고 MYP·DP가 그 위에 정교함을 더하는 구조입니다. <strong style="color: var(--coral-dark);">★ 표시</strong>는 학교 가정통신문이나 상담에서 자주 등장하는 PYP의 시그니처 용어예요.</p>
  </div>

  <div class="intro-box">
    <div class="intro-title">📐 PYP 핵심 구조 한눈에</div>
    학교 전체 <strong>탐구 프로그램(POI)</strong>은 <strong>6개 초학문 주제 × 6학년</strong> = 36개 단원으로 짜여요. 각 학년에서 <strong>탐구 단원(UOI)</strong>이 4~8주씩 진행되고, 단원마다 <strong>핵심 아이디어(CI)</strong>를 중심으로 <strong>3~4개의 탐구 노선(Lines of Inquiry)</strong>이 펼쳐져요. 학생은 <strong>7대 핵심 개념</strong>이라는 사고 도구로 주제를 깊이 들여다보고, 마지막에 <strong>실천(Action)</strong>으로 옮기는 것이 PYP의 한 단원 흐름이에요. 이 흐름이 평생 IB 학습의 사이클이 됩니다.
  </div>

  <input type="text" class="glossary-search" id="glossarySearch" placeholder="용어 검색 (한글 또는 영어)">

  <div class="glossary" id="glossaryList">

    <div class="gloss-item">
      <div class="gloss-term">개념 기반 학습<span class="en">Concept-based Learning</span></div>
      <div class="gloss-def">사실 암기가 아닌 큰 원리(개념)를 이해해 다른 상황에도 적용하게 하는 학습 방식. PYP의 가장 근본적인 교수법이에요.<span class="myp-connect">7대 핵심 개념이 MYP에서 16개 주요 개념으로 더 정교해져요.</span></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">관련 개념<span class="en">Related Concepts</span></div>
      <div class="gloss-def">교과 특성에 맞게 7대 핵심 개념을 더 구체화한 보조 개념. PYP에서는 활용이 적고, MYP에서 교과별로 본격적으로 다뤄져요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">구성주의<span class="en">Constructivism</span></div>
      <div class="gloss-def">학생이 스스로 의미를 만들어가는 학습 철학. PYP는 특히 사회적 구성주의(Vygotsky)에 기반해, 학습이 친구·교사와의 상호작용 속에서 일어난다고 봐요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">국제적 마인드<span class="en">International Mindedness</span></div>
      <div class="gloss-def">자기 정체성을 바탕으로 다른 문화·시각을 존중하며 세계 시민으로 행동하는 자세. IB 교육 전체의 궁극적 목표예요. PYP에서는 6개 초학문 주제를 통해 자연스럽게 키워져요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">메타인지<span class="en">Metacognition</span></div>
      <div class="gloss-def">"내가 어떻게 생각하는지를 생각하는" 능력. 자기 학습을 객관적으로 보고 조절하는 힘. PYP의 성찰 활동에서 시작해 평생 갈 사고력이 돼요.<span class="myp-connect">MYP·DP에서도 모든 평가의 핵심 자질로 다뤄져요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">모국어<span class="en">Mother Tongue</span></div>
      <div class="gloss-def">학생이 가정에서 사용하는 첫 번째 언어. PYP는 모국어 유지·발전을 매우 중시해, 학습 언어 외에도 모국어 시간을 운영하는 학교가 많아요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">모둠 활동<span class="en">Collaboration</span></div>
      <div class="gloss-def">친구들과 함께 탐구하고 결과물을 만드는 활동. PYP 사회성 ATL의 핵심으로, 어릴 때부터 협력하는 습관을 길러요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">백워드 설계<span class="en">Backward Design</span></div>
      <div class="gloss-def">단원 끝의 핵심 아이디어와 평가부터 정한 뒤 거꾸로 수업을 짜는 방식. PYP 단원 설계의 원리예요.<span class="myp-connect">MYP·DP 단원 설계도 동일한 원리로 운영돼요.</span></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">보여요-생각돼요-궁금해요<span class="en">See–Think–Wonder</span></div>
      <div class="gloss-def">사진·실물·작품을 볼 때 "보이는 것 → 생각되는 것 → 궁금한 것" 순서로 사고하는 루틴. 하버드 Project Zero의 Visible Thinking 도구로, PYP 교실에서 가장 자주 쓰여요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">성찰<span class="en">Reflection</span></div>
      <div class="gloss-def">내가 한 일을 돌아보고 다음을 계획하는 행위. 탐구 → 행동 → 성찰 사이클의 마무리이자 다음 시작이에요.<span class="myp-connect">PYP에서 길러진 성찰 습관이 MYP의 단원 성찰일지, DP의 TOK(지식론)로 자라요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">실천 / 행동 <span class="star">★</span><span class="en">Action</span></div>
      <div class="gloss-def">탐구의 결과로 무엇을 할 것인가. PYP가 키우려는 가장 큰 결과로, 작은 가정 실천부터 사회적 행동까지 모두 포함돼요. "배우는 사람"에서 "행동하는 사람"으로의 전환이 PYP의 본질이에요.<span class="myp-connect">MYP에서는 실천적 봉사(SA, Service as Action)로 체계화되고, DP에서는 CAS(창의·활동·봉사)로 발전해요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">안내 교사 (전담 교사)<span class="en">Specialist Teachers</span></div>
      <div class="gloss-def">음악·체육·미술·외국어 등 특정 영역을 담당하는 전담 교사. 담임과 협력해 UOI와 연결된 수업을 제공해요. 한국 공교육의 전담 교사와 비슷하지만, PYP에서는 단원 주제와 더 긴밀하게 연결돼요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">우리 반 약속 <span class="star">★</span><span class="en">Essential Agreements</span></div>
      <div class="gloss-def">선생님이 정한 규칙이 아니라 학급 구성원이 함께 토론해 만든 약속. PYP의 시그니처 학급 운영 방식으로, 자녀가 학교에서 처음 경험하는 민주주의예요. 학년 초마다 새로 만들어요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">원더 월<span class="en">Wonder Wall</span></div>
      <div class="gloss-def">단원 시작 때 학생들의 진짜 궁금증을 모아두는 게시판. "학습은 학생의 질문에서 시작된다"는 PYP 정신의 상징이에요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">자기 평가<span class="en">Self-assessment</span></div>
      <div class="gloss-def">내가 한 작품·과제를 내가 직접 평가하는 활동. PYP는 어릴 때부터 자기를 객관적으로 보는 습관을 길러요.<span class="myp-connect">MYP의 자기평가 루브릭, DP의 자기 점검 능력의 토대.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">자기효능감<span class="en">Self-efficacy</span></div>
      <div class="gloss-def">"나는 할 수 있다"는 믿음. 심리학자 Albert Bandura가 정립한 개념으로, PYP의 학습자 주도성(Agency)을 떠받치는 토대예요. PYP는 자기효능감을 키우기 위해 작은 성공 경험을 의도적으로 설계해요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">전시회 <span class="star">★</span><span class="en">Exhibition (PYPX)</span></div>
      <div class="gloss-def">PYP 마지막 학년(보통 5학년 또는 6학년)에 8~10주간 진행하는 졸업 프로젝트. 학생들이 사회 문제를 직접 골라 조사·계획·행동·발표회까지 진행해요. PYP 6년 학습의 종합 평가이자 IB 학습자로 졸업하는 자리예요.<span class="myp-connect">MYP의 공동체 프로젝트(중3)와 개인 프로젝트(MYP 5), DP의 확장 에세이(EE)로 발전해요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">진정한 평가<span class="en">Authentic Assessment</span></div>
      <div class="gloss-def">시험이 아닌 실제 상황에서 능력을 보여주는 평가. 발표·작품·인터뷰·실험·실천 등 다양한 형태로 진행돼요. PYP 평가의 기본 정신이에요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">초학문 주제 <span class="star">★</span><span class="en">Transdisciplinary Themes (6가지)</span></div>
      <div class="gloss-def">PYP가 1년 학습을 묶는 6개 큰 주제: ① 우리는 누구인가 ② 우리가 사는 곳과 시간 ③ 우리는 어떻게 표현하는가 ④ 세상은 어떻게 작동하는가 ⑤ 우리는 어떻게 조직되는가 ⑥ 지구를 공유하기. <strong>2024년 12월 IBO가 디스크립터를 개정</strong>해 "인간 공통 경험"에서 "인간과 자연의 균형"으로 시각을 넓혔어요 (2027년 9월까지 모든 학교 전면 적용).</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">초학문적 <span class="star">★</span><span class="en">Transdisciplinary</span></div>
      <div class="gloss-def">교과의 경계를 넘어 하나의 큰 주제 아래에서 통합적으로 학습하는 방식. PYP의 가장 본질적인 특징이에요. 국어·수학·과학을 따로 배우는 게 아니라 "지구를 공유하기"라는 주제 아래에서 모든 교과가 협력하는 모양이에요.<span class="myp-connect">MYP에서는 좀 더 부드러운 간학문적(Interdisciplinary)으로, DP에서는 다시 교과별 학습으로 단계적으로 분리돼요.</span></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">총괄 평가<span class="en">Summative Assessment</span></div>
      <div class="gloss-def">단원이 끝났을 때 학생이 핵심 아이디어를 이해했는지 보여주는 최종 평가. 시험이 아닌 결과물(작품·발표·실천)로 진행돼요.<span class="myp-connect">MYP의 수행과제, DP의 외부 평가로 이어집니다.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">7대 핵심 개념 <span class="star">★</span><span class="en">7 Key Concepts</span></div>
      <div class="gloss-def">어떤 주제든 깊이 탐구할 수 있는 7가지 사고 도구: <strong>형태(Form)·기능(Function)·원인(Causation)·변화(Change)·연결(Connection)·관점(Perspective)·책임(Responsibility)</strong>. 평생 어떤 분야에서도 적용되는 사고법이에요.<span class="myp-connect">MYP에서 16개 주요 개념(Key Concepts)으로 확장돼요. 이 7개를 잘 잡으면 MYP의 16개가 자연스럽게 따라옵니다.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">탐구<span class="en">Inquiry</span></div>
      <div class="gloss-def">"궁금한 것을 직접 알아보는" 학습 방식. PYP의 가장 근본적인 교수법으로, 호기심 → 조사 → 이해 → 행동의 흐름이에요. 어른이 답을 주지 않고 학생이 답을 찾아가게 해요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">탐구 노선<span class="en">Lines of Inquiry</span></div>
      <div class="gloss-def">하나의 핵심 아이디어(CI)를 3~4개의 작은 주제로 나눈 세부 탐구 영역. 단원 4~8주를 구조화하는 도구예요. 보통 형태(form)·기능(function)·원인(causation) 같은 핵심 개념을 한 줄씩 다뤄요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">탐구 단원 <span class="star">★</span><span class="en">Unit of Inquiry (UOI)</span></div>
      <div class="gloss-def">PYP의 학습 단위. 4~8주 동안 하나의 핵심 아이디어(CI)를 중심으로 깊이 탐구해요. 한 해에 보통 6개 UOI를 진행해요 (초기 유아 단계는 4~5개).<span class="myp-connect">MYP에서는 단원(Unit)으로 자연스럽게 이어지지만, 교과별로 분리되는 변화가 있어요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">탐구 사이클<span class="en">Inquiry – Action – Reflection Cycle</span></div>
      <div class="gloss-def">탐구(Inquiry) → 행동(Action) → 성찰(Reflection)의 순환. PYP 학습의 흐름을 만드는 기본 사이클로, 평생 학습의 토대가 돼요. 한 단원이 끝나도 사이클은 다음 단원에서 다시 시작돼요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">탐구 프로그램 <span class="star">★</span><span class="en">Programme of Inquiry (POI)</span></div>
      <div class="gloss-def">한 학교의 모든 학년 UOI를 한 표에 모은 전체 학교 탐구 지도. <strong>수평으로 6학년 × 수직으로 6 초학문 주제 = 36개 단원</strong> 구조예요. 학교가 학부모에게 공개해, 어떤 학년에서 어떤 주제로 어떤 단원이 진행되는지 미리 알 수 있어요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">포트폴리오<span class="en">Portfolio</span></div>
      <div class="gloss-def">1년 동안 학생이 만든 작품·성찰·평가의 모음. 종이 또는 디지털(e-Portfolio) 형태. PYP 평가의 핵심 자료로, 학기·학년 말에 학부모와 공유해요.<span class="myp-connect">MYP에서도 포트폴리오를 운영하며, DP 일부 교과에서는 평가물 자체가 포트폴리오 형태예요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">프로그램 기준<span class="en">Programme Standards and Practices (PSP)</span></div>
      <div class="gloss-def">IBO가 정한 PYP 학교가 지켜야 할 기준 모음. 학교의 PYP 인증·재인증의 기준이에요. 학부모는 직접 다루지 않지만, 학교 운영의 깊이를 가늠하는 잣대예요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">프로세스 저널<span class="en">Process Journal</span></div>
      <div class="gloss-def">탐구나 프로젝트의 과정(아이디어·시도·실패·발견)을 날짜별로 기록하는 일지. 결과보다 과정을 중시하는 PYP 평가의 핵심 자료예요. Exhibition에서 가장 중요한 평가 자료가 돼요.<span class="myp-connect">MYP·DP의 디자인·예술 교과에서 동일한 형식으로 계속 사용돼요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">학생 주도 컨퍼런스<span class="en">Student-Led Conference (SLC)</span></div>
      <div class="gloss-def">일반 학부모 상담과 달리, 학생이 직접 부모님께 자기 학습을 발표하는 자리. 교사는 동석하지 않거나 보조 역할만 해요. PYP만의 특별한 소통 양식.<span class="myp-connect">MYP·DP에서도 학생 주도 컨퍼런스가 이어집니다.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">학습 공동체<span class="en">Learning Community</span></div>
      <div class="gloss-def">학생·교사·학부모·지역사회가 함께 학습을 만들어가는 공동체. PYP의 3개 기둥(① 학습자 ② 학습과 교수 ③ 학습 공동체) 중 하나예요. 학부모가 공동체의 일원이라는 정신이 PYP 운영의 토대.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">학습법 <span class="star">★</span><span class="en">Approaches to Learning (ATL)</span></div>
      <div class="gloss-def">"공부하는 법 그 자체"를 가르치는 5가지 영역: <strong>사고하기(Thinking)·조사하기(Research)·소통하기(Communication)·사이좋게 지내기(Social)·자기 관리하기(Self-management)</strong>. 교과 내용과 별개로 의도적으로 길러요.<span class="myp-connect">MYP·DP에서도 동일한 5범주를 사용해요. PYP에서 ATL을 잘 잡으면 평생 학습의 토대가 갖춰져요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">학습자상 <span class="star">★</span><span class="en">Learner Profile (10 attributes)</span></div>
      <div class="gloss-def">IB가 키우려는 10가지 자질: <strong>탐구하는 사람·지식이 풍부한 사람·사고하는 사람·소통하는 사람·원칙을 지키는 사람·열린 마음을 가진 사람·배려하는 사람·도전하는 사람·균형 잡힌 사람·성찰하는 사람</strong>. PYP에서는 학생이 일상에서 이 자질을 발견·실천하는 것을 강조해요.<span class="myp-connect">MYP·DP에서도 동일한 10가지를 유지해요. PYP에서 만든 자기 인식이 평생 가요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">학습자 주도성 <span class="star">★</span><span class="en">Agency</span></div>
      <div class="gloss-def">학생이 자기 학습의 주인이 되는 능력. <strong>발언권(Voice) · 선택권(Choice) · 책임(Ownership)</strong> 3가지로 이뤄져요. PYP가 가장 강조하는 핵심 가치로, 어릴 때부터 "내가 결정하고 책임진다"는 감각을 키워요. Albert Bandura의 사회인지이론에 기반.<span class="myp-connect">MYP·DP에서도 Agency가 그대로 핵심 가치이지만, 학생이 더 큰 결정권을 가져요.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">핵심 아이디어 <span class="star">★</span><span class="en">Central Idea (CI)</span></div>
      <div class="gloss-def">한 탐구 단원(UOI)을 이끄는 큰 원리 한 문장. 단원의 "북극성" 같은 존재예요. 학생이 자기 말로 바꿔 설명할 수 단원. 학생이 자기 말로 바꿔 설명할 수 있을 때 진짜 이해한 거예요. 예: "사람들은 다양한 방법으로 자신을 표현한다."<span class="myp-connect">MYP에서는 탐구 진술문(SoI, Statement of Inquiry)으로 더 정교해져요. PYP의 CI를 잘 따라가는 습관이 MYP의 SoI 이해의 토대.</span></div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">형성 평가<span class="en">Formative Assessment</span></div>
      <div class="gloss-def">단원 진행 중 수시로 이뤄지는 학습 점검. 점수가 아닌 피드백 위주예요. PYP·MYP·DP 공통의 평가 정신.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a></div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">IB 월드스쿨<span class="en">IB World School</span></div>
      <div class="gloss-def">IBO의 엄격한 인증 절차(관심 → 후보 → 인증)를 통과해 공식적으로 IB 프로그램을 운영하는 학교. 2024년 기준 전 세계 약 <strong>2,275개의 PYP 학교</strong>가 운영되고 있어요.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">IB 연속체<span class="en">IB Continuum (PYP → MYP → DP / CP)</span></div>
      <div class="gloss-def">PYP(만 3-12세) → MYP(만 11-16세) → DP(만 16-19세) → CP(만 16-19세 직업 연계)로 이어지는 IB 교육의 연속 흐름. 한 학교가 두 개 이상을 운영하기도 해요. PYP에서 잡은 큰 개념이 평생 IB 학습의 토대가 됩니다.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">IBO<span class="en">International Baccalaureate Organization</span></div>
      <div class="gloss-def">스위스 제네바에 본부를 둔 비영리 교육 재단. 전 세계 IB 학교의 교육과정·평가 표준·인증을 관리해요. 1968년 설립.</div>
    </div>

    <div class="gloss-item">
      <div class="gloss-term">PYP <span class="star">★</span><span class="en">Primary Years Programme</span></div>
      <div class="gloss-def">만 3~12세를 위한 IB 초등 교육 과정. 한국에서는 보통 초등학교 1~6학년에 해당해요. 1997년 처음 도입되어 IB의 3개 학년제 프로그램 중 가장 어린 학생들을 대상으로 합니다. <strong>PYP에서 만들어진 학습 습관·자질·사고법이 평생 IB 학습의 토대</strong>가 돼요.</div>
      <div class="gloss-pages"><span class="label">사용 페이지</span><a href="./pyp_forms/index.html">양식</a><a href="./pyp_parent_talk.html">자녀와 대화</a></div>
    </div>

  </div>

  <div class="no-result" id="noResult">
    🔍 검색하신 용어를 찾을 수 없어요. 다른 단어로 시도해보세요.
  </div>

  <div class="forms-legend">
    <strong>★ 표시 13개 핵심 용어</strong>는 PYP만의 시그니처이자 학교 가정통신문·상담에서 가장 자주 마주칠 용어들이에요. 이 13개만 정확히 알면 PYP의 90%를 이해한 거예요.
    <br><br>
    <strong>MYP로 가는 변화도 함께 표시</strong>했어요. "→ MYP 연결" 부분을 보면, PYP의 어떤 개념이 MYP에서 어떻게 발전하는지 알 수 있어요. 예: <strong>CI → SoI</strong> · <strong>7대 핵심 개념 → 16개 주요 개념</strong> · <strong>Action → Service as Action → CAS</strong> · <strong>Exhibition → 공동체 프로젝트·개인 프로젝트 → 확장 에세이</strong>. 토대가 같으니 PYP를 잘 거치면 MYP가 어렵지 않아요.
    <br><br>
    PYP는 IB 교육 전체의 <strong>철학적 토대</strong>를 만드는 단계예요. 정답 암기가 아닌 "탐구·행동·성찰" 사이클, 점수가 아닌 자질·사고력의 성장, 어른의 지시가 아닌 학습자의 주도성 — 이 세 가지가 PYP에서 시작해 DP까지 이어집니다.
  </div>

</div>

<script>
  // Handled by PYP glossary UI script now
</script>
</body>
</html>
`;

// Build pyp_glossary.html
// Replace colors, inject nav, use style.css, remove inline body css
let html = userSnippet;

const fullNavHtml = `
<nav style="position: sticky; top: 0; background: rgba(255, 251, 248, 0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); z-index: 100;">
  <div style="background:var(--pyp-pale, #FFF7E6); padding:8px 24px; text-align:center; font-size:13px; border-bottom:1px solid var(--line, #EFE5DD);">
    <a href="index.html" style="color:var(--pyp-dark, #D68910); text-decoration:none; font-weight:600; display:inline-block; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">← IB 통합 안내서 대문으로 돌아가기</a>
  </div>
  <div class="nav-inner" style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; height: 60px;">
    <div class="logo"><a href="pyp_index.html" style="color:var(--pyp-dark, #D68910); text-decoration:none; font-weight:700; font-size: 15px;">IB PYP 안내</a></div>
    <div class="nav-links" style="display:flex; gap:20px; font-size:14px; font-weight: 500;">
      <a href="pyp_bigpic.html" style="text-decoration:none; color:inherit;">큰 그림</a>
      <a href="pyp_cycle.html" style="text-decoration:none; color:inherit;">수업 진행</a>
      <a href="pyp_timeline.html" style="text-decoration:none; color:inherit;">1년 흐름</a>
      <a href="pyp_concepts.html" style="text-decoration:none; color:inherit;">개념 사전</a>
      <a href="pyp_evaluation.html" style="text-decoration:none; color:inherit;">평가</a>
      <a href="pyp_forms.html" style="text-decoration:none; color:inherit;">양식</a>
      <a href="pyp_parent.html" style="text-decoration:none; color:inherit;">자녀와 대화</a>
      <a href="pyp_glossary.html" style="text-decoration:none; color:var(--pyp-dark); font-weight:700;">용어</a>
    </div>
  </div>
</nav>
\`;

html = html.replace(/var\(--coral\)/g, 'var(--pyp)');
html = html.replace(/var\(--coral-dark\)/g, 'var(--pyp-dark)');
html = html.replace(/var\(--coral-pale\)/g, 'var(--pyp-pale)');
html = html.replace(/var\(--coral-light\)/g, 'var(--pyp-light)');

html = html.replace(/\\* { margin: 0; padding: 0; box-sizing: border-box; }/, '');
html = html.replace(/body {[\\s\\S]*?}/, '');
if (!html.includes('style.css')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="style.css">\\n</head>');
}
html = html.replace(/<body>\\s*(<div class="container">)?/, '<body>\\n' + fullNavHtml + '\\n<div class="container">');

// Fix the wrong URLs the user put in the snippet
html = html.replace(/\\.\\/pyp_parent_talk\\.html/g, 'pyp_parent.html');
html = html.replace(/\\.\\/pyp_forms\\/index\\.html/g, 'pyp_forms.html');

// Add scripts for glossary behavior
html = html.replace('</body>', '<script src="pyp_glossary_data.js"></script>\\n<script src="pyp_glossary_ui.js"></script>\\n</body>');

fs.writeFileSync('pyp_glossary.html', html, 'utf8');

// Now, extract data to pyp_glossary_data.js
const JSDOM = require('jsdom').JSDOM;
const dom = new JSDOM(html);
const doc = dom.window.document;

const glossItems = doc.querySelectorAll('.gloss-item');
const dataList = [];

glossItems.forEach(item => {
  const termEl = item.querySelector('.gloss-term');
  const enEl = item.querySelector('.en');
  
  // get pure term string
  let termClone = termEl.cloneNode(true);
  let stars = termClone.querySelectorAll('.star');
  stars.forEach(s => s.remove());
  let ens = termClone.querySelectorAll('.en');
  ens.forEach(e => e.remove());
  
  let term = termClone.textContent.trim();
  let en = enEl ? enEl.textContent.trim() : '';
  
  const defEl = item.querySelector('.gloss-def');
  let def = defEl ? defEl.innerHTML.trim() : '';
  
  const pagesList = [];
  const links = item.querySelectorAll('.gloss-pages a');
  links.forEach(a => {
    pagesList.push({ file: a.getAttribute('href'), title: a.textContent.trim() });
  });

  const keys = [term];
  if (term.includes(' / ')) {
    keys.push(...term.split(' / ').map(t => t.trim()));
  }

  dataList.push({
    term: term,
    en: en,
    def: def,
    keys: keys,
    pages: pagesList,
    id: term
  });
});

const dataFileContent = 'const pypGlossaryData = ' + JSON.stringify(dataList, null, 2) + ';';
fs.writeFileSync('pyp_glossary_data.js', dataFileContent, 'utf8');

// Now generate pyp_glossary_ui.js
const uiJs = `
const pypModalHtml = \`
<div id="pyp-glossary-modal" class="g-modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(44,37,34,0.4); z-index:9999; justify-content:center; align-items:center; padding:20px;">
  <div class="g-modal-content" style="background:var(--surface); width:100%; max-width:480px; border-radius:16px; overflow:hidden; box-shadow:0 12px 32px rgba(0,0,0,0.15);">
    <div class="g-modal-header" style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; background:var(--pyp-pale);">
      <div>
        <h3 id="pg-modal-term" style="font-size:18px; font-weight:700; color:var(--text); margin:0;">Term</h3>
        <span class="g-modal-en" id="pg-modal-en" style="font-size:13px; color:var(--muted); font-weight:400;">English</span>
      </div>
      <button class="g-modal-close" onclick="closePypGlossaryModal()" style="background:none; border:none; font-size:24px; color:var(--muted); cursor:pointer;">&times;</button>
    </div>
    <div class="g-modal-body" id="pg-modal-def" style="padding:24px; font-size:15px; color:var(--text-soft); line-height:1.6;">Definition</div>
    <div class="g-modal-footer" style="padding:20px 24px; background:#FAFAFA; border-top:1px solid var(--line);">
      <h4 style="font-size:12.5px;color:var(--muted);margin-bottom:12px;margin-top:0;">이 용어가 사용된 페이지:</h4>
      <ul id="pg-modal-pages" class="g-modal-page-list" style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:8px;"></ul>
    </div>
  </div>
</div>
\\\`;

document.body.insertAdjacentHTML('beforeend', pypModalHtml);

function closePypGlossaryModal() {
  document.getElementById('pyp-glossary-modal').style.display = 'none';
}

function openPypGlossaryModal(termId) {
  const termObj = pypGlossaryData.find(t => t.id === termId);
  if (!termObj) return;

  document.getElementById('pg-modal-term').innerHTML = termObj.term;
  document.getElementById('pg-modal-en').textContent = termObj.en || '';
  document.getElementById('pg-modal-def').innerHTML = termObj.def;
  
  const pagesList = document.getElementById('pg-modal-pages');
  pagesList.innerHTML = '';
  
  if (termObj.pages.length === 0) {
    pagesList.innerHTML = '<li style="font-size:13px; color:var(--text-soft);">이 용어가 내용 중에 사용된 페이지가 없습니다.</li>';
  } else {
    termObj.pages.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = \`<a href="${p.file}" style="display:inline-block; padding:5px 12px; background:white; border:1px solid var(--line); border-radius:100px; font-size:13px; color:var(--text-soft); text-decoration:none;" onmouseover="this.style.borderColor='var(--pyp)'; this.style.color='var(--pyp-dark)'; this.style.background='var(--pyp-pale)'" onmouseout="this.style.borderColor='var(--line)'; this.style.color='var(--text-soft)'; this.style.background='white'">${p.title}</a>\`;
      pagesList.appendChild(li);
    });
  }

  document.getElementById('pyp-glossary-modal').style.display = 'flex';
}

document.getElementById('pyp-glossary-modal').addEventListener('click', function(e) {
  if (e.target === this) closePypGlossaryModal();
});

function highlightPypTerms() {
  const allKeys = [];
  pypGlossaryData.forEach(t => {
    t.keys.forEach(k => {
      allKeys.push({ key: k, termId: t.id });
    });
  });
  allKeys.sort((a, b) => b.key.length - a.key.length);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tagName = parent.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'a' || tagName === 'nav' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || parent.classList.contains('pyp-highlight') || parent.closest('.gloss-item') || parent.closest('.g-modal-content') || parent.closest('.form-item') || parent.closest('.timeline-month') || parent.closest('.concept-card')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let node;
  while(node = walker.nextNode()) {
    if (node.nodeValue.trim() !== '') textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    let html = textNode.nodeValue;
    let modified = false;
    let placeholderMap = {};
    let counter = 0;

    for (const {key, termId} of allKeys) {
      const isEnglishShort = key.length <= 4 && /^[A-Za-z]+$/.test(key);
      const regexStr = isEnglishShort ? \`\\b${key}\\b\` : key;
      const regex = new RegExp(regexStr, 'g');
      
      html = html.replace(regex, (match) => {
        modified = true;
        const id = \`__PG_PH_${counter++}__\`;
        // Use inline style for highlight to ensure it's colored like PYP
        placeholderMap[id] = \`<span class="pyp-highlight" onclick="openPypGlossaryModal('${termId}')" style="color:var(--pyp-dark); border-bottom:1px dashed var(--pyp); cursor:pointer; font-weight:500;" onmouseover="this.style.background='var(--pyp-pale)'" onmouseout="this.style.background='transparent'">${match}</span>\`;
        return id;
      });
    }

    if (modified) {
      for (const [id, spanHtml] of Object.entries(placeholderMap)) {
        html = html.replace(new RegExp(id, 'g'), spanHtml);
      }
      const template = document.createElement('template');
      template.innerHTML = html;
      textNode.parentNode.replaceChild(template.content, textNode);
    }
  });
}

highlightPypTerms();

// Search functionality for the glossary page
const pypSearch = document.getElementById('glossarySearch');
if (pypSearch) {
  const pypItems = document.querySelectorAll('.gloss-item');
  const pypNoResult = document.getElementById('noResult');
  pypSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    let visibleCount = 0;
    pypItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    if(pypNoResult) pypNoResult.style.display = visibleCount === 0 ? 'block' : 'none';
  });
}
\`;

fs.writeFileSync('pyp_glossary_ui.js', uiJs, 'utf8');

// Update all pyp_*.html files to include these scripts (if not already included)
const files = fs.readdirSync('.');
files.forEach(f => {
  if (f.startsWith('pyp_') && f.endsWith('.html') && f !== 'pyp_glossary.html') {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('pyp_glossary_ui.js')) {
      content = content.replace('</body>', '<script src="pyp_glossary_data.js"></script>\\n<script src="pyp_glossary_ui.js"></script>\\n</body>');
      fs.writeFileSync(f, content, 'utf8');
    }
  }
});
console.log("Glossary implementation complete!");
