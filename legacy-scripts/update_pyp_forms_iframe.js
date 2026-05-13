const fs = require('fs');

let pypForms = fs.readFileSync('pyp_forms.html', 'utf8');

// Replace all `<a class="form-link" ...>` with `<div class="form-item" data-form="...">`
pypForms = pypForms.replace(/<a class="form-link" href="([^"]+)" target="_blank">/g, '<div class="form-item clickable" data-form="$1">');
// Replace the closing `</a>` that corresponds to these form-links with `</div>`
pypForms = pypForms.replace(/<\/a>/g, (match, offset, str) => {
  // Only replace </a> if it's closing a form-item.
  // Actually, there are other <a> tags in toc-list and nav.
  // Let's use a smarter regex that replaces </a> only if preceded by the form item content.
  // Or just do a more controlled replacement.
  return match;
});

// A better way is to do it systematically.
pypForms = fs.readFileSync('pyp_forms.html', 'utf8');

// The snippet has <a class="form-link" href="..." target="_blank">
//   <div class="name">...</div>
//   <div class="def">...</div>
// </a>
// We can replace this block.

pypForms = pypForms.replace(/<a class="form-link" href="([^"]+)" target="_blank">([\s\S]*?)<\/a>/g, '<div class="form-item clickable" data-form="$1">$2</div>');


// Add CSS for iframe preview
const cssToInject = `
.form-item.clickable {
  cursor: pointer;
  padding: 16px;
  margin: 0 -16px;
  border-radius: 8px;
  border-bottom: 1px dashed var(--line);
  transition: background 0.15s;
}
.form-item.clickable:last-child { border-bottom: none; }
.form-item.clickable:hover { background: var(--pyp-pale); }
.form-item.clickable .name::after {
  content: '▼';
  margin-left: auto;
  color: var(--pyp);
  font-size: 14px;
  opacity: 0.5;
  transition: transform 0.3s, opacity 0.15s;
}
.form-item.clickable:hover .name::after { opacity: 1; }
.form-item.clickable.active .name::after { transform: rotate(180deg); opacity: 1; }

.form-item-preview {
  margin-top: 16px;
  width: 100%;
  height: 650px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: white;
  animation: slideDown 0.3s ease-out forwards;
}
.form-item-preview iframe {
  width: 100%;
  height: 100%;
  border: none;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

if (!pypForms.includes('.form-item-preview')) {
  pypForms = pypForms.replace('</style>', cssToInject + '\n</style>');
}

// Add the JS for iframe toggling
const jsToInject = `
<script>
document.querySelectorAll('.form-item.clickable').forEach(item => {
  item.addEventListener('click', function(e) {
    if(e.target.closest('.form-item-preview')) return; 

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
      } else {
        preview.style.display = 'block';
      }
    } else {
      this.classList.remove('active');
      let preview = this.querySelector('.form-item-preview');
      if (preview) preview.style.display = 'none';
    }
  });
});
</script>
`;

if (!pypForms.includes('document.querySelectorAll(\'.form-item')) {
  pypForms = pypForms.replace('</body>', jsToInject + '\n</body>');
}

fs.writeFileSync('pyp_forms.html', pypForms, 'utf8');
console.log("Updated pyp_forms.html to use MYP iframe preview format.");
