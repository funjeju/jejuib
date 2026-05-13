const fs = require('fs');
const files = fs.readdirSync('.');
files.forEach(f => {
  if (f.startsWith('pyp_') && f.endsWith('.html') && f !== 'pyp_glossary.html') {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('pyp_glossary_ui.js')) {
      content = content.replace('</body>', '<script src="pyp_glossary_data.js"></script>\n<script src="pyp_glossary_ui.js"></script>\n</body>');
      fs.writeFileSync(f, content, 'utf8');
      console.log(`Injected scripts into ${f}`);
    }
  }
});
