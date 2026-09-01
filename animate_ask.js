const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AskPage.tsx', 'utf8');

// 1. Import motion
if (!content.includes('import { motion } from "framer-motion"')) {
  content = content.replace(
    /import React, \{ useState, useRef \} from "react";/,
    `import React, { useState, useRef } from "react";\nimport { motion, AnimatePresence } from "framer-motion";`
  );
}

// 2. Wrap main container
content = content.replace(
  /<div className="mx-auto max-w-3xl space-y-8 pb-24">/,
  `<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-3xl space-y-8 pb-24">`
);
content = content.replace(
  /<\/div>\n\s*<\/div>\n\s*\);/,
  `</motion.div>\n    </div>\n  );`
);

// 3. Animate response card
content = content.replace(
  /\{response && \(\n\s*<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">/,
  `<AnimatePresence>\n        {response && (\n          <motion.div\n            initial={{ opacity: 0, scale: 0.95, y: 20 }}\n            animate={{ opacity: 1, scale: 1, y: 0 }}\n            exit={{ opacity: 0, scale: 0.95 }}\n            transition={{ type: "spring", bounce: 0, duration: 0.5 }}\n            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"\n          >`
);

content = content.replace(
  /<\/div>\n\s*\)\}/g,
  `</motion.div>\n        )}\n        </AnimatePresence>`
);

fs.writeFileSync('frontend/src/pages/AskPage.tsx', content);
console.log('Added framer-motion to AskPage');
