const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/DashboardPage.tsx', 'utf8');
c = c.replace(/import \{ Link \} from "react-router-dom";/, 'import { Link } from "react-router-dom";\nimport { motion } from "framer-motion";');
c = c.replace(/<div className="space-y-6 pb-24">/, '<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 pb-24">');
c = c.replace(/<\/div>\n  \);\n\}/, '</motion.div>\n  );\n}');

c = c.replace(/<div key=\{i\} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">/g, '<motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">');

let i = 0;
c = c.replace(/<\/div>\n            \)\)\}/g, match => {
  i++;
  if(i === 1) return '</motion.div>\n            ))}';
  return match;
});

c = c.replace(/<div key=\{s\.num\} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">/g, '<motion.div key={s.num} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 + (s.num * 0.1) }} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">');

c = c.replace(/<\/Link>\n              <\/div>\n            \)\)\}/g, '</Link>\n              </motion.div>\n            ))}');

fs.writeFileSync('frontend/src/pages/DashboardPage.tsx', c);
console.log('Fixed DashboardPage');
