const fs = require('fs');
const path = 'frontend/src/components/AppShell.tsx';
let content = fs.readFileSync(path, 'utf8');

const dict = {
  "Guide Me": { hi: "मेरा मार्गदर्शन करें", kn: "ನನಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ", mr: "मला मार्गदर्शन करा" },
  "Citizen Account": { hi: "नागरिक खाता", kn: "ನಾಗರಿಕ ಖಾತೆ", mr: "नागरिक खाते" },
  "Citizen": { hi: "नागरिक", kn: "ನಾಗರಿಕ", mr: "नागरिक" },
  "Admin Account": { hi: "एडमिन खाता", kn: "ನಿರ್ವಾಹಕ ಖಾತೆ", mr: "अॅडमिन खाते" },
  "Administrator": { hi: "प्रशासक", kn: "ನಿರ್ವಾಹಕರು", mr: "प्रशासक" },
  "CSC Operator": { hi: "सीएससी ऑपरेटर", kn: "ಸಿಎಸ್ಸಿ ಆಪರೇಟರ್", mr: "सीएससी ऑपरेटर" },
  "Search schemes, benefits, or ask a question...": {
    hi: "योजनाएं, लाभ खोजें या कोई प्रश्न पूछें...",
    kn: "ಯೋಜನೆಗಳು, ಪ್ರಯೋಜನಗಳನ್ನು ಹುಡುಕಿ, ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    mr: "योजना, फायदे शोधा किंवा प्रश्न विचारा..."
  }
};

const injection = `
  const tLocal = (str: string) => {
    const d: Record<string, any> = ${JSON.stringify(dict)};
    if (language === 'en' || !d[str] || !d[str][language]) return str;
    return d[str][language];
  };
`;

if (!content.includes('const tLocal = ')) {
  content = content.replace(
    /const \{ language, setLanguage \} = useAppContext\(\);/,
    "const { language, setLanguage } = useAppContext();" + injection
  );

  content = content.replace(
    />Guide Me</g,
    '>{tLocal("Guide Me")}<'
  ).replace(
    /Citizen Account/g,
    '{tLocal("Citizen Account")}'
  ).replace(
    /<div className="text-xs text-slate-500">Citizen<\/div>/g,
    '<div className="text-xs text-slate-500">{tLocal("Citizen")}</div>'
  ).replace(
    /Admin Account/g,
    '{tLocal("Admin Account")}'
  ).replace(
    /Administrator/g,
    '{tLocal("Administrator")}'
  ).replace(
    /CSC Operator/g,
    '{tLocal("CSC Operator")}'
  ).replace(
    /Search schemes, benefits, or ask a question\.\.\./g,
    '{tLocal("Search schemes, benefits, or ask a question...")}'
  );

  fs.writeFileSync(path, content);
  console.log("Localized AppShell");
}
