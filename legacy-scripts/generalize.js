const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.bak'));
const docFiles = fs.existsSync('./docs') ? fs.readdirSync('./docs').filter(f => f.endsWith('.html')).map(f => './docs/' + f) : [];
const allFiles = [...files, ...docFiles];

const replacements = [
  // index.html
  { from: '자녀가 IB MYP 교육을 받고 있다면', to: '자녀가 IB MYP 교육을 받고 있다면' },
  
  // bigpic.html
  { from: '자녀의 수업과 어떻게', to: '자녀의 수업과 어떻게' },
  { from: '자녀가 속한 단계', to: '자녀가 속한 단계' },
  
  // cycle.html
  { from: '학생이 수업을 듣기 전', to: '학생이 수업을 듣기 전' },
  { from: '학생이 단원을 살아가는 시간', to: '학생이 단원을 살아가는 시간' },
  { from: '학생은 모둠·개인으로', to: '학생은 모둠·개인으로' },
  
  // parent.html
  { from: '자녀가 모둠 활동', to: '자녀가 모둠 활동' },
  
  // timeline.html
  { from: 'MYP 과정을 기준으로', to: 'MYP 과정을 기준으로' },
  { from: '(MYP 최종 단계 한정)', to: '(MYP 최종 단계 한정)' },
  
  // forms.html
  { from: 'MYP 최종 학년 · 졸업 프로젝트', to: 'MYP 최종 학년 · 졸업 프로젝트' },
  
  // docs/*.html
  { from: 'MYP 최종 학년', to: 'MYP 최종 학년' },
  { from: 'MYP 최종 학년 시작 직후', to: 'MYP 최종 학년 시작 직후' },
  { from: 'MYP 과정의 종합 졸업 프로젝트예요.', to: 'MYP 과정의 종합 졸업 프로젝트예요.' },
  { from: '중학교 졸업 때 전체 과정 포트폴리오가 됩니다.', to: '중학교 졸업 때 전체 과정 포트폴리오가 됩니다.' },
  
  // glossary.html & data
  { from: 'MYP 후반부 과정에서 진행하는', to: 'MYP 후반부 과정에서 진행하는' },
  { from: '중학교 과정 후반부에 친구들과', to: '중학교 과정 후반부에 친구들과' },
  { from: '만 11세~16세(한국 중학교 과정 전반)', to: '만 11세~16세(한국 중학교 과정 전반)' },
  
  // Additional safety matches
  { from: '자녀가', to: '자녀가' },
  { from: '자녀가', to: '자녀가' },
  { from: '자녀', to: '자녀' },
  { from: '자녀가', to: '자녀가' },
  { from: '자녀가', to: '자녀가' }
];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.split(r.from).join(r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated generalized terms in ${file}`);
  }
});
