const fs = require('fs');
let html = fs.readFileSync('ib_myp_parent_guide.html', 'utf8');

// 1. Add CSS
const cssToAdd = `
.form-item[data-form] {
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 14px 16px;
  margin: 0 -16px;
  border-radius: 8px;
  position: relative;
}
.form-item[data-form]:hover {
  background-color: var(--coral-pale);
}
.form-item[data-form]::after {
  content: '▼ 양식 샘플 보기';
  position: absolute;
  right: 16px;
  top: 14px;
  font-size: 12px;
  color: var(--coral);
  font-weight: 600;
  background: var(--coral-pale);
  padding: 4px 10px;
  border-radius: 100px;
  opacity: 0;
  transition: opacity 0.2s;
}
.form-item[data-form]:hover::after {
  opacity: 1;
}
.form-item[data-form].active {
  background-color: var(--coral-pale);
  border-bottom-color: transparent;
}
.form-item[data-form].active::after {
  content: '▲ 닫기';
  opacity: 1;
}
.form-item-preview {
  grid-column: 1 / -1;
  width: 100%;
  display: none;
  margin-top: 16px;
  border: 1px solid var(--coral);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  cursor: default; /* so clicking inside doesn't toggle */
}
.form-item[data-form].active .form-item-preview {
  display: block;
}
.form-item-preview iframe {
  width: 100%;
  height: 600px;
  border: none;
  display: block;
}
@media (max-width: 640px) {
  .form-item-preview iframe { height: 400px; }
}
`;

html = html.replace('</style>', cssToAdd + '\n</style>');

// 2. Add JS
const jsToAdd = `
document.querySelectorAll('.form-item[data-form]').forEach(item => {
  item.addEventListener('click', function(e) {
    if(e.target.closest('.form-item-preview')) return; // ignore clicks inside preview

    const formUrl = this.getAttribute('data-form');
    if (!formUrl) return;

    const isActive = this.classList.contains('active');
    
    if (!isActive) {
      this.classList.add('active');
      let preview = this.querySelector('.form-item-preview');
      if (!preview) {
        preview = document.createElement('div');
        preview.className = 'form-item-preview';
        preview.innerHTML = \`<iframe src="\${formUrl}"></iframe>\`;
        this.appendChild(preview);
      }
    } else {
      this.classList.remove('active');
    }
  });
});
`;

html = html.replace('</script>', jsToAdd + '\n</script>');

// 3. Map forms using precise strings
const mappings = [
  ['학습자상 자가 진단', 'docs/01_learner_profile.html'],
  ['ATL 자가 진단', 'docs/02_atl_assessment.html'],
  ['목표 설정지', 'docs/03_goal_setting.html'],
  ['KWL 차트', 'docs/04_kwl_chart.html'],
  ['탐구질문 사전 답변', 'docs/11_pre_inquiry.html'],
  ['수행과제 계획서', 'docs/05_task_plan.html'],
  ['학습 일지', 'docs/06_learning_journal.html'],
  ['모둠 활동 기록표', 'docs/12_collaboration_log.html'],
  ['리서치 노트', 'docs/13_research_notes.html'],
  ['진행 단계별 체크리스트', 'docs/14_progress_checklist.html'],
  ['과제별 평가 기준 풀이', 'docs/15_task_clarification.html'],
  ['학업 정직성 서약서', 'docs/09_academic_honesty.html'],
  ['자기평가 루브릭', 'docs/07_self_assessment.html'],
  ['동료평가서', 'docs/16_peer_assessment.html'],
  ['단원 성찰일지', 'docs/08_unit_reflection.html'],
  ['IDU 성찰', 'docs/17_idu_reflection.html'],
  ['SA 계획서', 'docs/18_sa_proposal.html'],
  ['SA 활동 기록', 'docs/19_sa_log.html'],
  ['SA 성찰지', 'docs/20_sa_reflection.html'],
  ['탐구 일지 / 프로세스 저널', 'docs/10_process_journal.html'],
  ['ATL 진행 추적', 'docs/21_atl_tracker.html'],
  ['디지털 포트폴리오', 'docs/22_eportfolio.html'],
  ['수업 피드백', 'docs/23_teaching_feedback.html'],
  ['학습자상 자기성찰', 'docs/24_lp_yearend.html'],
  ['학생 주도 컨퍼런스 자료', 'docs/25_student_conference.html'],
  ['학부모 피드백 양식', 'docs/26_parent_feedback.html'],
  ['공동체 프로젝트 제안서', 'docs/27_cp_proposal.html'],
  ['>진행 일지<', 'docs/28_cp_journal.html'],
  ['최종 보고서', 'docs/29_cp_report.html'],
  ['자기·멘토 평가', 'docs/30_cp_assessment.html']
];

let lines = html.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<div class="form-item">')) {
    let nextLine = lines[i+1];
    if (nextLine && nextLine.includes('class="name"')) {
      for (let [name, url] of mappings) {
        if (nextLine.includes(name)) {
          lines[i] = lines[i].replace('<div class="form-item">', \`<div class="form-item" data-form="\${url}">\`);
          break;
        }
      }
    }
  }
}

fs.writeFileSync('ib_myp_parent_guide.html', lines.join('\\n'));
console.log("Done");
