const fs = require('fs');

const mypBlogHtml = `
<article class="seo-blog-post" style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
  <h2 style="font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 24px; letter-spacing: -0.5px;">중학교 학부모를 위한 IB MYP 교육과정 완전 정복</h2>
  
  <div style="font-size: 16px; color: var(--text); line-height: 1.8; word-break: keep-all;">
    <p style="margin-bottom: 20px;">자녀가 중학교에 진학하며 <strong>국제 바칼로레아(IB) MYP 과정</strong>을 만나게 되셨나요? 대한민국의 공교육 내에서도 대구, 제주, 경기 지역을 중심으로 <strong>IB 중학교</strong>가 빠르게 늘어나고 있습니다. 전통적인 암기식 교육에 익숙한 학부모님들께는 중간고사, 기말고사 대신 등장하는 다양한 <strong>수행과제</strong>와 낯선 <strong>평가방식</strong>이 다소 어렵게 느껴지실 수 있습니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--myp-dark, var(--coral-dark)); margin: 36px 0 16px;">1. IB MYP란 무엇인가요?</h3>
    <p style="margin-bottom: 20px;">MYP(Middle Years Programme)는 만 11세부터 16세 사이의 청소년을 위한 IB의 중등 교육과정입니다. 초등학교(PYP)에서 기른 탐구심을 바탕으로, 이제는 8개의 교과군(언어, 수학, 과학, 사회 등)을 깊이 있게 배우며 <strong>현실 세계와의 연결성</strong>을 찾습니다. 단순한 지식 습득을 넘어, 배운 내용을 실생활의 문제에 어떻게 적용할 수 있는지 고민하는 <strong>개념 기반 학습(Concept-based Learning)</strong>이 핵심입니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--myp-dark, var(--coral-dark)); margin: 36px 0 16px;">2. 암기 대신 '루브릭(Rubric)'으로 평가합니다</h3>
    <p style="margin-bottom: 20px;">IB 학교의 가장 큰 특징은 평가 방식입니다. 정답이 하나로 정해진 객관식 시험보다는, 학생 스스로 논리를 전개하고 결과물을 만들어내는 <strong>논술형 및 프로젝트형 총괄평가</strong>가 주를 이룹니다. 이때 선생님은 자의적으로 점수를 주는 것이 아니라, 학기 초에 미리 공개된 <strong>루브릭(평가 기준표)</strong>에 따라 매우 투명하게 학생의 성취도를 평가합니다. 따라서 학생들은 무엇을 향해 공부해야 하는지 정확히 알고 준비할 수 있습니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--myp-dark, var(--coral-dark)); margin: 36px 0 16px;">3. 학부모의 역할은 어떻게 달라져야 할까요?</h3>
    <p style="margin-bottom: 20px;">"오늘 학교에서 뭘 배웠니?"라는 질문 대신, <strong>"오늘 배운 내용에 대해 너는 어떻게 생각해?"</strong>라고 물어봐 주세요. MYP 과정에서는 정답을 맞히는 것보다 자신만의 관점(Perspective)을 세우는 것이 중요합니다. 아래에 정리된 8개의 가이드를 순서대로 읽어보시면, 자녀의 IB 교육을 지원하는 든든한 조력자가 되실 수 있을 것입니다.</p>
  </div>
</article>
<hr style="max-width: 80px; margin: 60px auto; border: none; border-top: 3px solid #eee;">
`;

const pypBlogHtml = `
<article class="seo-blog-post" style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
  <h2 style="font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 24px; letter-spacing: -0.5px;">초등학교 학부모를 위한 IB PYP 교육과정 완전 정복</h2>
  
  <div style="font-size: 16px; color: var(--text); line-height: 1.8; word-break: keep-all;">
    <p style="margin-bottom: 20px;">최근 대구, 제주, 경기 지역을 필두로 <strong>국제 바칼로레아(IB) 초등 프로그램인 PYP</strong>를 도입하는 학교가 급증하고 있습니다. 초등학생 자녀를 둔 학부모님들은 종종 "국어, 수학 교과서는 언제 배우나요?", "왜 매일 놀고 질문만 하는 것 같죠?"라는 궁금증을 가지게 됩니다. <strong>IB 초등학교</strong>의 수업은 우리가 경험했던 전통적인 수업 방식과 완전히 다르기 때문입니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--pyp-dark); margin: 36px 0 16px;">1. 과목의 벽을 허무는 6가지 초교과 주제 (UOI)</h3>
    <p style="margin-bottom: 20px;">PYP(Primary Years Programme)의 핵심은 <strong>초교과적 탐구(Transdisciplinary Inquiry)</strong>입니다. 1교시 국어, 2교시 수학처럼 과목을 분절하여 배우지 않습니다. 대신 1년 동안 <strong>'우리는 누구인가', '세계가 돌아가는 방식'</strong>과 같은 6개의 거대한 주제(UOI) 아래 모든 과목이 자연스럽게 융합됩니다. 예를 들어 환경 오염에 대해 배울 때, 과학으로 원리를 탐구하고, 국어로 캠페인 포스터를 만들며, 수학으로 쓰레기 배출량 그래프를 그리는 식입니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--pyp-dark); margin: 36px 0 16px;">2. 지식을 넘어선 실천 (Action) 중심의 교육</h3>
    <p style="margin-bottom: 20px;">IB PYP가 지향하는 것은 단순히 지식을 많이 아는 똑똑한 아이가 아니라, <strong>'세상을 긍정적으로 변화시키는 평생 학습자'</strong>입니다. 따라서 모든 탐구 단원의 끝에는 배운 것을 삶 속에서 직접 행동으로 옮기는 <strong>실천(Action)</strong> 단계가 따릅니다. 교실에서 배운 물 절약 방법을 집에서 스스로 실천하고 가족에게 설명하는 아이의 모습, 바로 이것이 PYP가 추구하는 진정한 성적표입니다.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: var(--pyp-dark); margin: 36px 0 16px;">3. 부모님은 최고의 탐구 파트너입니다</h3>
    <p style="margin-bottom: 20px;">가정통신문으로 낯선 용어들이 날아와도 당황하지 마세요. 평가 점수나 등수에 연연하기보다는, 아이가 오늘 어떤 흥미로운 질문을 던졌고 어떤 탐구를 주도했는지 <strong>과정 그 자체를 응원</strong>해 주시는 것이 중요합니다. 아래의 가이드를 통해 자녀의 PYP 학교생활을 속속들이 이해해 보세요.</p>
  </div>
</article>
<hr style="max-width: 80px; margin: 60px auto; border: none; border-top: 3px solid #eee;">
`;

// Inject into myp_index.html
if (fs.existsSync('myp_index.html')) {
  let mypHtml = fs.readFileSync('myp_index.html', 'utf8');
  if (!mypHtml.includes('seo-blog-post')) {
    // Inject right after the header, before the grid of chapters
    const injectPoint = /<\/header>\s*(<main[^>]*>)?/;
    const match = mypHtml.match(injectPoint);
    if (match) {
      mypHtml = mypHtml.replace(match[0], match[0] + '\n' + mypBlogHtml);
      fs.writeFileSync('myp_index.html', mypHtml, 'utf8');
    }
  }
}

// Inject into pyp_index.html
if (fs.existsSync('pyp_index.html')) {
  let pypHtml = fs.readFileSync('pyp_index.html', 'utf8');
  if (!pypHtml.includes('seo-blog-post')) {
    // Inject right after the header, before the grid of chapters
    const injectPoint = /<\/header>\s*(<main[^>]*>)?/;
    const match = pypHtml.match(injectPoint);
    if (match) {
      pypHtml = pypHtml.replace(match[0], match[0] + '\n' + pypBlogHtml);
      fs.writeFileSync('pyp_index.html', pypHtml, 'utf8');
    }
  }
}

console.log('Blog-style SEO narrative injected into MYP and PYP index pages!');
