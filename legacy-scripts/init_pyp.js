const fs = require('fs');

const fileMapping = {
  'myp_index.html': 'pyp_index.html',
  'bigpic.html': 'pyp_bigpic.html',
  'cycle.html': 'pyp_cycle.html',
  'timeline.html': 'pyp_timeline.html',
  'concepts.html': 'pyp_concepts.html',
  'evaluation.html': 'pyp_evaluation.html',
  'forms.html': 'pyp_forms.html',
  'parent.html': 'pyp_parent.html',
  'glossary.html': 'pyp_glossary.html'
};

const userBigPicSnippet = `
<section class="content" id="bigpic">
  <div class="container">
    <div class="section-head">
      <span class="section-num">01 · 큰 그림</span>
      <h2>IB PYP는 무엇이고, 자녀의 수업과 어떻게 연결되나요?</h2>
      <p class="sub">결론부터 말하면, PYP는 국어, 수학처럼 <em>과목을 나누어 배우는 틀을 넘어 세상을 탐구하는 방식</em>이에요. 한국 초등학교 교육과정의 내용들을 6개의 거대한 '주제' 안에 녹여서 융합적으로 배운다고 생각하시면 됩니다.</p>
    </div>

    <div class="bigpic">
      <div class="layer">
        <span class="layer-label">변하지 않는 것 — IB 전체 공통</span>
        <div class="row">
          <span class="pill">IB 사명 (Mission)</span>
          <span class="pill">학습자상 (10가지)</span>
          <span class="pill">국제적 마인드</span>
          <span class="pill">교수법(ATT) · 학습법(ATL)</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="layer">
        <span class="layer-label">자녀가 속한 단계</span>
        <div class="row">
          <span class="pill" style="background: var(--pyp); border-color: var(--pyp); color: white; font-weight: 600;">PYP (초등 3~12세)</span>
          <span class="pill alt">MYP (중등)</span>
          <span class="pill alt2">DP / CP (고등)</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="layer">
        <span class="layer-label">PYP의 6가지 초교과 주제 (Transdisciplinary Themes) — 과목의 벽을 넘는 큰 렌즈</span>
        <div class="row">
          <span class="pill">우리는 누구인가</span>
          <span class="pill">우리가 속한 시간과 공간</span>
          <span class="pill">우리는 자신을 어떻게 표현하는가</span>
          <span class="pill">세계가 돌아가는 방식</span>
          <span class="pill">우리는 자신을 어떻게 조직하는가</span>
          <span class="pill">지구 공유하기</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="layer">
        <span class="layer-label">1년 동안 6번 굴러가는 '탐구 단원(UOI)'의 사이클</span>
        <div class="row">
          <span class="pill">호기심 열기 (도입)</span>
          <span class="pill alt">질문하고 조사하기 (탐색)</span>
          <span class="pill alt2">의미 찾기 (정리)</span>
          <span class="pill" style="background: #FFF4EF; color: var(--pyp);">행동으로 실천하기 (Action)</span>
        </div>
      </div>

      <div class="note">
        <strong style="color: var(--text); font-weight: 600;">한 줄 요약:</strong> 시간표에 국어, 수학이 따로 있기도 하지만, 학교생활의 진짜 핵심은 1년 동안 <strong style="color: var(--text); font-weight: 600;">6개의 커다란 주제(UOI)</strong> 아래 여러 과목의 지식을 융합하여 스스로 질문하고 행동(Action)으로 옮기는 것입니다.
      </div>
    </div>
  </div>
</section>
`;

// Add var(--pyp) to style.css if it doesn't exist
let styleCss = fs.readFileSync('style.css', 'utf8');
if (!styleCss.includes('--pyp:')) {
  styleCss = styleCss.replace(':root {', ':root {\n  --pyp: #F5A623;\n  --pyp-dark: #D68910;');
  fs.writeFileSync('style.css', styleCss);
}

for (const [mypFile, pypFile] of Object.entries(fileMapping)) {
  if (!fs.existsSync(mypFile)) continue;
  
  let content = fs.readFileSync(mypFile, 'utf8');
  
  // 1. Replace nav links
  content = content.replace(/href="myp_index\.html"/g, 'href="pyp_index.html"');
  content = content.replace(/href="bigpic\.html"/g, 'href="pyp_bigpic.html"');
  content = content.replace(/href="cycle\.html"/g, 'href="pyp_cycle.html"');
  content = content.replace(/href="timeline\.html"/g, 'href="pyp_timeline.html"');
  content = content.replace(/href="concepts\.html"/g, 'href="pyp_concepts.html"');
  content = content.replace(/href="evaluation\.html"/g, 'href="pyp_evaluation.html"');
  content = content.replace(/href="forms\.html"/g, 'href="pyp_forms.html"');
  content = content.replace(/href="parent\.html"/g, 'href="pyp_parent.html"');
  content = content.replace(/href="glossary\.html"/g, 'href="pyp_glossary.html"');

  // 2. Change Nav Logo and Head Title
  content = content.replace(/학부모를 위한 IB MYP 안내/g, '학부모를 위한 IB PYP 안내');
  
  // 3. For the big picture page, replace the main content
  if (pypFile === 'pyp_bigpic.html') {
    content = content.replace(/<section class="content" id="bigpic">[\s\S]*?<\/section>/, userBigPicSnippet.trim());
  }

  // 4. For the index page, do a quick text replace so it says PYP
  if (pypFile === 'pyp_index.html') {
    content = content.replace(/IB MYP/g, 'IB PYP');
    content = content.replace(/중학교 과정/g, '초등학교 과정');
    content = content.replace(/MYP 자녀/g, 'PYP 자녀');
  }

  // Active state color changes from coral-dark to pyp color
  if (content.includes('color:var(--coral-dark)')) {
    content = content.replace(/color:var\(--coral-dark\)/g, 'color:var(--pyp-dark)');
  }

  fs.writeFileSync(pypFile, content, 'utf8');
}

// Ensure index.html (Global Portal) has active status for PYP
let portal = fs.readFileSync('index.html', 'utf8');
portal = portal.replace('<div class="status-tag">준비 중</div>\n    <div class="ib-card-badge">초등학교 과정</div>', '<div class="status-tag ready">열람 가능</div>\n    <div class="ib-card-badge">초등학교 과정</div>');
fs.writeFileSync('index.html', portal, 'utf8');

console.log('PYP structure created and bigpic updated!');
