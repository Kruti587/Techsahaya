const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/DashboardPage.tsx', 'utf8');
c = c.replace(/"\{tD\("(.*?)"\)\}"/g, 'tD("$1")');
fs.writeFileSync('frontend/src/pages/DashboardPage.tsx', c);
console.log('Fixed syntax errors');
