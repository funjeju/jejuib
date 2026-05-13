
const modalHtml = `
<div id="glossary-modal" class="g-modal-overlay" style="display:none;">
  <div class="g-modal-content">
    <div class="g-modal-header">
      <h3 id="g-modal-term">Term</h3>
      <span class="g-modal-en" id="g-modal-en">English</span>
      <button class="g-modal-close" onclick="closeGlossaryModal()">&times;</button>
    </div>
    <div class="g-modal-body" id="g-modal-def">Definition</div>
    <div class="g-modal-footer">
      <h4 style="font-size:12.5px;color:var(--muted);margin-bottom:12px;">이 용어가 사용된 페이지:</h4>
      <ul id="g-modal-pages" class="g-modal-page-list"></ul>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

function closeGlossaryModal() {
  document.getElementById('glossary-modal').style.display = 'none';
}

function openGlossaryModal(termId) {
  const termObj = glossaryData.find(t => t.id === termId);
  if (!termObj) return;

  document.getElementById('g-modal-term').textContent = termObj.term;
  document.getElementById('g-modal-en').textContent = termObj.en || '';
  document.getElementById('g-modal-def').textContent = termObj.def;
  
  const pagesList = document.getElementById('g-modal-pages');
  pagesList.innerHTML = '';
  
  if (termObj.pages.length === 0) {
    pagesList.innerHTML = '<li style="font-size:13px; color:var(--text-soft);">이 용어가 내용 중에 사용된 페이지가 없습니다.</li>';
  } else {
    termObj.pages.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${p.file}">${p.title}</a>`;
      pagesList.appendChild(li);
    });
  }

  document.getElementById('glossary-modal').style.display = 'flex';
}

document.getElementById('glossary-modal').addEventListener('click', function(e) {
  if (e.target === this) closeGlossaryModal();
});

function highlightTerms() {
  const allKeys = [];
  glossaryData.forEach(t => {
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
        // Do not highlight inside headers, navs, links, or already highlighted items
        if (tagName === 'script' || tagName === 'style' || tagName === 'a' || tagName === 'nav' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || parent.classList.contains('g-highlight') || parent.closest('.gloss-item') || parent.closest('.g-modal-content') || parent.closest('.form-item') || parent.closest('.timeline-month') || parent.closest('.concept-card')) {
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
        const id = `__G_PH_${counter++}__`;
        placeholderMap[id] = `<span class="g-highlight" onclick="openGlossaryModal('${termId}')">${match}</span>`;
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

highlightTerms();

// Update glossary list page if it exists
const glossaryListContainer = document.getElementById('glossaryList');
if (glossaryListContainer) {
  glossaryListContainer.innerHTML = '';
  const sorted = [...glossaryData].sort((a,b) => a.term.localeCompare(b.term));
  sorted.forEach(t => {
    let pagesHtml = '';
    if (t.pages.length > 0) {
      pagesHtml = '<div style="margin-top: 12px;"><span style="font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px;">이 용어가 사용된 페이지:</span><ul style="list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0;">';
      t.pages.forEach(p => {
        pagesHtml += `<li><a href="${p.file}" style="display:inline-block; padding:4px 10px; background:var(--surface); border:1px solid var(--line); border-radius:100px; font-size:12px; color:var(--text-soft); text-decoration:none;" onmouseover="this.style.borderColor='var(--coral)'; this.style.color='var(--coral-dark)'; this.style.background='var(--coral-pale)'" onmouseout="this.style.borderColor='var(--line)'; this.style.color='var(--text-soft)'; this.style.background='var(--surface)'">${p.title}</a></li>`;
      });
      pagesHtml += '</ul></div>';
    } else {
      pagesHtml = '<div style="margin-top: 12px;"><span style="font-size: 12px; color: var(--muted);">이 용어가 내용 중에 사용된 페이지가 없습니다.</span></div>';
    }

    glossaryListContainer.innerHTML += `
      <div class="gloss-item">
        <div class="gloss-term">${t.term}<span class="en">${t.en}</span></div>
        <div class="gloss-def">${t.def}</div>
        ${pagesHtml}
      </div>
    `;
  });
}
