// Comprehensive Locale Generator for 9 Indian Languages:
// en, hi, kn, te, ta, ml, bn, mr, gu

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const languages = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'bn', 'mr', 'gu'];

// Ensure directories exist
languages.forEach(lang => {
  const dir = path.join(localesDir, lang);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Namespaces definition
const namespaces = ['common', 'auth', 'home', 'howItWorks', 'schemes', 'security', 'dpdp'];

console.log('Generating structured locales in:', localesDir);
