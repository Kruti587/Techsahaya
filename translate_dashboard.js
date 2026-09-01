const fs = require('fs');

const path = 'frontend/src/pages/DashboardPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const dict = {
  "YOUR GATEWAY TO WELFARE ✨": {
    hi: "कल्याण का आपका द्वार ✨",
    kn: "ಕಲ್ಯಾಣದ ಕಡೆಗೆ ನಿಮ್ಮ ಹೆಬ್ಬಾಗಿಲು ✨",
    mr: "कल्याणकडे जाणारा आपला मार्ग ✨"
  },
  "Discover. Understand. Apply.": {
    hi: "खोजें। समझें। आवेदन करें।",
    kn: "ಹುಡುಕಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
    mr: "शोधा. समजून घ्या. अर्ज करा."
  },
  "Find government schemes, check eligibility, and track your progress — all in one place.": {
    hi: "सरकारी योजनाएं खोजें, पात्रता जांचें, और अपनी प्रगति को ट्रैक करें — सब कुछ एक ही स्थान पर।",
    kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ, ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಮತ್ತು ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ — ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.",
    mr: "सरकारी योजना शोधा, पात्रता तपासा आणि आपल्या प्रगतीचा मागोवा घ्या — सर्व एकाच ठिकाणी."
  },
  "Find Benefits": {
    hi: "फायदे खोजें",
    kn: "ಪ್ರಯೋಜನಗಳನ್ನು ಹುಡುಕಿ",
    mr: "फायदे शोधा"
  },
  "Ask by voice/text": {
    hi: "आवाज़/टेक्स्ट से पूछें",
    kn: "ಧ್ವನಿ/ಪಠ್ಯದಿಂದ ಕೇಳಿ",
    mr: "आवाज/मजकुराने विचारा"
  },
  "Complete profile details": {
    hi: "प्रोफ़ाइल विवरण पूरा करें",
    kn: "ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
    mr: "प्रोफाइल तपशील पूर्ण करा"
  },
  "Add age, state and occupation details": {
    hi: "आयु, राज्य और व्यवसाय का विवरण जोड़ें",
    kn: "ವಯಸ್ಸು, ರಾಜ್ಯ और वೃತ್ತಿಯ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ",
    mr: "वय, राज्य आणि व्यवसायाचा तपशील जोडा"
  },
  "Prepare required documents": {
    hi: "आवश्यक दस्तावेज़ तैयार करें",
    kn: "ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ತಯಾರಿಸಿ",
    mr: "आवश्यक कागदपत्रे तयार करा"
  },
  "Add identity and income verification documents": {
    hi: "पहचान और आय सत्यापन दस्तावेज़ जोड़ें",
    kn: "ಗುರುತು ಮತ್ತು ಆದಾಯ ಪರಿಶೀಲನೆ ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಿ",
    mr: "ओळख आणि उत्पन्न पडताळणी कागदपत्रे जोडा"
  },
  "Check eligibility": {
    hi: "पात्रता जांचें",
    kn: "ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    mr: "पात्रता तपासा"
  },
  "Evaluate schemes that match your profile": {
    hi: "अपनी प्रोफ़ाइल से मेल खाने वाली योजनाओं का मूल्यांकन करें",
    kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಹೊಂದುವ ಯೋಜನೆಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
    mr: "आपल्या प्रोफाइलशी जुळणाऱ्या योजनांचे मूल्यमापन करा"
  },
  "Explore family benefits": {
    hi: "पारिवारिक लाभ खोजें",
    kn: "ಕುಟುಂಬದ ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    mr: "कौटुंबिक फायदे एक्सप्लोर करा"
  },
  "Find schemes for your family members": {
    hi: "अपने परिवार के सदस्यों के लिए योजनाएं खोजें",
    kn: "ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    mr: "आपल्या कुटुंबातील सदस्यांसाठी योजना शोधा"
  },
  "Recommended for You": {
    hi: "आपके लिए अनुशंसित",
    kn: "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    mr: "तुमच्यासाठी शिफारस केलेले"
  },
  "Recent Applications": {
    hi: "हाल के आवेदन",
    kn: "ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳು",
    mr: "अलीकडील अर्ज"
  },
  "Quick Actions": {
    hi: "त्वरित कार्य",
    kn: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    mr: "त्वरित कृती"
  },
  "Ask Sahaya": {
    hi: "सहाया से पूछें",
    kn: "ಸಹಾಯವನ್ನು ಕೇಳಿ",
    mr: "सहाया विचारा"
  },
  "Upload Documents": {
    hi: "दस्तावेज़ अपलोड करें",
    kn: "ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    mr: "कागदपत्रे अपलोड करा"
  },
  "Track Application": {
    hi: "आवेदन ट्रैक करें",
    kn: "ಅರ್ಜಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    mr: "अर्जाचा मागोवा घ्या"
  },
  "Need help? Our AI assistant is here to guide you.": {
    hi: "मदद चाहिए? हमारा AI सहायक आपका मार्गदर्शन करने के लिए यहाँ है।",
    kn: "ಸಹಾಯ ಬೇಕೇ? ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಮ್ಮ AI ಸಹಾಯಕ ಇಲ್ಲಿದ್ದಾನೆ.",
    mr: "मदत हवी आहे? तुम्हाला मार्गदर्शन करण्यासाठी आमचा एआय सहाय्यक येथे आहे."
  },
  "Chat with Sahaya": {
    hi: "सहाया के साथ चैट करें",
    kn: "ಸಹಾಯದೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
    mr: "सहाया सोबत चॅट करा"
  },
  "View all": {
    hi: "सभी देखें",
    kn: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    mr: "सर्व पहा"
  },
  "Complete your profile to see recommendations.": {
    hi: "अनुशंसाएँ देखने के लिए अपनी प्रोफ़ाइल पूरी करें।",
    kn: "ಶಿಫಾರಸುಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ.",
    mr: "शिफारसी पाहण्यासाठी तुमचे प्रोफाइल पूर्ण करा."
  }
};

content = content.replace(
  'YOUR GATEWAY TO WELFARE ✨',
  '{tD("YOUR GATEWAY TO WELFARE ✨")}'
).replace(
  'Discover. Understand. Apply.',
  '{tD("Discover. Understand. Apply.")}'
).replace(
  'Find government schemes, check eligibility, and track your progress — all in one place.',
  '{tD("Find government schemes, check eligibility, and track your progress — all in one place.")}'
).replace(
  'Find Benefits <ArrowRight',
  '{tD("Find Benefits")} <ArrowRight'
).replace(
  'Ask by voice/text',
  '{tD("Ask by voice/text")}'
).replace(
  'Complete profile details',
  '{tD("Complete profile details")}'
).replace(
  'Add age, state and occupation details',
  '{tD("Add age, state and occupation details")}'
).replace(
  'Prepare required documents',
  '{tD("Prepare required documents")}'
).replace(
  'Add identity and income verification documents',
  '{tD("Add identity and income verification documents")}'
).replace(
  'Check eligibility',
  '{tD("Check eligibility")}'
).replace(
  'Evaluate schemes that match your profile',
  '{tD("Evaluate schemes that match your profile")}'
).replace(
  'Explore family benefits',
  '{tD("Explore family benefits")}'
).replace(
  'Find schemes for your family members',
  '{tD("Find schemes for your family members")}'
).replace(
  'Recommended for You',
  '{tD("Recommended for You")}'
).replace(
  'Recent Applications',
  '{tD("Recent Applications")}'
).replace(
  'Quick Actions',
  '{tD("Quick Actions")}'
).replace(
  'Ask Sahaya',
  '{tD("Ask Sahaya")}'
).replace(
  'Upload Documents',
  '{tD("Upload Documents")}'
).replace(
  'Track Application',
  '{tD("Track Application")}'
).replace(
  'Need help? Our AI assistant is here to guide you.',
  '{tD("Need help? Our AI assistant is here to guide you.")}'
).replace(
  'Chat with Sahaya <ArrowRight',
  '{tD("Chat with Sahaya")} <ArrowRight'
).replace(
  />View all </g,
  '>{tD("View all")} <'
).replace(
  '>Complete your profile to see recommendations.<',
  '>{tD("Complete your profile to see recommendations.")}<'
);

const injection = `
  const { language } = useAppContext();
  const tD = (str: string) => {
    const d: Record<string, any> = ${JSON.stringify(dict)};
    if (language === 'en' || !d[str] || !d[str][language]) return str;
    return d[str][language];
  };
`;

content = content.replace(
  /const \[recommendations, setRecommendations\] = useState<any\[\]>\(\[\]\);/,
  "const [recommendations, setRecommendations] = useState<any[]>([]);" + injection
);

fs.writeFileSync(path, content);
console.log('Dashboard text localized successfully (fixed).');
