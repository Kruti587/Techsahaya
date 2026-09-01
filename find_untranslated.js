const fs = require('fs');
const content = fs.readFileSync('frontend/src/utils/i18n.ts', 'utf8');
const enBlock = content.match(/en: \{([\s\S]*?)\n  \},/)[1];
const mrBlock = content.match(/mr: \{([\s\S]*?)\n  \}/)[1];

const enKeys = {};
enBlock.split('\n').forEach(l => {
  const m = l.match(/^\s*([a-zA-Z0-9_]+):\s*"(.*?)"/);
  if(m) enKeys[m[1]] = m[2];
});

const mrKeys = {};
mrBlock.split('\n').forEach(l => {
  const m = l.match(/^\s*([a-zA-Z0-9_]+):\s*"(.*?)"/);
  if(m) mrKeys[m[1]] = m[2];
});

const untranslated = Object.keys(enKeys).filter(k => !mrKeys[k] || mrKeys[k] === enKeys[k] || /[a-zA-Z]{4,}/.test(mrKeys[k]));
console.log('Total untranslated keys:', untranslated.length);
untranslated.forEach(k => console.log(k + ': ' + enKeys[k]));
