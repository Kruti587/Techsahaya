const fs = require('fs');

const content = fs.readFileSync('frontend/src/utils/i18n.ts', 'utf8');

const enMatch = content.match(/en: \{([\s\S]*?)\n  \},/);
if (!enMatch) {
  console.log("English dict not found");
  process.exit(1);
}

const enDictStr = enMatch[1];
const kvRegex = /^\s*([a-zA-Z0-9_]+):\s*"(.*)",?$/gm;
let mrDict = {};
let match;
while ((match = kvRegex.exec(enDictStr)) !== null) {
  mrDict[match[1]] = match[2];
}

// Translate key terms to Marathi
const translations = {
  login: "लॉग इन",
  getStarted: "सुरू करा",
  dashboard: "डॅशबोर्ड",
  askSahaya: "सहाया विचारा",
  documents: "कागदपत्रे",
  privacy: "गोपनीयता",
  findBenefits: "फायदे शोधा",
  eligibility: "पात्रता",
  welfareGaps: "कल्याणकारी तफावत",
  family: "कुटुंब",
  notifications: "अधिसूचना",
  profile: "प्रोफाइल",
  citizenPlatform: "नागरिक प्लॅटफॉर्म",
  chooseLanguage: "भाषा निवडा",
  search: "शोधा",
  category: "श्रेणी",
  state: "राज्य",
  home: "मुख्य पृष्ठ",
  howItWorks: "हे कसे कार्य करते",
  schemes: "योजना",
  about: "आमच्याबद्दल",
  uploadDocument: "कागदपत्रे अपलोड करा",
  age: "वय",
  gender: "लिंग",
  income: "उत्पन्न"
};

for (const [k, v] of Object.entries(translations)) {
  if (mrDict[k]) mrDict[k] = v;
}

let mrBlock = "  mr: {\n";
for (const [k, v] of Object.entries(mrDict)) {
  mrBlock += `    ${k}: "${v.replace(/"/g, '\\"')}",\n`;
}
mrBlock += "  },";

const newContent = content.replace(/kn: \{[\s\S]*?\n  \},/, (match) => {
  return match + "\n" + mrBlock;
});

fs.writeFileSync('frontend/src/utils/i18n.ts', newContent);
console.log("Marathi dictionary added to i18n.ts");
