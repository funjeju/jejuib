const pypModalHtml = `
<div id="pyp-glossary-modal" class="g-modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(44,37,34,0.4); z-index:9999; justify-content:center; align-items:center; padding:20px;">
  <div class="g-modal-content" style="background:var(--surface); width:100%; max-width:480px; border-radius:16px; overflow:hidden; box-shadow:0 12px 32px rgba(0,0,0,0.15);">
    <div class="g-modal-header" style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; background:var(--pyp-pale);">
      <div>
        <h3 id="pg-modal-term" style="font-size:18px; font-weight:700; color:var(--text); margin:0;">Term</h3>
        <span class="g-modal-en" id="pg-modal-en" style="font-size:13px; color:var(--muted); font-weight:400;">English</span>
      </div>
      <button class="g-modal-close" onclick="closePypGlossaryModal()" style="background:none; border:none; font-size:24px; color:var(--muted); cursor:pointer;">&times;</button>
    </div>
    <div class="g-modal-body" id="pg-modal-def" style="padding:24px; font-size:15px; color:var(--text-soft); line-height:1.6;">Definition</div>
    <div class="g-modal-footer" style="padding:20px 24px; background:#FAFAFA; border-top:1px solid var(--line);">
      <h4 style="font-size:12.5px;color:var(--muted);margin-bottom:12px;margin-top:0;">이 용어가 사용된 페이지:</h4>
      <ul id="pg-modal-pages" class="g-modal-page-list" style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:8px;"></ul>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', pypModalHtml);

function closePypGlossaryModal() {
  document.getElementById('pyp-glossary-modal').style.display = 'none';
}

function openPypGlossaryModal(termId) {
  const termObj = pypGlossaryData.find(t => t.id === termId);
  if (!termObj) return;

  document.getElementById('pg-modal-term').innerHTML = termObj.term;
  document.getElementById('pg-modal-en').textContent = termObj.en || '';
  document.getElementById('pg-modal-def').innerHTML = termObj.def;
  
  const pagesList = document.getElementById('pg-modal-pages');
  pagesList.innerHTML = '';
  
  if (termObj.pages.length === 0) {
    pagesList.innerHTML = '<li style="font-size:13px; color:var(--text-soft);">이 용어가 내용 중에 사용된 페이지가 없습니다.</li>';
  } else {
    termObj.pages.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${p.file}" style="display:inline-block; padding:5px 12px; background:white; border:1px solid var(--line); border-radius:100px; font-size:13px; color:var(--text-soft); text-decoration:none;" onmouseover="this.style.borderColor='var(--pyp)'; this.style.color='var(--pyp-dark)'; this.style.background='var(--pyp-pale)'" onmouseout="this.style.borderColor='var(--line)'; this.style.color='var(--text-soft)'; this.style.background='white'">${p.title}</a>`;
      pagesList.appendChild(li);
    });
  }

  document.getElementById('pyp-glossary-modal').style.display = 'flex';
}

document.getElementById('pyp-glossary-modal').addEventListener('click', function(e) {
  if (e.target === this) closePypGlossaryModal();
});

function highlightPypTerms() {
  if (typeof pypGlossaryData === 'undefined') return;
  const allKeys = [];
  pypGlossaryData.forEach(t => {
    t.keys.forEach(k => {
      allKeys.push({ key: k, termId: t.id });
    });
  });
  allKeys.sort((a, b) => b.key.length - a.key.length);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tagName = parent.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'a' || tagName === 'nav' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || parent.classList.contains('pyp-highlight') || parent.closest('.gloss-item') || parent.closest('.g-modal-content') || parent.closest('.form-item') || parent.closest('.timeline-month') || parent.closest('.concept-card')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let node;
  while(node = walker.nextNode()) {
    if (node.nodeValue.trim() !== '') textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    let html = textNode.nodeValue;
    let modified = false;
    let placeholderMap = {};
    let counter = 0;

    for (const {key, termId} of allKeys) {
      const isEnglishShort = key.length <= 4 && /^[A-Za-z]+$/.test(key);
      const regexStr = isEnglishShort ? `\\b${key}\\b` : key;
      const regex = new RegExp(regexStr, 'g');
      
      html = html.replace(regex, (match) => {
        modified = true;
        const id = `__PG_PH_${counter++}__`;
        placeholderMap[id] = `<span class="pyp-highlight" onclick="openPypGlossaryModal('${termId}')" style="color:var(--pyp-dark); border-bottom:1px dashed var(--pyp); cursor:pointer; font-weight:500;" onmouseover="this.style.background='var(--pyp-pale)'" onmouseout="this.style.background='transparent'">${match}</span>`;
        return id;
      });
    }

    if (modified) {
      for (const [id, spanHtml] of Object.entries(placeholderMap)) {
        html = html.replace(new RegExp(id, 'g'), spanHtml);
      }
      const template = document.createElement('template');
      template.innerHTML = html;
      textNode.parentNode.replaceChild(template.content, textNode);
    }
  });
}

highlightPypTerms();

const pypSearch = document.getElementById('glossarySearch');
if (pypSearch) {
  const pypItems = document.querySelectorAll('.gloss-item');
  const pypNoResult = document.getElementById('noResult');
  pypSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    let visibleCount = 0;
    pypItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    if(pypNoResult) pypNoResult.style.display = visibleCount === 0 ? 'block' : 'none';
  });
}
