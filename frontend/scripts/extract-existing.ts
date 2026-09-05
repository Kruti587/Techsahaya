import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { HOME_TRANSLATIONS } from '../src/utils/homeTranslations.ts';
import { securityDictionary } from '../src/utils/securityTranslations.ts';
import { dpdpDictionary } from '../src/utils/dpdpTranslations.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, 'locales-data');

fs.writeFileSync(path.join(outDir, 'home.json'), JSON.stringify(HOME_TRANSLATIONS, null, 2), 'utf8');
console.log('✓ home.json written');

fs.writeFileSync(path.join(outDir, 'security.json'), JSON.stringify(securityDictionary, null, 2), 'utf8');
console.log('✓ security.json written');

fs.writeFileSync(path.join(outDir, 'dpdp.json'), JSON.stringify(dpdpDictionary, null, 2), 'utf8');
console.log('✓ dpdp.json written');
