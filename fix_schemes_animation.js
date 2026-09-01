const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/SchemesPage.tsx', 'utf8');

if (!content.includes('import { motion } from "framer-motion"')) {
  content = content.replace(
    /import \{ SchemeCard \} from "\.\.\/components\/SchemeCard";/,
    `import { SchemeCard } from "../components/SchemeCard";\nimport { motion } from "framer-motion";`
  );
}

content = content.replace(
  /return \(\n\s*<div className="space-y-6 pb-24">/,
  `return (\n    <motion.div\n      initial={{ opacity: 0, y: 15 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.4 }}\n      className="space-y-6 pb-24">`
);
content = content.replace(/<\/div>\n  \);\n\}/, `</motion.div>\n  );\n}`);

content = content.replace(
  /<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">/,
  `<motion.div\n        initial="hidden"\n        animate="visible"\n        variants={{\n          hidden: { opacity: 0 },\n          visible: {\n            opacity: 1,\n            transition: { staggerChildren: 0.05 }\n          }\n        }}\n        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">`
);

content = content.replace(
  /\{filtered\.map\(\(scheme\) => \(\n\s*<SchemeCard key=\{scheme\.id\} scheme=\{scheme\} \/>\n\s*\)\)\}/,
  `{filtered.map((scheme) => (\n          <motion.div\n            key={scheme.id}\n            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}\n          >\n            <SchemeCard scheme={scheme} />\n          </motion.div>\n        ))}`
);

content = content.replace(
  /<\/div>\n\s*\{filtered\.length === 0/,
  `</motion.div>\n      {filtered.length === 0`
);

fs.writeFileSync('frontend/src/pages/SchemesPage.tsx', content);
console.log('Fixed SchemesPage');
