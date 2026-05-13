const fs = require('fs');

const termsRaw = [
  { term: 'IBO', en: 'International Baccalaureate Organization', def: '스위스 제네바에 본부를 둔 비영리 교육 재단으로, 전 세계 IB 학교의 교육과정과 평가 표준을 관리합니다.', keys: ['IBO'] },
  { term: 'IB 월드스쿨', en: 'IB World School', def: 'IBO의 엄격한 인증 절차(관심-후보-인증)를 통과하여 공식적으로 IB 프로그램을 운영하는 학교입니다.', keys: ['IB 월드스쿨', '월드스쿨'] },
  { term: 'MYP', en: 'Middle Years Programme', def: '만 11세~16세(한국 중학교 과정 전반)를 위한 중등 교육 과정으로, 교과 지식과 현실 세계의 연결을 강조합니다.', keys: ['MYP'] },
  { term: '대행자성 / 주도성', en: 'Agency', def: '학생이 자신의 학습에 주도권을 갖고 스스로 목표를 세우며 책임을 지는 능력입니다.', keys: ['대행자성', '주도성'] },
  { term: '국제적 마인드', en: 'International Mindedness', def: '자신의 정체성을 바탕으로 타인의 문화와 가치를 존중하며 세계 시민으로서 행동하는 태도입니다.', keys: ['국제적 마인드'] },
  { term: '탐구 진술문 / SOI', en: 'Statement of Inquiry', def: '단원의 \'북극성\' 같은 문장입니다. 주요 개념, 관련 개념, 세계적 맥락을 조합해 이 단원에서 배울 핵심 진리를 한 문장으로 정의한 것입니다.', keys: ['탐구 진술문', '탐구진술문', 'SOI', 'SoI'] },
  { term: '주요 개념', en: 'Key Concepts', def: '교과 경계를 넘나드는 16가지 거대 아이디어(변화, 시스템, 관계 등)로, 학습의 폭을 넓혀줍니다.', keys: ['주요 개념', '주요개념'] },
  { term: '관련 개념', en: 'Related Concepts', def: '주요 개념을 각 교과의 특성에 맞게 구체화한 개념(예: 과학의 \'에너지\', 국어의 \'장르\')입니다.', keys: ['관련 개념', '관련개념'] },
  { term: '세계적 맥락', en: 'Global Contexts', def: '학습을 현실 세계와 연결하는 6가지 렌즈(정체성, 시공간, 혁신 등)입니다. "이걸 왜 배우는가"에 대한 답을 제공합니다.', keys: ['세계적 맥락'] },
  { term: '탐구 질문', en: 'Inquiry Questions', def: '단원 탐구를 이끄는 3종 질문입니다. 사실적(지식 확인), 개념적(원리 이해), 논쟁적(입장 정립) 질문으로 구성됩니다.', keys: ['탐구 질문', '탐구질문'] },
  { term: '간학문 단원 / IDU', en: 'Interdisciplinary Unit', def: '두 개 이상의 교과가 결합해 하나의 주제를 탐구하며 지식을 통합하는 특별 단원입니다.', keys: ['간학문 단원', '간학문 학습', 'IDU'] },
  { term: '평가 준거 / 크라이테리아', en: 'Criteria A, B, C, D', def: '각 과목별로 정해진 4가지 절대 평가 기준입니다. 각 준거는 8점 만점이며, 단순 정답률이 아닌 역량 도달도를 봅니다.', keys: ['평가 준거', '크라이테리아', '평가 기준'] },
  { term: '루브릭', en: 'Rubric', def: '성취 수준(0~8점)마다 학생이 보여주어야 할 구체적인 능력을 서술해 놓은 채점 기준표입니다.', keys: ['루브릭'] },
  { term: '과제별 기준 풀이', en: 'Task-specific Clarification', def: '일반적인 루브릭을 특정 과제(예: 특정 보고서 쓰기)에 맞춰 학생들이 이해하기 쉬운 언어로 구체화한 안내서입니다.', keys: ['과제별 기준 풀이', '과제별 평가 기준 풀이'] },
  { term: '형성 평가', en: 'Formative Assessment', def: '학습 과정 중에 수시로 이루어지는 평가로, 최종 성적에는 들어가지 않지만 성장을 위한 피드백을 목적으로 합니다.', keys: ['형성 평가', '형성평가'] },
  { term: '총괄 평가 / 수행과제', en: 'Summative Assessment', def: '단원 종료 시 성적을 산출하기 위해 수행하는 최종 과제입니다. 에세이, 발표, 제작물 등 다양한 형태를 띱니다.', keys: ['총괄 평가', '총괄평가', '수행과제'] },
  { term: '등급 환산 / 바운더리', en: 'Grade Boundary', def: '4개 준거 점수의 합계(32점 만점)를 IB가 정한 기준표에 대입해 최종 1~7등급으로 변환하는 과정입니다.', keys: ['등급 환산', '바운더리'] },
  { term: '최적합 방식', en: 'Best-fit Approach', def: '기계적인 평균 점수가 아니라, 학생이 해당 기간 동안 가장 일관되게 보여준 최고의 역량을 종합 판단해 점수를 부여하는 원칙입니다.', keys: ['최적합 방식'] },
  { term: '학습 방법 / ATL', en: 'Approaches to Learning', def: '의사소통, 사회성, 자기관리, 조사, 사고력 등 \'공부하는 법\' 그 자체를 의미하는 5대 핵심 학습 기술입니다.', keys: ['학습 방법', 'ATL', '학습법'] },
  { term: '학습자상', en: 'Learner Profile', def: 'IB 교육이 지향하는 10가지 인재상(탐구하는 사람, 배려하는 사람, 도전하는 사람 등)입니다.', keys: ['학습자상', 'Learner Profile'] },
  { term: '학업 정직성', en: 'Academic Honesty / Integrity', def: '표절, AI 무단 사용 등을 하지 않고 정직하게 자신의 학습을 증명하는 태도입니다. IB에서 가장 엄격히 관리하는 규정입니다.', keys: ['학업 정직성'] },
  { term: '메타인지 / 성찰', en: 'Metacognition / Reflection', def: '자신의 생각과 학습 과정을 스스로 돌아보고, 잘한 점과 보완할 점을 객관적으로 파악하는 능력입니다.', keys: ['메타인지', '성찰일지', '성찰'] },
  { term: '프로세스 저널 / 탐구 일지', en: 'Process Journal', def: '디자인, 예술, 혹은 주요 프로젝트의 기획부터 실패, 수정까지 모든 \'과정\'을 날짜별로 기록하는 연구 노트입니다.', keys: ['프로세스 저널', '탐구 일지'] },
  { term: '실천적 봉사 / SA', en: 'Service as Action', def: '교실에서 배운 내용을 바탕으로 지역사회나 학교에 긍정적인 변화를 만드는 실천 활동입니다.', keys: ['실천적 봉사', 'SA 활동', '봉사 실천'] },
  { term: '공동체 프로젝트 / CP', en: 'Community Project', def: '중학교 과정 후반부에 친구들과 함께 지역사회의 필요를 찾아 해결책을 기획하고 실행하는 팀 프로젝트입니다.', keys: ['공동체 프로젝트', 'CP'] },
  { term: '개인 프로젝트 / PP', en: 'Personal Project', def: 'MYP 과정의 최종 결실로, 학생이 스스로 정한 주제를 1년간 심층 연구하여 결과물과 보고서를 내놓는 졸업 작품입니다.', keys: ['개인 프로젝트', 'PP'] },
  { term: '학생 주도 컨퍼런스 / SLC', en: 'Student-Led Conference', def: '학부모 상담 시 교사가 아닌 학생이 직접 자신의 학습 결과와 성찰을 부모님께 발표하는 형식입니다.', keys: ['학생 주도 컨퍼런스', 'SLC'] },
  { term: '명령어', en: 'Command Terms', def: '\'분석하라\', \'평가하라\', \'설명하라\' 등 평가 과제에서 학생이 수행해야 할 사고의 수준을 정의하는 표준 단어들입니다.', keys: ['명령어'] },
  { term: '백워드 설계', en: 'Backward Design', def: '단원 끝의 평가 과제부터 먼저 정하고, 그걸 향해 수업을 거꾸로 짜는 방식. MYP 단원 설계의 핵심 원리예요.', keys: ['백워드 설계'] },
  { term: '포트폴리오', en: 'Portfolio', def: '단원 활동 결과물의 누적 모음. 학교가 ManageBac 같은 LMS를 운영한다면 학부모도 일부 확인할 수 있어요.', keys: ['포트폴리오'] }
];

const htmlFiles = ['myp_index.html', 'bigpic.html', 'cycle.html', 'timeline.html', 'concepts.html', 'evaluation.html', 'forms.html', 'parent.html', 'glossary.html'];
const pageTitles = {
  'myp_index.html': '홈', 'bigpic.html': '큰 그림', 'cycle.html': '수업 진행', 'timeline.html': '1년 흐름',
  'concepts.html': '개념 사전', 'evaluation.html': '평가', 'forms.html': '양식', 'parent.html': '자녀와 대화', 'glossary.html': '용어'
};

termsRaw.forEach(t => {
  t.pages = [];
  t.id = t.keys[0]; // unique ID
});

// 1. Build glossary_data.js by searching occurrences
htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  termsRaw.forEach(t => {
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    if (!bodyMatch) return;
    const bodyText = bodyMatch[1].replace(/<[^>]+>/g, ''); 
    
    let found = false;
    for(const key of t.keys) {
      if (bodyText.includes(key)) {
         found = true;
         break;
      }
    }
    
    if (found) {
      t.pages.push({ file: file, title: pageTitles[file] });
    }
  });
});

fs.writeFileSync('glossary_data.js', 'const glossaryData = ' + JSON.stringify(termsRaw, null, 2) + ';');

// 2. Write glossary_ui.js
const uiScript = `
const modalHtml = \`
<div id="glossary-modal" class="g-modal-overlay" style="display:none;">
  <div class="g-modal-content">
    <div class="g-modal-header">
      <h3 id="g-modal-term">Term</h3>
      <span class="g-modal-en" id="g-modal-en">English</span>
      <button class="g-modal-close" onclick="closeGlossaryModal()">&times;</button>
    </div>
    <div class="g-modal-body" id="g-modal-def">Definition</div>
    <div class="g-modal-footer">
      <h4 style="font-size:12.5px;color:var(--muted);margin-bottom:12px;">이 용어가 사용된 페이지:</h4>
      <ul id="g-modal-pages" class="g-modal-page-list"></ul>
    </div>
  </div>
</div>
\`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

function closeGlossaryModal() {
  document.getElementById('glossary-modal').style.display = 'none';
}

function openGlossaryModal(termId) {
  const termObj = glossaryData.find(t => t.id === termId);
  if (!termObj) return;

  document.getElementById('g-modal-term').textContent = termObj.term;
  document.getElementById('g-modal-en').textContent = termObj.en || '';
  document.getElementById('g-modal-def').textContent = termObj.def;
  
  const pagesList = document.getElementById('g-modal-pages');
  pagesList.innerHTML = '';
  
  if (termObj.pages.length === 0) {
    pagesList.innerHTML = '<li style="font-size:13px; color:var(--text-soft);">이 용어가 내용 중에 사용된 페이지가 없습니다.</li>';
  } else {
    termObj.pages.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = \\\`<a href="\\\${p.file}">\\\${p.title}</a>\\\`;
      pagesList.appendChild(li);
    });
  }

  document.getElementById('glossary-modal').style.display = 'flex';
}

document.getElementById('glossary-modal').addEventListener('click', function(e) {
  if (e.target === this) closeGlossaryModal();
});

function highlightTerms() {
  const allKeys = [];
  glossaryData.forEach(t => {
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
        // Do not highlight inside headers, navs, links, or already highlighted items
        if (tagName === 'script' || tagName === 'style' || tagName === 'a' || tagName === 'nav' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || parent.classList.contains('g-highlight') || parent.closest('.gloss-item') || parent.closest('.g-modal-content') || parent.closest('.form-item') || parent.closest('.timeline-month') || parent.closest('.concept-card')) {
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
      const regexStr = isEnglishShort ? \\\`\\\\\\\\b\\\${key}\\\\\\\\b\\\` : key;
      const regex = new RegExp(regexStr, 'g');
      
      html = html.replace(regex, (match) => {
        modified = true;
        const id = \\\`__G_PH_\\\${counter++}__\\\`;
        placeholderMap[id] = \\\`<span class="g-highlight" onclick="openGlossaryModal('\\\${termId}')">\\\${match}</span>\\\`;
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

highlightTerms();

// Update glossary list page if it exists
const glossaryListContainer = document.getElementById('glossaryList');
if (glossaryListContainer) {
  glossaryListContainer.innerHTML = '';
  const sorted = [...glossaryData].sort((a,b) => a.term.localeCompare(b.term));
  sorted.forEach(t => {
    glossaryListContainer.innerHTML += \\\`
      <div class="gloss-item" style="cursor:pointer;" onclick="openGlossaryModal('\\\${t.id}')">
        <div class="gloss-term">\\\${t.term}<span class="en">\\\${t.en}</span></div>
        <div class="gloss-def">\\\${t.def}</div>
      </div>
    \\\`;
  });
}
`;
fs.writeFileSync('glossary_ui.js', uiScript);

// 3. Append CSS to style.css
const css = `
/* --- Glossary Modal & Highlight --- */
.g-highlight {
  color: var(--coral-dark);
  border-bottom: 1px dashed var(--coral-dark);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.g-highlight:hover {
  background-color: var(--coral-pale);
}

.g-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.g-modal-content {
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  overflow: hidden;
  animation: g-modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes g-modal-pop {
  0% { transform: scale(0.95) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.g-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  position: relative;
  background: var(--coral-pale);
}
.g-modal-header h3 {
  font-size: 19px;
  font-weight: 700;
  color: var(--coral-dark);
  margin-bottom: 4px;
}
.g-modal-en {
  font-size: 13.5px;
  color: var(--muted);
  display: block;
}
.g-modal-close {
  position: absolute;
  top: 16px; right: 20px;
  background: none; border: none;
  font-size: 26px;
  color: var(--text-soft);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.g-modal-close:hover { color: var(--text); }
.g-modal-body {
  padding: 24px;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--text);
}
.g-modal-footer {
  padding: 20px 24px;
  background: var(--bg);
  border-top: 1px solid var(--line);
}
.g-modal-page-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.g-modal-page-list li a {
  display: inline-block;
  padding: 6px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-soft);
  text-decoration: none;
  transition: all 0.2s;
}
.g-modal-page-list li a:hover {
  border-color: var(--coral);
  color: var(--coral-dark);
  background: var(--coral-pale);
}
`;
if (!fs.readFileSync('style.css', 'utf8').includes('.g-modal-overlay')) {
  fs.appendFileSync('style.css', css);
}

// 4. Update htmlFiles to inject script tags
htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('glossary_data.js')) {
    content = content.replace('</body>', '<script src="glossary_data.js"></script>\n<script src="glossary_ui.js"></script>\n</body>');
    fs.writeFileSync(file, content);
  }
});
console.log('Glossary logic successfully added!');
