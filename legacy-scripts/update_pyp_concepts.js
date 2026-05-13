const fs = require('fs');

const userConceptsSnippet = `
<section class="content" id="concepts">
  <div class="container">
    <div class="section-head">
      <span class="section-num">04 · 개념 사전</span>
      <h2>PYP의 언어에 익숙해지기</h2>
      <p class="sub">가정통신문에 등장하는 생소한 단어들을 초등 부모님 눈높이에서 풀었어요. 각 항목을 클릭하면 세부 설명을 볼 수 있습니다.</p>
    </div>

    <div class="concept-block">
      <h3>6가지 초교과 주제 (Transdisciplinary Themes)</h3>
      <p class="desc">아이들이 1년 동안 세상을 바라보는 6가지 커다란 렌즈예요. 모든 UOI는 이 중 하나에 속합니다.</p>
      <div class="concept-grid">
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Who we are</div>
          <div class="ko">우리는 누구인가</div>
          <div class="def">신념, 가치, 신체적·정신적 건강, 인간관계와 권리에 대해 탐구합니다.</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Where we are in place and time</div>
          <div class="ko">우리가 속한 시간과 공간</div>
          <div class="def">개인적 역사, 여정, 문명, 인류의 상호 연결성을 시간과 장소의 맥락에서 배웁니다.</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">How we express ourselves</div>
          <div class="ko">우리는 자신을 어떻게 표현하는가</div>
          <div class="def">생각, 감정, 문화를 창의적으로 표현하고 공유하는 방식을 탐구합니다.</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">How the world works</div>
          <div class="ko">세계가 돌아가는 방식</div>
          <div class="def">자연 세계의 법칙, 과학적 원리, 기술이 우리 삶에 미치는 영향을 이해합니다.</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">How we organize ourselves</div>
          <div class="ko">우리는 자신을 어떻게 조직하는가</div>
          <div class="def">공동체, 시스템, 의사결정 방식, 경제적 활동이 사회를 어떻게 움직이는지 배웁니다.</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Sharing the planet</div>
          <div class="ko">지구 공유하기</div>
          <div class="def">평화, 자원 분배, 환경 보호 등 다른 생명체와 함께 살아가기 위한 책임을 탐구합니다.</div>
        </div>
      </div>
    </div>

    <div class="concept-block">
      <h3>7가지 핵심 개념 (Key Concepts)</h3>
      <p class="desc">지식을 깊이 있게 파고들기 위한 '질문의 도구'예요. 단원마다 2~3개의 개념을 집중적으로 씁니다.</p>
      <div class="concept-grid">
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Form</div>
          <div class="ko">형태</div>
          <div class="def">"이것은 무엇과 같은가?" (모양, 구조, 겉모습 관찰)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Function</div>
          <div class="ko">기능</div>
          <div class="def">"이것은 어떻게 작동하는가?" (역할, 목적, 쓰임새)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Causation</div>
          <div class="ko">원인</div>
          <div class="def">"이것은 왜 그런가?" (사건의 배경, 이유, 결과)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Change</div>
          <div class="ko">변화</div>
          <div class="def">"이것은 어떻게 변하고 있는가?" (시간에 따른 상태의 전환)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Connection</div>
          <div class="ko">연결</div>
          <div class="def">"이것은 다른 것과 어떻게 연결되는가?" (관계, 상호작용)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Perspective</div>
          <div class="ko">관점</div>
          <div class="def">"다른 시각은 무엇인가?" (다양한 입장, 주관적인 해석)</div>
        </div>
        <div class="concept-card" onclick="this.classList.toggle('open')">
          <div class="en">Responsibility</div>
          <div class="ko">책임</div>
          <div class="def">"우리의 책임은 무엇인가?" (윤리적 판단, 행동의 선택)</div>
        </div>
      </div>
    </div>

    <div class="concept-block">
      <h3>행동과 실천 (Action) — 공부의 완성</h3>
      <p class="desc">PYP 학습의 최종 목적은 '실천'이에요. 배운 것을 바탕으로 아이가 보여주는 5가지 행동 유형입니다.</p>
      <div class="concept-grid">
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="ko">라이프스타일</div><div class="def">생활 습관의 변화 (예: 양치할 때 물 끄기)</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="ko">사회적 행동</div><div class="def">공동체를 위한 활동 (예: 복도에서 친구 돕기)</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="ko">옹호</div><div class="def">가치를 널리 알림 (예: 급식 잔반 줄이기 캠페인)</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="ko">사회적 정의</div><div class="def">공정함을 위한 노력 (예: 소외된 친구 챙기기)</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="ko">참여</div><div class="def">의사결정에 동참 (예: 학급 규칙 논의하기)</div></div>
      </div>
    </div>

    <div class="concept-block">
      <h3>학습 방법 (ATL Skills)</h3>
      <p class="desc">초등학생 수준에서 '공부하는 근육'을 키우는 5대 기술입니다.</p>
      <div class="concept-grid">
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="en">Communication</div><div class="ko">의사소통</div><div class="def">경청하고 자신의 생각을 명확하게 표현하기</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="en">Social</div><div class="ko">사회성</div><div class="def">친구와 협력하고 갈등을 평화롭게 해결하기</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="en">Self-management</div><div class="ko">자기관리</div><div class="def">시간을 아껴 쓰고 감정을 스스로 조절하기</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="en">Research</div><div class="ko">연구·리서치</div><div class="def">궁금한 것을 책이나 인터넷에서 직접 찾아보기</div></div>
        <div class="concept-card" onclick="this.classList.toggle('open')"><div class="en">Thinking</div><div class="ko">사고력</div><div class="def">비판적·창의적으로 생각하고 문제 해결하기</div></div>
      </div>
    </div>
  </div>
</section>
`;

let pypConcepts = fs.readFileSync('pyp_concepts.html', 'utf8');
pypConcepts = pypConcepts.replace(/<section class="content" id="concepts">[\s\S]*?<\/section>/, userConceptsSnippet.trim());

// We should also replace the global styles specific to concepts if they use MYP variables (like var(--coral)) to PYP variables (var(--pyp)).
// The concepts cards in style.css use:
// .concept-card.open { border-color: var(--coral-dark); }
// To isolate styles for PYP vs MYP easily without changing style.css again for concepts, 
// we can inject a <style> block directly into pyp_concepts.html, or we can just replace var(--coral) to var(--pyp) inside pyp_concepts.html if it had inline styles.
// Since the style is in style.css, and we added body class earlier? No, we didn't add a body class.
// We can just add a body class "theme-pyp" to pyp_index.html and pyp_concepts.html, but let's just do it directly via a style tag in the file.
const pypStyleOverride = `\n<style>
  .concept-card.open { border-color: var(--pyp-dark); }
  .concept-card.open .ko { color: var(--pyp-dark); }
</style>\n`;

if (!pypConcepts.includes('theme-pyp')) {
  pypConcepts = pypConcepts.replace('</head>', pypStyleOverride + '</head>');
}

fs.writeFileSync('pyp_concepts.html', pypConcepts, 'utf8');
console.log('PYP concepts updated successfully!');
