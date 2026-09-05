const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const languages = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'bn', 'mr', 'gu'];

languages.forEach(lang => {
  const dir = path.join(localesDir, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. COMMON
const common = require('./locales-data/common.json');
// 2. AUTH
const auth = require('./locales-data/auth.json');
// 3. HOW IT WORKS
const howItWorks = require('./locales-data/howItWorks.json');
// 4. HOME
const home = require('./locales-data/home.json');
// 5. SCHEMES
const schemes = require('./locales-data/schemes.json');
// 6. SECURITY
const security = require('./locales-data/security.json');
// 7. DPDP
const dpdp = require('./locales-data/dpdp.json');

const datasets = { common, auth, howItWorks, home, schemes, security, dpdp };

Object.entries(datasets).forEach(([ns, data]) => {
  languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, `${ns}.json`);
    const content = data[lang] || data['en'];
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  });
  console.log(`✓ Generated ${ns}.json across all 9 languages`);
});
