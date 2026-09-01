const fs = require('fs');
let content = fs.readFileSync('frontend/src/utils/i18n.ts', 'utf8');

const mrMatch = content.match(/mr: \{([\s\S]*?)\n  \}/);
if (!mrMatch) {
  console.log("mr block not found");
  process.exit(1);
}

let mrStr = mrMatch[1];

const manual = {
  dashboard: 'डॅशबोर्ड',
  askSahaya: 'सहाया विचारा',
  checkEligibility: 'पात्रता तपासा',
  logout: 'बाहेर पडा',
  search: 'शोधा',
  category: 'श्रेणी',
  about: 'आमच्याबद्दल',
  farmers: 'शेतकरी',
  womenAndGirl: 'महिला आणि मुली',
  students: 'विद्यार्थी',
  workersGroup: 'कामगार',
  familiesGroup: 'कुटुंबे',
  schemeDiscoverySubtitle: 'सध्याच्या सत्यापित कॅटलॉगमध्ये शोधा आणि शेतकरी, महिला, विद्यार्थी आणि इतरांसाठी फिल्टर वापरा.'
};

for (const [k, v] of Object.entries(manual)) {
  const regex = new RegExp('^\\s*' + k + ':\\s*".*?",?$', 'm');
  if (mrStr.match(regex)) {
    mrStr = mrStr.replace(regex, '    ' + k + ': "' + v + '",');
  } else {
    mrStr += '\n    ' + k + ': "' + v + '",';
  }
}

content = content.replace(mrMatch[1], mrStr);
fs.writeFileSync('frontend/src/utils/i18n.ts', content);
console.log('Fixed mr missing words');
