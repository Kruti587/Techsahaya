const fs = require('fs');
let c = fs.readFileSync('frontend/src/utils/i18n.ts', 'utf8');

const mrBlockRegex = /mr: \{([\s\S]*?)\n  \}/;
const mrMatch = c.match(mrBlockRegex);

if (mrMatch) {
  let mrBlock = mrMatch[1];
  
  mrBlock = mrBlock.replace(/heroTitle:\s*".*?"/, 'heroTitle: "योजना शोधा, पात्रता समजून घ्या, कागदपत्रे तयार करा आणि तुमचा कल्याणकारी प्रवास तुम्हाला समजणाऱ्या भाषेत पूर्ण करा."');
  mrBlock = mrBlock.replace(/whatNeverStored:\s*".*?"/, 'whatNeverStored: "काय कधीही साठवले जात नाही"');
  mrBlock = mrBlock.replace(/deletePersonalData:\s*".*?"/, 'deletePersonalData: "वैयक्तिक डेटा हटवा"');
  mrBlock = mrBlock.replace(/noWelfareGaps:\s*".*?"/, 'noWelfareGaps: "अद्याप कोणतेही गहाळ फायदे आढळले नाहीत."');
  mrBlock = mrBlock.replace(/whyItMatches:\s*".*?"/, 'whyItMatches: "हे तुमच्याशी का जुळते"');
  mrBlock = mrBlock.replace(/whyMissed:\s*".*?"/, 'whyMissed: "हे का चुकले असेल"');
  mrBlock = mrBlock.replace(/applicationSteps:\s*".*?"/, 'applicationSteps: "अर्ज करण्याच्या पायऱ्या"');
  
  c = c.replace(mrBlockRegex, `mr: {${mrBlock}\n  }`);
  fs.writeFileSync('frontend/src/utils/i18n.ts', c);
  console.log("Fixed the 7 failed keys");
} else {
  console.log("Could not find mr block");
}
