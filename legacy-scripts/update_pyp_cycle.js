const fs = require('fs');

const userCycleSnippet = `
<section class="content" id="cycle">
  <div class="container">
    <div class="section-head">
      <span class="section-num">02 · 수업 진행</span>
      <h2>질문에서 시작해 실천으로 끝나는 '탐구 사이클'</h2>
      <p class="sub">초등 탐구 단원(UOI)은 보통 4~6주 동안 진행돼요. 학생들은 정답을 외우는 게 아니라, 아래의 사이클을 돌며 스스로 '배우는 법'을 익히게 됩니다.</p>
    </div>

    <div class="cycle">
      <div class="stage stage-1">
        <div class="stage-header">
          <span class="stage-num">단계 1 · 도입 및 탐색</span>
          <h3>호기심을 열고 질문을 던지는 시간</h3>
          <span class="when">UOI 1~2주차</span>
        </div>
        <p class="summary">주제와 관련된 다양한 자극(사진, 영상, 현장 방문 등)을 통해 학생들이 "이건 왜 이럴까?"라는 질문을 스스로 뽑아내는 단계예요.</p>

        <h4>학부모가 알아둘 점</h4>
        <ul>
          <li><strong>핵심 아이디어 (Central Idea)</strong>: 단원 전체를 관통하는 가장 큰 원리. (예: "생물은 환경에 적응하며 변화한다")</li>
          <li><strong>탐구 목록 (Lines of Inquiry)</strong>: 핵심 아이디어를 이해하기 위해 파고들 3~4가지 세부 주제.</li>
          <li><strong>이전 지식 점검</strong>: 자녀가 이 주제에 대해 이미 무엇을 알고 있는지(Prior Knowledge) 확인해요.</li>
          <li><strong>학생 주도 질문</strong>: 선생님이 주는 질문이 아니라, 학생들이 포스트잇에 적어 붙인 질문들이 수업의 교과서가 됩니다.</li>
        </ul>

        <div class="callout" style="margin: 24px 0 0;">
          <h4>전통적 수업과 다른 점</h4>
          <p>옛날: "오늘은 광합성에 대해 배우자" (결론부터 제시) &nbsp; • &nbsp; PYP: "식물은 입 없이 어떻게 밥을 먹을까?" (학생들의 질문에서 시작)</p>
        </div>
      </div>

      <div class="stage stage-2" style="border-color: var(--teal);">
        <div class="stage-header">
          <span class="stage-num" style="color: var(--teal);">단계 2 · 조사 및 정리</span>
          <h3>직접 찾고 나만의 언어로 만드는 시간</h3>
          <span class="when">UOI 3~4주차</span>
        </div>
        <p class="summary">책, 인터넷, 실험, 인터뷰 등 다양한 방법으로 정보를 수집하고, 이를 도표나 그림, 글로 정리하며 의미를 찾아가는 과정이에요.</p>

        <h4>학부모가 알아둘 점</h4>
        <ul>
          <li><strong>핵심 개념 (Key Concepts)</strong>: 형태, 기능, 원인, 변화, 연결, 관점, 책임 등 7가지 렌즈로 세상을 봐요.</li>
          <li><strong>학습 방법 (ATL)</strong>: 조사하는 기술, 생각하는 기술, 소통하는 기술 등을 의식적으로 연습합니다.</li>
          <li><strong>초교과적 연결</strong>: 과학 단원이라도 국어(보고서 쓰기), 미술(관찰 세밀화) 등이 자연스럽게 섞여서 진행돼요.</li>
          <li><strong>원더 월 (Wonder Wall)</strong>: 교실 벽면에 학생들의 탐구 과정과 중간 결과물들이 가득 채워집니다.</li>
        </ul>

        <div class="callout" style="margin: 24px 0 0;">
          <h4>학부모가 자주 오해하는 부분</h4>
          <p>"초등학생이 뭘 조사하겠어?"라고 생각하시지만, 학생들은 <strong>자신만의 수준에서 자료를 비판적으로 선택하고 비교하는 법</strong>을 배웁니다. 완벽한 정보보다 '조사하는 과정' 자체가 공부입니다.</p>
        </div>
      </div>

      <div class="stage stage-3" style="border-color: var(--amber);">
        <div class="stage-header">
          <span class="stage-num" style="color: var(--amber);">단계 3 · 공유 및 실천(Action)</span>
          <h3>배운 것을 삶으로 가져오는 시간</h3>
          <span class="when">UOI 마지막 1~2주</span>
        </div>
        <p class="summary">탐구한 내용을 친구들과 공유하고, 가장 중요한 단계인 **'행동(Action)'**으로 옮깁니다. 앎이 삶의 변화로 이어지는 지점이에요.</p>

        <h4>학부모가 알아둘 점</h4>
        <ul>
          <li><strong>성찰 (Reflection)</strong>: "나는 무엇을 알게 되었고, 처음 생각과 어떻게 달라졌는가?"를 기록해요.</li>
          <li><strong>실천 (Action)</strong>: 거창한 봉사가 아니라도 괜찮아요. 집에서 물 아끼기, 가족에게 설명해주기, 캠페인 포스터 그리기 등 작은 변화가 핵심입니다.</li>
          <li><strong>학습 주도권 (Agency)</strong>: 자녀가 스스로 실천 방안을 결정하고 실행할 때 PYP 교육은 완성됩니다.</li>
          <li><strong>6학년 전시회 (Exhibition)</strong>: 초등 탐구의 완결판으로, 학생이 직접 주제 선정부터 발표까지 주도합니다.</li>
        </ul>

        <div class="callout" style="margin: 24px 0 0;">
          <h4>진짜 공부의 완성</h4>
          <p>시험 문제를 맞히는 게 끝이 아니에요. <strong style="font-weight:600;">"배운 내용을 바탕으로 오늘 내 행동이 하나라도 바뀌었는가?"</strong>가 PYP가 추구하는 최고의 성적표입니다.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

let pypCycle = fs.readFileSync('pyp_cycle.html', 'utf8');

// The regex matches <section class="content" id="cycle"> ... </section>
// We need to be careful not to match too much. Since it's exactly the content block, we can just match it.
pypCycle = pypCycle.replace(/<section class="content" id="cycle">[\s\S]*?<\/section>/, userCycleSnippet.trim());

fs.writeFileSync('pyp_cycle.html', pypCycle, 'utf8');

// Update style.css to include --teal and --amber if not present
let styleCss = fs.readFileSync('style.css', 'utf8');
let cssUpdated = false;
if (!styleCss.includes('--teal:')) {
  styleCss = styleCss.replace(':root {', ':root {\n  --teal: #1ABC9C;');
  cssUpdated = true;
}
if (!styleCss.includes('--amber:')) {
  styleCss = styleCss.replace(':root {', ':root {\n  --amber: #F39C12;');
  cssUpdated = true;
}

if (cssUpdated) {
  fs.writeFileSync('style.css', styleCss, 'utf8');
}

console.log('PYP cycle updated successfully!');
