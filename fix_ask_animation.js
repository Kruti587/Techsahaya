const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/AskPage.tsx', 'utf8');

if (!c.includes('import { motion, AnimatePresence } from "framer-motion"')) {
  c = c.replace(
    /import React, \{ useState, useRef \} from "react";/,
    `import React, { useState, useRef } from "react";\nimport { motion, AnimatePresence } from "framer-motion";`
  );
}

c = c.replace(
  /<div className="mx-auto max-w-3xl space-y-8 pb-24">/,
  `<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-3xl space-y-8 pb-24">`
);
c = c.replace(
  /<\/div>\n\s*<\/div>\n\s*\);/,
  `</motion.div>\n    </div>\n  );`
);

c = c.replace(
  /\{response && \(\n\s*<div className="space-y-4 animate-in fade-in duration-300">/,
  `<AnimatePresence>
      {response && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="space-y-4"
        >`
);

let i = 0;
c = c.replace(/<\/div>\n\s*\)\}/g, match => {
  i++;
  if(i === 1) return '</motion.div>\n      )}\n      </AnimatePresence>';
  return match;
});

fs.writeFileSync('frontend/src/pages/AskPage.tsx', c);
console.log('Fixed AskPage');
