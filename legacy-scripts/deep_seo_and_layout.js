const fs = require('fs');

// 1. Update index.html Layout
if (fs.existsSync('index.html')) {
  let indexHtml = fs.readFileSync('index.html', 'utf8');
  const introSectionRegex = /<section class="ib-intro">[\s\S]*?<\/section>/;
  const introMatch = indexHtml.match(introSectionRegex);

  const programsTitleRegex = /<h2 class="programs-title">.*?<\/h2>/;
  const programsGridRegex = /<div class="programs-grid">[\s\S]*?<\/div>/;
  
  const titleMatch = indexHtml.match(programsTitleRegex);
  const gridMatch = indexHtml.match(programsGridRegex);

  if (introMatch && titleMatch && gridMatch && indexHtml.indexOf('<section class="ib-intro">') < indexHtml.indexOf('<h2 class="programs-title">')) {
    // Remove intro from original place
    indexHtml = indexHtml.replace(introMatch[0], '');
    
    // Build new order: Programs Title -> Programs Grid -> IB Intro
    const newProgramsSection = `
  ${titleMatch[0]}
  ${gridMatch[0]}

  <div style="margin: 60px 0;"></div>

  ${introMatch[0]}
`;
    
    indexHtml = indexHtml.replace(titleMatch[0] + '\n\n  ' + gridMatch[0], newProgramsSection);
    // Fallback if the strict replacement fails due to spacing
    if (!indexHtml.includes(introMatch[0])) {
        // Just inject before </main>
        indexHtml = indexHtml.replace('</main>', `\n  ${introMatch[0]}\n</main>`);
    }

    fs.writeFileSync('index.html', indexHtml, 'utf8');
  }
}

// 2. Deep SEO Injection for PYP and MYP files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'ib_myp_parent_guide.html.bak');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  let program = file.startsWith('pyp_') ? 'PYP' : 'MYP';
  let programKr = program === 'PYP' ? '초등학교' : '중학교';
  let category = '';
  let titleSuffix = '';
  let customDesc = '';
  let customKeys = '';
  
  if (file.includes('index')) {
    category = '안내서 홈'; titleSuffix = '과정 완벽 이해';
    customDesc = `국제 바칼로레아(IB) ${program}(${programKr}) 과정에 자녀를 보낸 학부모를 위한 종합 가이드입니다.`;
    customKeys = `IB ${program}, IB ${programKr}, 국제 바칼로레아 ${program}, 학부모 가이드`;
  } else if (file.includes('bigpic')) {
    category = '큰 그림'; titleSuffix = '구조와 특징';
    customDesc = `IB ${program} 교육과정의 핵심 구조와 ${programKr} 수업이 어떻게 이루어지는지 전체적인 큰 그림을 설명합니다.`;
    customKeys = `IB ${program} 특징, ${programKr} IB 과정, 교육 철학`;
  } else if (file.includes('cycle')) {
    category = '수업 진행'; titleSuffix = '탐구 수업 방식';
    customDesc = `선생님의 강의 대신 학생이 주도하는 IB ${program} 탐구 사이클과 실제 교실에서의 수업 진행 방식을 소개합니다.`;
    customKeys = `IB 탐구 사이클, ${program} 수업 방식, 학생 주도 학습, UOI`;
  } else if (file.includes('timeline')) {
    category = '1년 흐름'; titleSuffix = '학사 일정과 주요 행사';
    customDesc = `IB ${program} 학교의 1년 학사 일정, 전시회/프로젝트 등 주요 행사와 시기별 학부모의 역할을 안내합니다.`;
    customKeys = `IB ${program} 학사일정, 1년 흐름, 학교생활, 전시회, 프로젝트`;
  } else if (file.includes('concepts')) {
    category = '개념 사전'; titleSuffix = '필수 용어 정리';
    customDesc = `UOI, 핵심 개념, ATL 등 가정통신문에 자주 등장하는 IB ${program} 필수 전문 용어들을 알기 쉽게 해설합니다.`;
    customKeys = `IB 용어 사전, ${program} 필수 단어, 핵심 개념, UOI, ATL`;
  } else if (file.includes('evaluation')) {
    category = '평가 방식'; titleSuffix = '성적표와 루브릭';
    customDesc = `시험 점수 대신 과정과 성장을 기록하는 IB ${program}의 평가 방식, 루브릭, 포트폴리오, 학생 주도 컨퍼런스에 대해 설명합니다.`;
    customKeys = `IB 평가방식, ${program} 성적표, 루브릭 평가, 포트폴리오, 학생 주도 컨퍼런스, 형성평가`;
  } else if (file.includes('forms')) {
    category = '양식'; titleSuffix = '수행과제 템플릿';
    customDesc = `IB ${program} 수업에서 실제로 활용되는 각종 보고서, 성찰일지, 프로젝트 양식 및 템플릿 모음입니다.`;
    customKeys = `IB 수행과제, ${program} 양식, 성찰일지 템플릿, 프로젝트 보고서`;
  } else if (file.includes('parent')) {
    category = '자녀와 대화법'; titleSuffix = '학부모 가이드';
    customDesc = `IB ${program} 과정을 밟고 있는 자녀의 비판적 사고를 길러주기 위해 가정에서 할 수 있는 구체적인 질문과 대화법입니다.`;
    customKeys = `IB 학부모 가이드, 자녀 교육, 탐구적 질문, 가정 연계 학습`;
  } else if (file.includes('glossary')) {
    category = '전체 용어'; titleSuffix = '상세 사전';
    customDesc = `IB 전체 교육과정에서 사용되는 전문 용어들의 전체 목록 및 뜻풀이 사전입니다.`;
    customKeys = `IB 전체 용어, 국제 바칼로레아 사전, 전문 용어 해설`;
  } else {
    return;
  }
  
  // 1. Update Title
  const newTitle = `IB ${program} ${category} - ${titleSuffix} | 학부모 가이드`;
  content = content.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);
  
  // 2. Update Meta Description
  if (content.includes('<meta name="description"')) {
    content = content.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${customDesc}">`);
  } else {
    content = content.replace('<head>', `<head>\n<meta name="description" content="${customDesc}">`);
  }
  
  // 3. Update Meta Keywords
  if (content.includes('<meta name="keywords"')) {
    content = content.replace(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${customKeys}, IB, 국제 바칼로레아">`);
  } else {
    content = content.replace('<head>', `<head>\n<meta name="keywords" content="${customKeys}, IB, 국제 바칼로레아">`);
  }

  // 4. Inject Semantic SEO Footer Tag Block into body
  const seoFooterHtml = `
<section class="seo-tags" style="max-width: 1100px; margin: 40px auto; padding: 20px; background: var(--surface); border-radius: 12px; font-size: 12px; color: var(--text-soft); border: 1px dashed #ddd;">
  <strong style="color: var(--primary);">이 페이지의 핵심 탐색어:</strong> 
  ${customKeys.split(',').map(k => `<span style="display:inline-block; margin-right:8px; margin-top:4px;">#${k.trim()}</span>`).join('')} 
  <span style="display:inline-block; margin-right:8px; margin-top:4px;">#국제 바칼로레아 ${programKr}</span>
</section>
  `;
  
  if (!content.includes('class="seo-tags"')) {
    if (content.includes('<footer>')) {
      content = content.replace('<footer>', seoFooterHtml + '\n<footer>');
    } else {
      content = content.replace('</body>', seoFooterHtml + '\n</body>');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Deep SEO and UI layout updated successfully!');
