const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const languages = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'bn', 'mr', 'gu'];
const namespaces = ['common', 'auth', 'howItWorks', 'home', 'schemes', 'security', 'dpdp'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

console.log('--- Validating 9-Language Locale Key Parity ---');
let totalErrors = 0;

for (const ns of namespaces) {
  const enFile = path.join(localesDir, 'en', `${ns}.json`);
  if (!fs.existsSync(enFile)) {
    console.error(`Missing base English file: en/${ns}.json`);
    totalErrors++;
    continue;
  }

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  const enKeys = new Set(getKeys(enContent));

  for (const lang of languages) {
    if (lang === 'en') continue;
    const langFile = path.join(localesDir, lang, `${ns}.json`);
    if (!fs.existsSync(langFile)) {
      console.error(`[FAIL] ${lang}/${ns}.json does not exist!`);
      totalErrors++;
      continue;
    }

    const langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    const langKeys = new Set(getKeys(langContent));

    // Check missing keys
    const missingKeys = [...enKeys].filter(k => !langKeys.has(k));
    if (missingKeys.length > 0) {
      console.error(`[FAIL] ${lang}/${ns}.json is missing ${missingKeys.length} keys:`);
      console.error(missingKeys.slice(0, 10).map(k => `  - ${k}`).join('\n'));
      if (missingKeys.length > 10) console.error(`  ...and ${missingKeys.length - 10} more`);
      totalErrors += missingKeys.length;
    }
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ Validation failed with ${totalErrors} missing key errors across locales.`);
  process.exit(1);
} else {
  console.log(`\n✅ 100% key parity verified across all 9 languages and 7 namespaces!`);
  process.exit(0);
}
