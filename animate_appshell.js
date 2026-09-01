const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/AppShell.tsx', 'utf8');

if (!content.includes('import { AnimatePresence, motion } from "framer-motion";')) {
  content = content.replace(
    /import \{ Link, NavLink \} from "react-router-dom";/,
    `import { Link, NavLink } from "react-router-dom";\nimport { AnimatePresence, motion } from "framer-motion";`
  );
}

content = content.replace(
  /\{mobileOpen && \(\n\s*<div className="fixed inset-0 z-40 bg-slate-950\/40 lg:hidden" role="dialog" aria-modal="true">\n\s*<div className="h-full w-\[86vw\] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">/,
  `<AnimatePresence>
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" 
          role="dialog" 
          aria-modal="true"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div 
            initial={{ x: "-100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "-100%" }} 
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="h-full w-[86vw] max-w-sm overflow-y-auto bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >`
);

content = content.replace(
  /\{navContent\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/,
  `{navContent}\n          </motion.div>\n        </motion.div>\n      )}\n      </AnimatePresence>`
);

// Add motion to Guide Me button
content = content.replace(
  /className="hidden md:inline-flex items-center gap-2 px-3 py-1\.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition"/,
  `className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all hover:scale-105 active:scale-95"`
);

fs.writeFileSync('frontend/src/components/AppShell.tsx', content);
console.log('Added framer-motion to AppShell (mobile slide in)');
