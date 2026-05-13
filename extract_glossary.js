const fs = require('fs');
const JSDOM = require('jsdom').JSDOM;

// We will read pyp_glossary.html, extract the list, and create pyp_glossary_data.js
const html = fs.readFileSync('pyp_glossary.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const glossItems = doc.querySelectorAll('.gloss-item');
const dataList = [];

glossItems.forEach(item => {
  const termEl = item.querySelector('.gloss-term');
  const enEl = item.querySelector('.en');
  
  let termClone = termEl.cloneNode(true);
  let stars = termClone.querySelectorAll('.star');
  stars.forEach(s => s.remove());
  let ens = termClone.querySelectorAll('.en');
  ens.forEach(e => e.remove());
  
  let term = termClone.textContent.trim();
  let en = enEl ? enEl.textContent.trim() : '';
  
  const defEl = item.querySelector('.gloss-def');
  let def = defEl ? defEl.innerHTML.trim() : '';
  
  const pagesList = [];
  const links = item.querySelectorAll('.gloss-pages a');
  links.forEach(a => {
    pagesList.push({ file: a.getAttribute('href'), title: a.textContent.trim() });
  });

  const keys = [term];
  if (term.includes(' / ')) {
    keys.push(...term.split(' / ').map(t => t.trim()));
  }

  dataList.push({
    term: term,
    en: en,
    def: def,
    keys: keys,
    pages: pagesList,
    id: term
  });
});

const dataFileContent = 'const pypGlossaryData = ' + JSON.stringify(dataList, null, 2) + ';';
fs.writeFileSync('pyp_glossary_data.js', dataFileContent, 'utf8');
console.log('Successfully generated pyp_glossary_data.js');
