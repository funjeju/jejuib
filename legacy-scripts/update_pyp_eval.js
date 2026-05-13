const fs = require('fs');

let userEvaluationSnippet = `
<section class="content" id="evaluation">
  <div class="container">
    <div class="section-head">
      <span class="section-num">05 · 평가 이해하기</span>
      <h2>점수 대신 성장 과정을 담는 '포트폴리오'</h2>
      <p class="sub">PYP에는 100점 만점 시험이나 등수가 없습니다. 누가 더 잘했나 줄을 세우는 것이 아니라, <em>"자녀가 UOI 단원을 거치며 어떻게 성장했는가"</em>를 증명하는 것이 평가의 목적입니다.</p>
    </div>

    <div class="eval-grid">
      <div class="eval-card">
        <div class="crit">핵심 도구 01</div>
        <h4>포트폴리오 (Portfolio)</h4>
        <p>1년 동안 자녀가 고민하고, 실수하고, 다시 시도한 흔적을 모아둔 '성장 기록장'입니다. 가장 잘한 100점짜리 시험지만 모으는 게 아니라, 첫 아이디어 스케치부터 최종 완성본까지의 <strong>'과정'</strong> 전체를 담습니다.</p>
      </div>
      <div class="eval-card">
        <div class="crit">핵심 도구 02</div>
        <h4>형성평가와 총괄평가</h4>
        <p><strong>형성평가</strong>는 수업 중 매일 일어납니다. 선생님은 점수를 매기지 않고 "이 부분을 이렇게 고쳐볼까?"라고 피드백을 줍니다. <strong>총괄평가</strong>는 단원 끝에 배운 것을 발표나 작품으로 보여주는 활동입니다.</p>
      </div>
      <div class="eval-card">
        <div class="crit">핵심 도구 03</div>
        <h4>자기 평가와 동료 평가</h4>
        <p>선생님만 평가하는 게 아닙니다. "나는 이번 탐구에서 뭘 잘했고, 뭘 어려워했지?" 스스로 돌아보는 자기 평가와, 친구의 발표를 듣고 긍정적인 피드백을 주는 동료 평가가 매우 중요하게 다뤄집니다.</p>
      </div>
    </div>

    <div class="eval-info">
      <h4>학부모와 평가 결과를 나누는 방법 (소통 방식)</h4>
      <dl>
        <dt>학생 주도 컨퍼런스 (SLC)</dt>
        <dd>가장 중요한 행사입니다. 선생님이 부모님과 면담하는 게 아니라, <strong>자녀가 직접 부모님을 학교로 초대</strong>해 자신의 포트폴리오를 펼쳐놓고 한 학기 동안의 학습을 발표합니다.</dd>
        
        <dt>3자 상담 (Three-Way Conference)</dt>
        <dd>학생, 학부모, 선생님이 <strong>모두 함께</strong> 모여 상담합니다. 선생님이 자녀를 평가하는 자리가 아니라, 세 사람이 함께 다음 학기의 학습 목표를 세우는 자리입니다.</dd>
        
        <dt>서술형 통지표 (Written Report)</dt>
        <dd>숫자나 알파벳 등급이 없습니다. 각 단원의 핵심 아이디어를 얼마나 잘 이해했는지, 어떤 학습자상(Learner Profile)이 발현되었는지 선생님이 구체적인 문장으로 길게 서술해 줍니다.</dd>
      </dl>
    </div>

    <div class="callout">
      <h4>통지표나 포트폴리오를 받았을 때 부모님의 태도</h4>
      <p>"그래서 우리 반에서 네가 제일 잘했어?", "왜 이거밖에 못 적었어?"라는 질문은 자녀의 탐구 의지를 꺾습니다. 대신 이렇게 물어봐 주세요. <br><br>
      <strong style="font-weight:600; color: var(--pyp-dark);">"이거 만들 때 어떤 점이 제일 재미있었어?"</strong><br>
      <strong style="font-weight:600; color: var(--pyp-dark);">"이 부분은 혼자 생각한 거야? 정말 기발하다!"</strong><br>
      결과가 완벽하지 않아도, 자녀가 스스로 고민한 '과정'을 칭찬해 주는 것이 PYP 평가의 핵심입니다.</p>
    </div>
  </div>
</section>
`;

let pypEval = fs.readFileSync('pyp_evaluation.html', 'utf8');

pypEval = pypEval.replace(/<section class="content" id="evaluation">[\s\S]*?<\/section>/, userEvaluationSnippet.trim());

// Also inject a style block to override eval-card and eval-info colors to PYP themes
const pypStyleOverride = `\n<style>
  .eval-card { border-top: 4px solid var(--pyp); }
  .eval-card .crit { color: var(--pyp-dark); background: var(--pyp-pale); }
  .eval-info dt { color: var(--pyp-dark); }
</style>\n`;

if (!pypEval.includes('eval-card { border-top: 4px solid var(--pyp); }')) {
  pypEval = pypEval.replace('</head>', pypStyleOverride + '</head>');
}

fs.writeFileSync('pyp_evaluation.html', pypEval, 'utf8');
console.log('PYP evaluation updated successfully!');
