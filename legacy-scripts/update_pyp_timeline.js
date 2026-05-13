const fs = require('fs');

const userTimelineSnippet = `
<section class="content" id="timeline">
  <div class="container">
    <div class="section-head">
      <span class="section-num">03 · 1년 학교생활 흐름</span>
      <h2>한 해 동안 자녀는 무엇을 경험하나요?</h2>
      <p class="sub">초등학교 3~4학년을 기준으로 한 해 흐름을 정리했어요. 초등 과정은 1년 동안 <strong>6개의 거대한 탐구 단원(UOI)</strong>을 차례대로 경험하며 세상을 보는 6가지 렌즈를 모두 써보게 됩니다.</p>
    </div>

    <div class="timeline">
      <div class="timeline-row">
        <div class="timeline-month">3월 초</div>
        <div class="timeline-event"><strong>새 학기 오리엔테이션 및 학급 약속 정하기.</strong> 선생님이 규칙을 정해주는 것이 아니라, 1년 동안 우리 반이 지킬 '학급 약속(Essential Agreements)'을 학생들이 토론을 통해 스스로 만듭니다. <span class="tag">학급 약속</span> <span class="tag">학습자상</span></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">3월 중</div>
        <div class="timeline-event"><strong>첫 번째 탐구 단원(UOI 1) 시작.</strong> 가정통신문(UOI 뉴스레터)이 발송됩니다. 이번 단원의 '핵심 아이디어(Central Idea)'와 집에서 부모님이 도와주실 수 있는 활동이 안내됩니다. <span class="tag">UOI</span> <span class="tag">가정통신문</span></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">3~4월</div>
        <div class="timeline-event"><strong>UOI 1 탐구·실행.</strong> 질문 만들기(Wonder Wall), 자료 조사, 현장 체험 학습이 초교과적으로 진행됩니다. 국어 시간에 관련 책을 읽고, 수학 시간에 조사한 자료를 그래프로 그립니다. <span class="tag">초교과적 학습</span></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">4월 말</div>
        <div class="timeline-event"><strong>UOI 1 마무리 및 행동(Action).</strong> 단원 결과물을 학급에서 공유하고, 성찰지를 씁니다. 가장 중요한 것은 배운 것을 바탕으로 가정이나 학교에서 작은 '실천(Action)'을 해보는 것입니다. <span class="tag">Action(실천)</span> <span class="tag">성찰</span></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">5~6월</div>
        <div class="timeline-event"><strong>UOI 2, UOI 3 진행.</strong> 1번 단원과 같은 사이클이 새로운 초교과 주제(예: 우리가 속한 시간과 공간, 세계가 돌아가는 방식 등)로 반복됩니다.</div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">7월</div>
        <div class="timeline-event"><strong>1학기 마무리 및 포트폴리오.</strong> 1학기 동안 학생의 활동 결과물과 성찰이 담긴 '포트폴리오'가 가정으로 발송됩니다. 학교에 따라 자녀가 부모님께 직접 자기 학습을 브리핑하는 '학생 주도 컨퍼런스(SLC)'가 열리기도 합니다. <span class="tag">포트폴리오</span> <span class="tag">학생 주도 컨퍼런스</span></div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">9~11월</div>
        <div class="timeline-event"><strong>2학기 UOI 4, UOI 5 진행.</strong> 1학기와 동일하게 새로운 렌즈로 세상을 탐구합니다. 이 시기에는 탐구의 깊이가 더 깊어지고 학생들이 주도하는 활동이 많아집니다.</div>
      </div>
      <div class="timeline-row">
        <div class="timeline-month">12~1월</div>
        <div class="timeline-event"><strong>마지막 UOI 6 진행 및 학년 종합 성찰.</strong> 1년 동안 6개의 초교과 주제를 모두 다뤘습니다. 1년간 어떤 학습자상(Learner Profile)과 학습 방법(ATL)이 자라났는지 종합적으로 돌아봅니다. <span class="tag">ATL 점검</span></div>
      </div>
      <div class="timeline-row" style="background: var(--pyp-pale); border-radius: 12px; border: 1px solid var(--pyp-light);">
        <div class="timeline-month" style="color: var(--pyp-dark);">중요 (6학년)</div>
        <div class="timeline-event"><strong>PYP 전시회 (Exhibition).</strong> 초등 과정 6년을 집대성하는 가장 거대한 프로젝트입니다. 6학년 학생들은 장기간 스스로 주제를 정하고, 멘토 교사와 함께 깊이 탐구한 뒤 전교생과 학부모 앞에서 결과물을 발표합니다. <span class="tag" style="background: white; border: 1px solid var(--pyp); color: var(--pyp-dark);">Exhibition</span></div>
      </div>
    </div>

    <div class="callout">
      <h4>이 흐름에서 학부모가 가정에서 할 수 있는 최고의 지원</h4>
      <p>• <strong>UOI가 시작될 때:</strong> 학교에서 오는 'UOI 뉴스레터'를 냉장고에 붙여두고 관련 책이나 다큐멘터리를 함께 봐주세요. <br>• <strong>단원 중간:</strong> "오늘은 학교에서 어떤 질문을 만들었어?"라고 물어봐 주세요. <br>• <strong>포트폴리오가 올 때:</strong> 결과물이 완벽한지 평가하지 마시고, "이거 할 때 어떤 게 제일 힘들었어? 어떻게 해결했어?"라며 <strong>과정</strong>을 칭찬해 주세요.</p>
    </div>
  </div>
</section>
`;

let pypTimeline = fs.readFileSync('pyp_timeline.html', 'utf8');
pypTimeline = pypTimeline.replace(/<section class="content" id="timeline">[\s\S]*?<\/section>/, userTimelineSnippet.trim());
fs.writeFileSync('pyp_timeline.html', pypTimeline, 'utf8');

// Update style.css to ensure pyp-pale and pyp-light exist
let styleCss = fs.readFileSync('style.css', 'utf8');
let cssUpdated = false;
if (!styleCss.includes('--pyp-pale:')) {
  styleCss = styleCss.replace(':root {', ':root {\n  --pyp-pale: #FFF7E6;\n  --pyp-light: #FDEBD0;');
  cssUpdated = true;
}

if (cssUpdated) {
  fs.writeFileSync('style.css', styleCss, 'utf8');
}

console.log('PYP timeline updated successfully!');
