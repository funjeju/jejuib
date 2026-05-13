const fs = require('fs');

// 1. Rename index.html to myp_index.html
if (fs.existsSync('index.html')) {
  fs.renameSync('index.html', 'myp_index.html');
}

// 2. Read all HTML files to update nav links
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'ib_myp_parent_guide.html.bak' && f !== 'index.html');

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace href="index.html" with href="myp_index.html"
  content = content.replace(/href="index\.html"/g, 'href="myp_index.html"');

  // Add the back to portal link inside <nav> if it doesn't exist
  if (content.includes('<nav>') && !content.includes('IB 통합 안내서 대문으로 돌아가기')) {
    const navTop = `\n  <div style="background:#FFF4EF; padding:8px 24px; text-align:center; font-size:13px; border-bottom:1px solid #EFE5DD;">\n    <a href="index.html" style="color:#B85A3D; text-decoration:none; font-weight:600; display:inline-block; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">← IB 통합 안내서 대문으로 돌아가기</a>\n  </div>`;
    content = content.replace('<nav>', `<nav>${navTop}`);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

// 3. Update JS references
['glossary_data.js', 'add_glossary.js', 'generalize.js', 'split_site.js'].forEach(jsFile => {
  if (fs.existsSync(jsFile)) {
    let jsContent = fs.readFileSync(jsFile, 'utf8');
    jsContent = jsContent.replace(/'index\.html'/g, "'myp_index.html'");
    jsContent = jsContent.replace(/"index\.html"/g, '"myp_index.html"');
    fs.writeFileSync(jsFile, jsContent, 'utf8');
  }
});

// 4. Create the new global index.html
const portalHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>학부모를 위한 IB 통합 안내서</title>
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
<style>
  :root {
    --pyp: #F5A623; 
    --myp: #E07856; 
    --dp: #4A90E2; 
    --bg: #F8F9FA;
    --surface: #FFFFFF;
    --text: #2C3E50;
    --text-soft: #7F8C8D;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Pretendard Variable", sans-serif; }
  body { background-color: var(--bg); color: var(--text); line-height: 1.6; }
  
  .portal-header {
    text-align: center;
    padding: 100px 20px 50px;
  }
  .portal-header h1 {
    font-size: 46px;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 20px;
    letter-spacing: -1px;
  }
  .portal-header p {
    font-size: 19px;
    color: var(--text-soft);
    max-width: 650px;
    margin: 0 auto;
    word-break: keep-all;
  }
  
  .portal-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px 20px 100px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
  }
  
  .ib-card {
    background: var(--surface);
    border-radius: 24px;
    padding: 40px 32px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 2px solid transparent;
  }
  
  .ib-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }
  
  .ib-card.pyp:hover { border-color: var(--pyp); }
  .ib-card.myp:hover { border-color: var(--myp); }
  .ib-card.dp:hover { border-color: var(--dp); }
  
  .ib-card-badge {
    font-size: 14px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 100px;
    display: inline-block;
    align-self: flex-start;
    margin-bottom: 24px;
  }
  
  .ib-card.pyp .ib-card-badge { background: rgba(245, 166, 35, 0.15); color: #D68910; }
  .ib-card.myp .ib-card-badge { background: rgba(224, 120, 86, 0.15); color: var(--myp); }
  .ib-card.dp .ib-card-badge { background: rgba(74, 144, 226, 0.15); color: #3498DB; }
  
  .ib-card h2 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  
  .ib-card p {
    color: var(--text-soft);
    font-size: 16px;
    flex-grow: 1;
    margin-bottom: 30px;
    line-height: 1.7;
  }
  
  .ib-card-arrow {
    align-self: flex-end;
    width: 44px; height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f2f6;
    transition: all 0.3s;
    font-weight: bold;
    font-size: 18px;
  }
  .ib-card:hover .ib-card-arrow {
    color: #fff;
  }
  .ib-card.pyp:hover .ib-card-arrow { background: var(--pyp); }
  .ib-card.myp:hover .ib-card-arrow { background: var(--myp); }
  .ib-card.dp:hover .ib-card-arrow { background: var(--dp); }

  .status-tag {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
    background: #ecf0f1;
    color: #95a5a6;
  }
  .status-tag.ready {
    background: #e8f8f5;
    color: #27ae60;
  }
  
  @media (max-width: 768px) {
    .portal-header { padding: 60px 20px 30px; }
    .portal-header h1 { font-size: 36px; }
  }
</style>
</head>
<body>

<header class="portal-header">
  <h1>학부모를 위한 IB 안내서</h1>
  <p>국제 바칼로레아(IB) 프로그램의 복잡한 시스템과 교육 철학을<br>학부모의 눈높이에서 쉽게 풀어 설명합니다.</p>
</header>

<div class="portal-container">
  <!-- PYP Card -->
  <a href="pyp_index.html" class="ib-card pyp">
    <div class="status-tag">준비 중</div>
    <div class="ib-card-badge">초등학교 과정</div>
    <h2>IB PYP</h2>
    <p>놀이와 탐구를 통해 평생 학습자의 기초를 다지는 초등 프로그램 가이드. 자녀의 첫 IB 과정을 이해해 봅니다.</p>
    <div class="ib-card-arrow">→</div>
  </a>

  <!-- MYP Card -->
  <a href="myp_index.html" class="ib-card myp">
    <div class="status-tag ready">열람 가능</div>
    <div class="ib-card-badge">중학교 과정</div>
    <h2>IB MYP</h2>
    <p>개념적 이해와 현실 세계의 연결을 강조하는 중등 프로그램 가이드. 낯선 평가 방식과 프로젝트를 자세히 알아봅니다.</p>
    <div class="ib-card-arrow">→</div>
  </a>

  <!-- DP Card -->
  <a href="dp_index.html" class="ib-card dp">
    <div class="status-tag">준비 중</div>
    <div class="ib-card-badge">고등학교 과정</div>
    <h2>IB DP / CP</h2>
    <p>대학 진학과 심층 연구를 준비하는 고등 프로그램 가이드. 디플로마 취득 조건과 평가 체제를 분석합니다.</p>
    <div class="ib-card-arrow">→</div>
  </a>
</div>

</body>
</html>
`;

fs.writeFileSync('index.html', portalHtml, 'utf8');
console.log('Portal successfully created!');
