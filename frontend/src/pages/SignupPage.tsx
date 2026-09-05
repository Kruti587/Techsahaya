import * as React from "react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { SUPPORTED_LANGUAGES } from "@/utils/languages";

interface SignupContent {
  badge: string;
  title: string;
  subtitle: string;
  featuresTitle: string;
  feature1: string;
  feature2: string;
  feature3: string;
  cardTitle: string;
  cardSubtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  languageLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  strengthLabel: string;
  weak: string;
  medium: string;
  strong: string;
  agreeTerms: string;
  privacyLink: string;
  submitBtn: string;
  creatingBtn: string;
  alreadyHaveAccount: string;
  signIn: string;
  successTitle: string;
  successMsg: string;
  mismatchError: string;
  passwordLengthError: string;
  fullNameError: string;
  consentError: string;
}

const SIGNUP_LOCALES: Record<string, SignupContent> = {
  en: {
    badge: "Official Citizen Registration",
    title: "Join Tech Sahaya",
    subtitle: "Direct access to over 80+ Central and State welfare schemes, eligibility discovery, and DBT status.",
    featuresTitle: "Why register with Tech Sahaya?",
    feature1: "Personalized scheme recommendations based on your family profile.",
    feature2: "100% DPDP Act 2023 compliant data sovereignty and privacy.",
    feature3: "Instant document validation and multi-language voice assistance.",
    cardTitle: "Create Citizen Account",
    cardSubtitle: "Enter your details to register and access welfare benefits.",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g. Ramesh Kumar",
    emailLabel: "Email Address",
    emailPlaceholder: "name@example.com",
    phoneLabel: "Phone Number (Optional)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "Preferred Language",
    passwordLabel: "Password",
    passwordPlaceholder: "Minimum 8 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter password",
    strengthLabel: "Password Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    agreeTerms: "I agree to the Digital Personal Data Protection terms and privacy notice.",
    privacyLink: "Privacy Policy",
    submitBtn: "Create Account",
    creatingBtn: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    successTitle: "Account Created Successfully!",
    successMsg: "Your citizen account has been registered. Redirecting to login...",
    mismatchError: "Passwords do not match.",
    passwordLengthError: "Password must be at least 8 characters long.",
    fullNameError: "Please enter your full name (minimum 2 characters).",
    consentError: "You must accept the DPDP terms and privacy notice to continue.",
  },
  hi: {
    badge: "आधिकारिक नागरिक पंजीकरण",
    title: "टेक सहाय से जुड़ें",
    subtitle: "80+ से अधिक केंद्र और राज्य कल्याणकारी योजनाओं, पात्रता खोज और डीबीटी स्थिति तक सीधी पहुंच।",
    featuresTitle: "टेक सहाय पर पंजीकरण क्यों करें?",
    feature1: "आपके पारिवारिक विवरण के आधार पर व्यक्तिगत योजना सिफारिशें।",
    feature2: "डीपीडीपी अधिनियम 2023 के तहत 100% डेटा गोपनीयता और सुरक्षा।",
    feature3: "दस्तावेज़ सत्यापन और 9 भाषाओं में आवाज़ सहायता।",
    cardTitle: "नागरिक खाता बनाएं",
    cardSubtitle: "योजनाओं का लाभ उठाने के लिए अपना विवरण दर्ज करें।",
    fullNameLabel: "पूरा नाम",
    fullNamePlaceholder: "जैसे: रमेश कुमार",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "name@example.com",
    phoneLabel: "फ़ोन नंबर (वैकल्पिक)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "पसंदीदा भाषा",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षर",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड पुनः दर्ज करें",
    strengthLabel: "पासवर्ड मजबूती",
    weak: "कमजोर",
    medium: "मध्यम",
    strong: "मजबूत",
    agreeTerms: "मैं डिजिटल व्यक्तिगत डेटा संरक्षण शर्तों और गोपनीयता सूचना से सहमत हूँ।",
    privacyLink: "गोपनीयता नीति",
    submitBtn: "खाता बनाएं",
    creatingBtn: "खाता बनाया जा रहा है...",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    signIn: "साइन इन करें",
    successTitle: "खाता सफलतापूर्वक बन गया!",
    successMsg: "आपका नागरिक खाता पंजीकृत हो गया है। लॉगिन पर ले जाया जा रहा है...",
    mismatchError: "पासवर्ड मेल नहीं खाते।",
    passwordLengthError: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    fullNameError: "कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर)।",
    consentError: "आगे बढ़ने के लिए कृपया गोपनीयता शर्तों को स्वीकार करें।",
  },
  kn: {
    badge: "ಅಧಿಕೃತ ನಾಗರಿಕ ನೋಂದಣಿ",
    title: "ಟೆಕ್ ಸಹಾಯಕ್ಕೆ ಸೇರಿ",
    subtitle: "80+ ಕ್ಕೂ ಹೆಚ್ಚು ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು ಮತ್ತು ಡಿಬಿಟಿ ಸೌಲಭ್ಯಗಳಿಗೆ ನೇರ ಪ್ರವೇಶ.",
    featuresTitle: "ಟೆಕ್ ಸಹಾಯದಲ್ಲಿ ಏಕೆ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬೇಕು?",
    feature1: "ನಿಮ್ಮ ಕುಟುಂಬದ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತಿಕ ಯೋಜನೆ ಶಿಫಾರಸುಗಳು.",
    feature2: "ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ 100% ಡೇಟಾ ಗೌಪ್ಯತೆ ಮತ್ತು ರಕ್ಷಣೆ.",
    feature3: "ದಾಖಲೆ ಪರಿಶೀಲನೆ ಮತ್ತು 9 ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ನೆರವು.",
    cardTitle: "ನಾಗರಿಕ ಖಾತೆ ರಚಿಸಿ",
    cardSubtitle: "ಯೋಜನೆಗಳ ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    fullNameLabel: "ಪೂರ್ಣ ಹೆಸರು",
    fullNamePlaceholder: "ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್",
    emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ಫೋನ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು",
    confirmPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    confirmPasswordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್ ಪುನಃ ನಮೂದಿಸಿ",
    strengthLabel: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ",
    weak: "ದುರ್ಬಲ",
    medium: "ಮಧ್ಯಮ",
    strong: "ಬಲವಾದ",
    agreeTerms: "ನಾನು ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ ಸೂಚನೆಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ.",
    privacyLink: "ಗೌಪ್ಯತೆ ನೀತಿ",
    submitBtn: "ಖಾತೆ ರಚಿಸಿ",
    creatingBtn: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    successTitle: "ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
    successMsg: "ನಿಮ್ಮ ಖಾತೆ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ಲಾಗಿನ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    mismatchError: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    passwordLengthError: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.",
    fullNameError: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳು).",
    consentError: "ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು ಗೌಪ್ಯತೆ ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ.",
  },
  te: {
    badge: "అధికారిక పౌర నమోదు",
    title: "టెక్ సహాయలో చేరండి",
    subtitle: "80+ కి పైగా కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలు మరియు డీబీటీ స్థితికి ప్రత్యక్ష ప్రాప్యత.",
    featuresTitle: "టెక్ సహాయలో ఎందుకు నమోదు చేసుకోవాలి?",
    feature1: "మీ కుటుంబ ప్రొఫైల్ ఆధారంగా వ్యక్తిగతీకరించిన పథకాల సిఫార్సులు.",
    feature2: "DPDP చట్టం 2023 కి అనుగుణంగా 100% డేటా గోప్యత.",
    feature3: "పత్రాల ధృవీకరణ మరియు 9 భాషలలో వాయిస్ సహాయం.",
    cardTitle: "పౌర ఖాతాను సృష్టించండి",
    cardSubtitle: "సంక్షేమ ప్రయోజనాలను పొందడానికి మీ వివరాలను నమోదు చేయండి.",
    fullNameLabel: "పూర్తి పేరు",
    fullNamePlaceholder: "ఉదా: రమేష్ కుమార్",
    emailLabel: "ఈమెయిల్ చిరునామా",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ఫోన్ నంబర్ (ఐచ్ఛికం)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "ప్రాధాన్య భాష",
    passwordLabel: "పాస్‌వర్డ్",
    passwordPlaceholder: "కనీసం 8 అక్షరాలు",
    confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
    confirmPasswordPlaceholder: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
    strengthLabel: "పాస్‌వర్డ్ బలం",
    weak: "బలహీనమైన",
    medium: "మధ్యస్థ",
    strong: "బలమైన",
    agreeTerms: "నేను డిజిటల్ వ్యక్తిగత డేటా రక్షణ నిబంధనలు మరియు గోప్యతా నోటీసుకు అంగీకరిస్తున్నాను.",
    privacyLink: "గోప్యతా విధానం",
    submitBtn: "ఖాతా సృష్టించండి",
    creatingBtn: "ఖాతా సృష్టించబడుతోంది...",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signIn: "సైన్ ఇన్ చేయండి",
    successTitle: "ఖాతా విజయవంతంగా సృష్టించబడింది!",
    successMsg: "మీ పౌర ఖాతా నమోదైంది. లాగిన్‌కు దారి మళ్లిస్తున్నాము...",
    mismatchError: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    passwordLengthError: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    fullNameError: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి (కనీసం 2 అక్షరాలు).",
    consentError: "కొనసాగడానికి దయచేసి గోప్యతా నిబంధనలను అంగీకరించండి.",
  },
  ta: {
    badge: "அதிகாரப்பூர்வ குடிமக்கள் பதிவு",
    title: "டெக் சகாயாவில் இணையுங்கள்",
    subtitle: "80+ க்கும் மேற்பட்ட மத்திய மற்றும் மாநில நலத்திட்டங்களுக்கான நேரடி அணுகல்.",
    featuresTitle: "டெக் சகாயாவில் ஏன் பதிவு செய்ய வேண்டும்?",
    feature1: "உங்கள் குடும்ப சுயவிவரத்தின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட திட்ட பரிந்துரைகள்.",
    feature2: "DPDP சட்டம் 2023 படி 100% தரவு தனியுரிமை மற்றும் பாதுகாப்பு.",
    feature3: "ஆவண சரிபார்ப்பு மற்றும் 9 மொழிகளில் குரல் உதவி.",
    cardTitle: "குடிமக்கள் கணக்கை உருவாக்கவும்",
    cardSubtitle: "நலத்திட்ட பலன்களைப் பெற உங்கள் விவரங்களை உள்ளிடவும்.",
    fullNameLabel: "முழு பெயர்",
    fullNamePlaceholder: "எ.கா: ரமேஷ் குமார்",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "name@example.com",
    phoneLabel: "தொலைபேசி எண் (விருப்பமானது)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "விருப்பமான மொழி",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "குறைந்தது 8 எழுத்துக்கள்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
    strengthLabel: "கடவுச்சொல் வலிமை",
    weak: "பலவீனமானது",
    medium: "நடுத்தரமானது",
    strong: "வலுவானது",
    agreeTerms: "டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு விதிமுறைகள் மற்றும் தனியுரிமை அறிவிப்பை ஏற்கிறேன்.",
    privacyLink: "தனியுரிமைக் கொள்கை",
    submitBtn: "கணக்கை உருவாக்கவும்",
    creatingBtn: "கணக்கு உருவாக்கப்படுகிறது...",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    signIn: "உள்நுழையவும்",
    successTitle: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!",
    successMsg: "உங்கள் கணக்கு பதிவு செய்யப்பட்டது. உள்நுழைவுக்கு திருப்பிவிடப்படுகிறது...",
    mismatchError: "கடவுச்சொற்கள் பொருந்தவில்லை.",
    passwordLengthError: "கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் நீளமாக இருக்க வேண்டும்.",
    fullNameError: "உங்கள் முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).",
    consentError: "தொடர தனியுரிமை விதிமுறைகளை ஏற்க வேண்டும்.",
  },
  ml: {
    badge: "ഔദ്യോഗിക പൗര രജിസ്ട്രേഷൻ",
    title: "ടെക് സഹായയിലേക്ക് സ്വാഗതം",
    subtitle: "80-ലധികം കേന്ദ്ര-സംസ്ഥാന ക്ഷേമപദ്ധതികളിലേക്കുള്ള നേരിട്ടുള്ള പ്രവേശനം.",
    featuresTitle: "എന്തുകൊണ്ട് ടെക് സഹായയിൽ രജിസ്റ്റർ ചെയ്യണം?",
    feature1: "നിങ്ങളുടെ കുടുംബ പ്രൊഫൈലിനെ അടിസ്ഥാനമാക്കിയുള്ള വ്യക്തിഗത ശുപാർശകൾ.",
    feature2: "DPDP നിയമം 2023 അനുസരിച്ചുള്ള സമ്പൂർണ്ണ ഡാറ്റാ സ്വകാര്യത.",
    feature3: "രേഖാ പരിശോധനയും 9 ഭാഷകളിലുള്ള ശബ്ദ സഹായവും.",
    cardTitle: "പൗര അക്കൗണ്ട് നിർമ്മിക്കുക",
    cardSubtitle: "ക്ഷേമ ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക.",
    fullNameLabel: "പൂർണ്ണ നാമം",
    fullNamePlaceholder: "ഉദാ: രമേഷ് കുമാർ",
    emailLabel: "ഇമെയിൽ വിലാസം",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ഫോൺ നമ്പർ (നിർബന്ധമില്ല)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "തിരഞ്ഞെടുത്ത ഭാഷ",
    passwordLabel: "പാസ്‌വേഡ്",
    passwordPlaceholder: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ",
    confirmPasswordLabel: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    confirmPasswordPlaceholder: "പാസ്‌വേഡ് വീണ്ടും നൽകുക",
    strengthLabel: "പാസ്‌വേഡ് ശക്തി",
    weak: "ദുർബലം",
    medium: "ഇടത്തരം",
    strong: "ശക്തം",
    agreeTerms: "ഡിജിറ്റൽ വ്യക്തിഗത വിവര സംരക്ഷണ നിബന്ധനകളും സ്വകാര്യതാ നയവും ഞാൻ അംഗീകരിക്കുന്നു.",
    privacyLink: "സ്വകാര്യതാ നയം",
    submitBtn: "അക്കൗണ്ട് നിർമ്മിക്കുക",
    creatingBtn: "അക്കൗണ്ട് നിർമ്മിക്കുന്നു...",
    alreadyHaveAccount: "മുമ്പേ അക്കൗണ്ട് ഉണ്ടോ?",
    signIn: "സൈൻ ഇൻ ചെയ്യുക",
    successTitle: "അക്കൗണ്ട് വിജയകരമായി നിർമ്മിച്ചു!",
    successMsg: "നിങ്ങളുടെ അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്തു. ലോഗിനിലേക്ക് മാറ്റുന്നു...",
    mismatchError: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",
    passwordLengthError: "പാസ്‌വേഡിന് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ ഉണ്ടായിരിക്കണം.",
    fullNameError: "ദയവായി പൂർണ്ണ നാമം നൽകുക (കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ).",
    consentError: "തുടരാൻ ദയവായി സ്വകാര്യതാ നിബന്ധനകൾ അംഗീകരിക്കുക.",
  },
  bn: {
    badge: "অফিসিয়াল নাগরিক নিবন্ধন",
    title: "টেক সহায়ে যোগ দিন",
    subtitle: "৮০+ এর বেশি কেন্দ্রীয় ও রাজ্য কল্যাণ প্রকল্পের সুবিধা নিন।",
    featuresTitle: "টেক সহায়ে কেন নিবন্ধন করবেন?",
    feature1: "আপনার পারিবারিক তথ্যের ওপর ভিত্তি করে সঠিক প্রকল্পের সুপারিশ।",
    feature2: "DPDP আইন ২০২৩ অনুসারে ১০০% ডেটা গোপনীয়তা ও সুরক্ষা।",
    feature3: "নথি যাচাইকরণ এবং ৯টি ভাষায় ভয়েস সহায়তা।",
    cardTitle: "নাগরিক অ্যাকাউন্ট তৈরি করুন",
    cardSubtitle: "কল্যাণমূলক সুবিধা পেতে আপনার বিবরণ লিখুন।",
    fullNameLabel: "সম্পূর্ণ নাম",
    fullNamePlaceholder: "যেমন: রমেশ কুমার",
    emailLabel: "ইমেল ঠিকানা",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ফোন নম্বর (ঐচ্ছিক)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "পছন্দের ভাষা",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "কমপক্ষে ৮টি অক্ষর",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "পাসওয়ার্ড পুনরায় লিখুন",
    strengthLabel: "পাসওয়ার্ডের শক্তি",
    weak: "দুর্বল",
    medium: "মাঝারি",
    strong: "শক্তিশালী",
    agreeTerms: "আমি ডিজিটাল ব্যক্তিগত তথ্য সুরক্ষা শর্তাবলী এবং গোপনীয়তা বিজ্ঞপ্তি মেনে নিচ্ছি।",
    privacyLink: "গোপনীয়তা নীতি",
    submitBtn: "অ্যাকাউন্ট তৈরি করুন",
    creatingBtn: "অ্যাকাউন্ট তৈরি করা হচ্ছে...",
    alreadyHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    signIn: "সাইন ইন করুন",
    successTitle: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
    successMsg: "আপনার অ্যাকাউন্ট নিবন্ধিত হয়েছে। লগইনে নিয়ে যাওয়া হচ্ছে...",
    mismatchError: "পাসওয়ার্ড মিলছে না।",
    passwordLengthError: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    fullNameError: "অনুগ্রহ করে আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)।",
    consentError: "এগিয়ে যেতে গোপনীয়তা নীতি স্বীকার করুন।",
  },
  mr: {
    badge: "अधिकृत नागरिक नोंदणी",
    title: "टेक सहायामध्ये सामील व्हा",
    subtitle: "८०+ हून अधिक केंद्र आणि राज्य कल्याणकारी योजनांचा थेट लाभ घ्या.",
    featuresTitle: "टेक सहायावर नोंदणी का करावी?",
    feature1: "आपल्या कौटुंबिक प्रोफाइलवर आधारित वैयक्तिक योजना शिफारसी.",
    feature2: "DPDP कायदा २०२३ नुसार १००% डेटा गोपनीयता आणि सुरक्षा.",
    feature3: "कागदपत्र पडताळणी आणि ९ भाषांमध्ये व्हॉईस सहाय्य.",
    cardTitle: "नागरीक खाते तयार करा",
    cardSubtitle: "कल्याणकारी योजनांचा लाभ घेण्यासाठी आपले तपशील भरा.",
    fullNameLabel: "पूर्ण नाव",
    fullNamePlaceholder: "उदा: रमेश कुमार",
    emailLabel: "ईमेल पत्ता",
    emailPlaceholder: "name@example.com",
    phoneLabel: "फोन नंबर (पर्यायी)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "पसंतीची भाषा",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "किमान ८ अक्षरे",
    confirmPasswordLabel: "पासवर्ड पुष्टी करा",
    confirmPasswordPlaceholder: "पासवर्ड पुन्हा प्रविष्ट करा",
    strengthLabel: "पासवर्ड सामर्थ्य",
    weak: "कमकुवत",
    medium: "मध्यम",
    strong: "मजबूत",
    agreeTerms: "मी डिजिटल वैयक्तिक डेटा संरक्षण अटी आणि गोपनीयता सूचना मान्य करतो/करते.",
    privacyLink: "गोपनीयता धोरण",
    submitBtn: "खाते तयार करा",
    creatingBtn: "खाते तयार होत आहे...",
    alreadyHaveAccount: "आधीपासूनच खाते आहे?",
    signIn: "साइन इन करा",
    successTitle: "खाते यशस्वीरित्या तयार झाले!",
    successMsg: "आपले खाते नोंदणीकृत झाले आहे. लॉगिन पृष्ठावर जात आहे...",
    mismatchError: "पासवर्ड जुळत नाहीत.",
    passwordLengthError: "पासवर्ड किमान ८ अक्षरांचा असावा.",
    fullNameError: "कृपया आपले पूर्ण नाव प्रविष्ट करा (किमान २ अक्षरे).",
    consentError: "कृपया पुढे जाण्यासाठी गोपनीयता अटी स्वीकारा.",
  },
  gu: {
    badge: "સત્તાવાર નાગરિક નોંધણી",
    title: "ટેક સહાય સાથે જોડાઓ",
    subtitle: "૮૦+ થી વધુ કેન્દ્ર અને રાજ્ય કલ્યાણકારી યોજનાઓનો સીધો લાભ મેળવો.",
    featuresTitle: "ટેક સહાય પર શા માટે નોંધણી કરવી?",
    feature1: "તમારી પારિવારિક માહિતીના આધારે વ્યક્તિગત યોજના ભલામણો.",
    feature2: "DPDP કાયદો ૨૦૨૩ હેઠળ ૧૦૦% ડેટા ગોપનીયતા અને સુરક્ષા.",
    feature3: "દસ્તાવેજ ચકાસણી અને ૯ ભાષાઓમાં વૉઇસ સહાય.",
    cardTitle: "નાગરિક એકાઉન્ટ બનાવો",
    cardSubtitle: "યોજનાઓનો લાભ મેળવવા માટે તમારી વિગતો દાખલ કરો.",
    fullNameLabel: "પૂરું નામ",
    fullNamePlaceholder: "દા.ત.: રમેશ કુમાર",
    emailLabel: "ઇમેઇલ સરનામું",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ફોન નંબર (વૈકલ્પિક)",
    phonePlaceholder: "+91 98765 43210",
    languageLabel: "પસંદગીની ભાષા",
    passwordLabel: "પાસવર્ડ",
    passwordPlaceholder: "ઓછામાં ઓછા ૮ અક્ષરો",
    confirmPasswordLabel: "પાસવર્ડની પુષ્ટિ કરો",
    confirmPasswordPlaceholder: "પાસવર્ડ ફરીથી દાખલ કરો",
    strengthLabel: "પાસવર્ડ મજબૂતી",
    weak: "નબળો",
    medium: "મધ્યમ",
    strong: "મજબૂત",
    agreeTerms: "હું ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન શરતો અને ગોપનીયતા સૂચના સાથે સંમત છું.",
    privacyLink: "ગોપનીયતા નીતિ",
    submitBtn: "એકાઉન્ટ બનાવો",
    creatingBtn: "એકાઉન્ટ બની રહ્યું છે...",
    alreadyHaveAccount: "પહેલેથી એકાઉન્ટ છે?",
    signIn: "સાઇન ઇન કરો",
    successTitle: "એકાઉન્ટ સફળતાપૂર્વક બની ગયું!",
    successMsg: "તમારું એકાઉન્ટ નોંધાઈ ગયું છે. લૉગિન પર રીડાયરેક્ટ થઈ રહ્યું છે...",
    mismatchError: "પાસવર્ડ મેળ ખાતા નથી.",
    passwordLengthError: "પાસવર્ડ ઓછામાં ઓછો ૮ અક્ષરોનો હોવો જોઈએ.",
    fullNameError: "કૃપા કરીને તમારું પૂરું નામ દાખલ કરો (ઓછામાં ઓછા ૨ અક્ષરો).",
    consentError: "આગળ વધવા માટે કૃપા કરીને ગોપનીયતા શરતો સ્વીકારો.",
  },
};

export function SignupPage() {
  const { signup, language, setLanguage } = useAppContext();
  const navigate = useNavigate();

  const copy = useMemo(() => {
    const langCode = (language || "en").slice(0, 2).toLowerCase();
    return SIGNUP_LOCALES[langCode] || SIGNUP_LOCALES.en;
  }, [language]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLang, setSelectedLang] = useState(language || "en");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate password strength
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (strengthScore <= 2) return copy.weak;
    if (strengthScore <= 4) return copy.medium;
    return copy.strong;
  }, [strengthScore, copy]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 2) return "bg-red-500 text-red-700";
    if (strengthScore <= 4) return "bg-amber-500 text-amber-700";
    return "bg-emerald-600 text-emerald-700";
  }, [strengthScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError(copy.fullNameError);
      return;
    }
    if (password.length < 8) {
      setError(copy.passwordLengthError);
      return;
    }
    if (password !== confirmPassword) {
      setError(copy.mismatchError);
      return;
    }
    if (!consentGiven) {
      setError(copy.consentError);
      return;
    }

    setLoading(true);
    try {
      const err = await signup({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        preferred_language: selectedLang,
        phone_number: phone.trim() || undefined,
        consent_given: consentGiven,
      });

      if (err) {
        setError(typeof err === "string" ? err : "Failed to create account. Please try again.");
      } else {
        setSuccess(true);
        setLanguage(selectedLang);
        setTimeout(() => {
          navigate("/login");
        }, 2200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-4 py-8 md:py-12">
      <div className="grid w-full max-w-5xl gap-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-card lg:grid-cols-[1.1fr_1.3fr] items-stretch">
        {/* Left Column: Branded Hero Panel */}
        <div className="rounded-3xl bg-sahaya-green p-8 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sahaya-saffron/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sahaya-saffron/20 border border-sahaya-saffron/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200">
              <ShieldCheck size={13} className="text-sahaya-saffron" />
              {copy.badge}
            </span>

            <h1 className="text-3xl font-bold font-serif mt-4 leading-tight text-white">
              {copy.title}
            </h1>
            <p className="mt-3 text-emerald-100 text-sm leading-relaxed">
              {copy.subtitle}
            </p>

            {/* Feature Points */}
            <div className="mt-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                {copy.featuresTitle}
              </p>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">{copy.feature1}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">{copy.feature2}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">{copy.feature3}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800/80 relative z-10">
            <p className="text-xs text-emerald-200/90 flex items-center gap-2">
              <Sparkles size={14} className="text-sahaya-saffron" />
              Digital Public Infrastructure &bull; Government of India
            </p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="flex flex-col justify-center py-2 px-1 sm:px-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-sahaya-saffron">
              {copy.badge}
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              {copy.cardTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {copy.cardSubtitle}
            </p>
          </div>

          {/* Success Banner */}
          {success ? (
            <div className="my-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-2 animate-fade-in shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sahaya-green">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-base font-bold text-emerald-950 font-serif">
                {copy.successTitle}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{copy.successMsg}</p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sahaya-green px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition"
                >
                  {copy.signIn} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {copy.fullNameLabel} <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={copy.fullNamePlaceholder}
                    className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-4 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {copy.emailLabel} <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-4 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Phone & Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {copy.phoneLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={copy.phonePlaceholder}
                      className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-4 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {copy.languageLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLang}
                      onChange={(e) => {
                        setSelectedLang(e.target.value);
                        setLanguage(e.target.value);
                      }}
                      className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-8 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20 bg-white cursor-pointer appearance-none"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.nativeLabel} ({l.label})
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {copy.passwordLabel} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={copy.passwordPlaceholder}
                      className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-10 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {copy.confirmPasswordLabel} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={copy.confirmPasswordPlaceholder}
                      className="h-11 w-full rounded-xl border border-stone-300 pl-10 pr-10 text-xs sm:text-sm shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                    <span>{copy.strengthLabel}:</span>
                    <span className="font-bold">{strengthLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore >= 1 ? strengthColor : "bg-transparent"
                      }`}
                      style={{ width: "33%" }}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore >= 3 ? strengthColor : "bg-transparent"
                      }`}
                      style={{ width: "33%" }}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore >= 5 ? strengthColor : "bg-transparent"
                      }`}
                      style={{ width: "34%" }}
                    />
                  </div>
                </div>
              )}

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-sahaya-green focus:ring-sahaya-green"
                />
                <span className="leading-relaxed">
                  {copy.agreeTerms}{" "}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    className="text-sahaya-green font-semibold underline hover:text-emerald-800"
                  >
                    {copy.privacyLink}
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-sm font-bold bg-sahaya-green hover:bg-emerald-900 text-white rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? copy.creatingBtn : copy.submitBtn}
              </button>
            </form>
          )}

          {/* Sign In Link */}
          <p className="text-center text-xs text-slate-600 border-t border-stone-100 pt-4 mt-4">
            {copy.alreadyHaveAccount}{" "}
            <Link to="/login" className="text-sahaya-green font-bold hover:underline">
              {copy.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
