const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/DashboardPage.tsx', 'utf8');

// 1. Import motion
if (!content.includes('import { motion } from "framer-motion"')) {
  content = content.replace(
    /import \{ Link \} from "react-router-dom";/,
    `import { Link } from "react-router-dom";\nimport { motion } from "framer-motion";`
  );
}

// 2. Wrap main div
content = content.replace(
  /<div className="space-y-6 pb-24">/,
  `<motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24">`
);
content = content.replace(/<\/div>\n  \);\n\}/, `</motion.div>\n  );\n}`);

// 3. Stagger Readiness Factors
// readinessFactors map
content = content.replace(
  /\{readinessFactors\.map\(\(f, i\) => \(/g,
  `{readinessFactors.map((f, i) => (\n            <motion.div\n              initial={{ opacity: 0, scale: 0.95 }}\n              animate={{ opacity: 1, scale: 1 }}\n              transition={{ duration: 0.3, delay: i * 0.1 }}\n              key={i}`
);
content = content.replace(
  /<div key=\{i\} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">/g,
  `className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">`
);
content = content.replace(
  /<\/div>\n            \)\)\}/g,
  `</motion.div>\n            ))}`
);

// 4. Stagger Action Steps
content = content.replace(
  /\{steps\.map\(\(s, i\) => \(\n\s*<div key=\{s\.num\}/g,
  `{steps.map((s, i) => (\n              <motion.div \n                initial={{ opacity: 0, x: -20 }}\n                animate={{ opacity: 1, x: 0 }}\n                transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}\n                key={s.num}`
);
content = content.replace(
  /className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">/g,
  `className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">`
);
// wait the closing div of step map:
// </div>
// ))}
content = content.replace(
  /<\/Link>\n              <\/div>\n            \)\)\}/g,
  `</Link>\n              </motion.div>\n            ))}`
);

fs.writeFileSync('frontend/src/pages/DashboardPage.tsx', content);
console.log('Added framer-motion to DashboardPage');
