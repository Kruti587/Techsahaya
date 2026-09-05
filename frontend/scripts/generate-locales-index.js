import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'bn', 'mr', 'gu'];
const namespaces = ['common', 'auth', 'howItWorks', 'home', 'schemes', 'security', 'dpdp'];

let code = `// Auto-generated 9-Language Locale Registry\n`;

for (const ns of namespaces) {
  for (const lang of languages) {
    code += `import ${ns}_${lang} from './${lang}/${ns}.json';\n`;
  }
}

code += `\nexport const LOCALES: Record<string, Record<string, any>> = {\n`;
for (const lang of languages) {
  code += `  ${lang}: {\n`;
  for (const ns of namespaces) {
    code += `    ${ns}: ${ns}_${lang},\n`;
  }
  code += `  },\n`;
}
code += `};\n\n`;

code += `export function getNamespacedLocale<T = any>(language: string, namespace: string): T {\n`;
code += `  const lang = LOCALES[language] ? language : 'en';\n`;
code += `  return (LOCALES[lang]?.[namespace] || LOCALES.en[namespace]) as T;\n`;
code += `}\n`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'locales', 'index.ts'), code, 'utf8');
console.log('✓ src/locales/index.ts generated');
