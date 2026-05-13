const fs = require('fs');

const fullNavHtml = `
<nav style="position: sticky; top: 0; background: rgba(255, 251, 248, 0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); z-index: 100;">
  <div style="background:var(--pyp-pale, #FFF7E6); padding:8px 24px; text-align:center; font-size:13px; border-bottom:1px solid var(--line, #EFE5DD);">
    <a href="index.html" style="color:var(--pyp-dark, #D68910); text-decoration:none; font-weight:600; display:inline-block; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">← IB 통합 안내서 대문으로 돌아가기</a>
  </div>
  <div class="nav-inner" style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; height: 60px;">
    <div class="logo"><a href="pyp_index.html" style="color:var(--pyp-dark, #D68910); text-decoration:none; font-weight:700; font-size: 15px;">IB PYP 안내</a></div>
    <div class="nav-links" style="display:flex; gap:20px; font-size:14px; font-weight: 500;">
      <a href="pyp_bigpic.html" style="text-decoration:none; color:inherit;">큰 그림</a>
      <a href="pyp_cycle.html" style="text-decoration:none; color:inherit;">수업 진행</a>
      <a href="pyp_timeline.html" style="text-decoration:none; color:inherit;">1년 흐름</a>
      <a href="pyp_concepts.html" style="text-decoration:none; color:inherit;">개념 사전</a>
      <a href="pyp_evaluation.html" style="text-decoration:none; color:inherit;">평가</a>
      <a href="pyp_forms.html" style="text-decoration:none; color:inherit;">양식</a>
      <a href="pyp_parent.html" style="text-decoration:none; color:inherit;">자녀와 대화</a>
      <a href="pyp_glossary.html" style="text-decoration:none; color:inherit;">용어</a>
    </div>
  </div>
</nav>
`;

// Fix pyp_index.html
if (fs.existsSync('pyp_index.html')) {
  let html = fs.readFileSync('pyp_index.html', 'utf8');
  html = html.replace(/<nav>[\s\S]*?<\/nav>/, fullNavHtml);
  fs.writeFileSync('pyp_index.html', html, 'utf8');
}

// Fix pyp_forms.html
if (fs.existsSync('pyp_forms.html')) {
  let html = fs.readFileSync('pyp_forms.html', 'utf8');
  html = html.replace(/<nav>[\s\S]*?<\/nav>/, fullNavHtml);
  fs.writeFileSync('pyp_forms.html', html, 'utf8');
}

console.log("Re-injected full top menu navigation into PYP index and forms.");
