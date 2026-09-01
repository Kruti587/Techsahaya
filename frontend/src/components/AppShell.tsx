import { Bot, Bell, ChevronsLeft, ChevronsRight, CircleUser, Files, GitCompareArrows, HandHelping, LayoutDashboard, LogOut, Menu, MessageSquareText, Network, Search, ShieldCheck, UserCog, Users, WalletCards, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { t, type TranslationKey } from "../utils/i18n";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { SpotlightOverlay } from "./SpotlightOverlay";

type NavItem = {
  to: string;
  label?: string;
  labelKey?: TranslationKey;
  icon: typeof LayoutDashboard;
  tourId?: string;
};

const citizenNav: NavItem[] = [
  { to: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard, tourId: "nav-dashboard" },
  { to: "/chat", labelKey: "askSahaya", icon: MessageSquareText, tourId: "nav-chat" },
  { to: "/find-schemes", labelKey: "findBenefits", icon: Search, tourId: "nav-schemes" },
  { to: "/eligibility", labelKey: "eligibility", icon: WalletCards, tourId: "nav-eligibility" },
  { to: "/welfare-gaps", labelKey: "welfareGaps", icon: ShieldCheck, tourId: "nav-welfare-gaps" },
  { to: "/family", labelKey: "family", icon: Users, tourId: "nav-family" },
  { to: "/what-if", labelKey: "whatIf", icon: GitCompareArrows, tourId: "nav-what-if" },
  { to: "/documents", labelKey: "documents", icon: Files, tourId: "nav-documents" },
  { to: "/journey", labelKey: "welfareJourney", icon: Network, tourId: "nav-journey" },
  { to: "/notifications", labelKey: "notifications", icon: Bell, tourId: "nav-notifications" },
  { to: "/profile", labelKey: "profile", icon: CircleUser, tourId: "nav-profile" },
  { to: "/privacy", labelKey: "securityPrivacy", icon: UserCog, tourId: "nav-privacy" }
];

import { useLocation } from "react-router-dom";
import { GuidedTour, type TourStep } from "./GuidedTour";

const getTranslatedTourSteps = (lang: string): TourStep[] => {
  const isHi = lang === "hi";
  const isKn = lang === "kn";
  const isMr = lang === "mr";

  return [
    // --- PART 1: The Global Layout & Menu ---
    { route: "/dashboard", target: '[data-tour="nav-dashboard"]', message: isHi ? "आपका डैशबोर्ड! यहाँ आप अपनी प्रगति देख सकते हैं।" : isKn ? "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್! ಇಲ್ಲಿ ನೀವು ಪ್ರಗತಿಯನ್ನು ನೋಡಬಹುದು." : isMr ? "स्वागत आहे! चला एक मोठी टूर घेऊया. हा तुमचा डॅशबोर्ड मेनू आहे जिथे तुम्ही प्रगतीचा मागोवा घेऊ शकता." : "Welcome! Let's take a grand tour. This is your Dashboard menu where you can track progress.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-chat"]', message: isHi ? "'Ask Sahaya' पर क्लिक करें और मुझसे बात करें!" : isKn ? "'Ask Sahaya' ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ!" : isMr ? "माझ्याशी बोलण्यासाठी 'Ask Sahaya' वर क्लिक करा! कोणताही प्रश्न विचारण्यासाठी तुम्ही तुमचा आवाज वापरू शकता." : "Click 'Ask Sahaya' to talk to me! You can use your voice to ask any question.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-schemes"]', message: isHi ? "150+ सरकारी योजनाओं को खोजने के लिए 'Find Benefits' पर क्लिक करें।" : isKn ? "150+ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು 'Find Benefits' ಕ್ಲಿಕ್ ಮಾಡಿ." : isMr ? "150+ सरकारी योजना शोधण्यासाठी 'फायदे शोधा' वर क्लिक करा." : "Click 'Find Benefits' to search 150+ government schemes.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-eligibility"]', message: isHi ? "अपनी पात्रता जांचने के लिए यहाँ क्लिक करें।" : isKn ? "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ." : isMr ? "तुमच्या प्रोफाइल नियमांवर आधारित तुम्ही पात्र आहात की नाही हे तपासण्यासाठी 'पात्रता' वर क्लिक करा." : "Click 'Eligibility' to check if you qualify based on your profile rules.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-welfare-gaps"]', message: isHi ? "देखें कि आपको और कौन से लाभ मिल सकते हैं।" : isKn ? "ನಿಮಗೆ ಇನ್ನಷ್ಟು ಯಾವ ಸವಲತ್ತುಗಳು ಸಿಗಬಹುದು ಎಂದು ನೋಡಿ." : isMr ? "अधिक फायदे अनलॉक करण्यासाठी तुमच्याकडे कोणती कागदपत्रे गहाळ आहेत हे पाहण्यासाठी 'कल्याणकारी तफावत' वर क्लिक करा." : "Click 'Welfare Gaps' to see what documents you are missing to unlock more benefits.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-family"]', message: isHi ? "पारिवारिक योजनाओं के लिए सदस्यों को जोड़ें।" : isKn ? "ಕುಟುಂಬ ಯೋಜನೆಗಳಿಗಾಗಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ." : isMr ? "घरगुती योजनांसाठी कुटुंबातील सदस्यांना जोडण्यासाठी 'कुटुंब' वर क्लिक करा." : "Click 'Family' to add family members for household schemes.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-what-if"]', message: isHi ? "जीवन में बदलाव (जैसे नई नौकरी) का अनुकरण करें।" : isKn ? "ಜೀವನದಲ್ಲಿ ಬದಲಾವಣೆಗಳನ್ನು (ಹೊಸ ಕೆಲಸದಂತೆ) ಅನುಕರಿಸಿ." : "Click 'What-If' to simulate life changes (like getting a new job).", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-documents"]', message: isHi ? "अपने दस्तावेज़ सुरक्षित रूप से यहाँ अपलोड करें।" : isKn ? "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ." : isMr ? "तुमचे ओळख पुरावे सुरक्षितपणे अपलोड करण्यासाठी 'कागदपत्रे' वर क्लिक करा." : "Click 'Documents' to safely upload your identity proofs.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-journey"]', message: isHi ? "अपने पिछले आवेदनों को ट्रैक करें।" : isKn ? "ನಿಮ್ಮ ಹಿಂದಿನ ಅರ್ಜಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ." : isMr ? "तुमच्या मागील योजनेच्या अर्जांचा मागोवा घेण्यासाठी 'प्रवास' वर क्लिक करा." : "Click 'Journey' to track your past scheme applications.", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-profile"]', message: isHi ? "अपनी आयु, आय और राज्य अपडेट करें।" : isKn ? "ನಿಮ್ಮ ವಯಸ್ಸು, ಆದಾಯ ಮತ್ತು ರಾಜ್ಯವನ್ನು ನವೀಕರಿಸಿ." : "Click 'Profile' to update your personal details (age, income, state).", placement: "right" },
    { route: "/dashboard", target: '[data-tour="nav-privacy"]', message: isHi ? "अपनी गोपनीयता सेटिंग्स की समीक्षा करें।" : isKn ? "ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ." : isMr ? "तुमच्या गोपनीयता सेटिंग्जचे पुनरावलोकन करण्यासाठी 'सुरक्षा' वर क्लिक करा." : "Click 'Security' to review your privacy settings.", placement: "right" },
    { route: "/dashboard", target: 'input[placeholder*="Search"]', message: isHi ? "जल्दी से कुछ भी खोजने के लिए इसका उपयोग करें।" : isKn ? "ಏನನ್ನಾದರೂ ತ್ವರಿತವಾಗಿ ಹುಡುಕಲು ಇದನ್ನು ಬಳಸಿ." : isMr ? "काहीही पटकन शोधण्यासाठी शीर्षस्थानी हा शोध बार वापरा." : "Use this search bar at the top to quickly find anything.", placement: "bottom" },
    { route: "/dashboard", target: 'select', message: isHi ? "वेबसाइट की भाषा बदलने के लिए इस ड्रॉपडाउन का उपयोग करें।" : isKn ? "ವೆಬ್‌ಸೈಟ್ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಲು ಈ ಡ್ರಾಪ್‌ಡೌನ್ ಬಳಸಿ." : isMr ? "संपूर्ण वेबसाइटची भाषा त्वरित बदलण्यासाठी हा ड्रॉपडाउन वापरा." : "Use this dropdown to change the entire website's language instantly.", placement: "bottom" },
    
    // --- PART 2: Page Operations ---
    // Dashboard internals
    { route: "/dashboard", target: "h1", message: isHi ? "डैशबोर्ड के अंदर हम आपकी यात्रा को ट्रैक करते हैं।" : isKn ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಒಳಗೆ ನಾವು ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತೇವೆ." : isMr ? "येथे डॅशबोर्डच्या आत, आम्ही तुमच्या संपूर्ण कल्याणकारी प्रवासाचा मागोवा घेतो." : "Here inside the Dashboard, we track your complete welfare journey.", placement: "bottom" },
    { route: "/dashboard", target: "svg.w-32.h-32", message: isHi ? "यह आपकी प्रोफाइल तैयारी को 100% पर ट्रैक करता है!" : isKn ? "ಇದು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಿದ್ಧತೆಯನ್ನು 100% ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ!" : isMr ? "हे वर्तुळ तुमच्या प्रोफाईलच्या तयारीचा मागोवा घेते. सर्वोत्तम योजनेच्या जुळणीसाठी ते 100% ठेवा!" : "This circle tracks your Profile Readiness. Keep it at 100% for the best scheme matches!", placement: "right" },
    { route: "/dashboard", target: "h2:has(.lucide-check)", message: isHi ? "अपना खाता स्थापित करने के लिए इस चेकलिस्ट का पालन करें।" : isKn ? "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಹೊಂದಿಸಲು ಈ ಪರಿಶೀಲನಾಪಟ್ಟಿಯನ್ನು ಅನುಸರಿಸಿ." : isMr ? "तुमचे खाते पटकन सेट करण्यासाठी ही चेकलिस्ट फॉलो करा." : "Follow this checklist to quickly set up your account.", placement: "left" },
    
    // Chat internals
    { route: "/chat", target: "h1", message: isHi ? "अब हम Ask Sahaya में हैं! मैं आपका AI सहायक हूँ।" : isKn ? "ಈಗ ನಾವು Ask Sahaya ನಲ್ಲಿದ್ದೇವೆ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ." : isMr ? "आता आपण 'आस्क सहाय्य' मध्ये आहोत! मी तुमचा AI सहाय्यक आहे मदतीसाठी येथे आहे." : "Now we are in Ask Sahaya! I am your AI assistant here to help.", placement: "bottom" },
    { route: "/chat", target: "button:has(.lucide-mic)", message: isHi ? "मुझसे हिंदी में बात करने के लिए इस माइक्रोफोन बटन पर क्लिक करें!" : isKn ? "ನನ್ನೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಈ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ!" : isMr ? "माझ्याशी इंग्रजी, हिंदी किंवा कन्नडमध्ये बोलण्यासाठी या मायक्रोफोन बटणावर क्लिक करा!" : "Click this Microphone button to just speak to me in English, Hindi, or Kannada!", placement: "left" },
    
    // Find Schemes internals
    { route: "/find-schemes", target: ".grid-cols-2 select", message: isHi ? "श्रेणी और राज्य द्वारा योजनाओं को फ़िल्टर करने के लिए इनका उपयोग करें।" : isKn ? "ವರ್ಗ ಮತ್ತು ರಾಜ್ಯದ ಮೂಲಕ ಯೋಜನೆಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು ಇವುಗಳನ್ನು ಬಳಸಿ." : isMr ? "येथे फायदे शोधा मध्ये, श्रेणी आणि राज्यानुसार योजना फिल्टर करण्यासाठी या ड्रॉपडाउनचा वापर करा." : "Here in Find Benefits, use these dropdowns to filter schemes by Category and State.", placement: "bottom" },
    
    // Eligibility internals
    { route: "/eligibility", target: "select", message: isHi ? "पारदर्शी नियम जांच चलाने के लिए यहाँ एक योजना चुनें।" : isKn ? "ಪಾರದರ್ಶಕ ನಿಯಮ ಪರಿಶೀಲನೆಯನ್ನು ಚಲಾಯಿಸಲು ಇಲ್ಲಿ ಒಂದು ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ." : isMr ? "पात्रता इंजिनमध्ये, पारदर्शक नियम तपासणी चालवण्यासाठी येथे एक योजना निवडा." : "In the Eligibility Engine, select a scheme here to run a transparent rule check.", placement: "bottom" },
    { route: "/eligibility", target: "[data-tour='profile-save-button']", message: isHi ? "फिर यह देखने के लिए 'Check Eligibility' पर क्लिक करें कि क्या कमी है।" : isKn ? "ನಂತರ ಏನು ಕಾಣೆಯಾಗಿದೆ ಎಂದು ನೋಡಲು 'Check Eligibility' ಕ್ಲಿಕ್ ಮಾಡಿ." : isMr ? "मग तुम्हाला नक्की काय कमी आहे हे पाहण्यासाठी 'पात्रता तपासा' वर क्लिक करा." : "Then click 'Check Eligibility' to see exactly what you are missing.", placement: "top" },
    
    // Welfare Journey internals
    { route: "/journey", target: "h1", message: isHi ? "यहाँ आप अपने कल्याणकारी यात्रा के सभी चरणों को ट्रैक कर सकते हैं।" : isKn ? "ಇಲ್ಲಿ ನೀವು ನಿಮ್ಮ ಕಲ್ಯಾಣ ಪ್ರಯಾಣದ ಎಲ್ಲಾ ಹಂತಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು." : isMr ? "येथे कल्याण प्रवासात, तुमच्या अर्जाच्या प्रक्रियेच्या प्रत्येक टप्प्याचा मागोवा घ्या." : "Here in the Welfare Journey, track every step of your application process.", placement: "bottom" },
    { route: "/journey", target: "section.rounded-3xl", message: isHi ? "यह आपको दिखाएगा कि आप किस चरण में हैं, जैसे 'पात्रता' या 'स्वीकृति'।" : isKn ? "ಇದು ನೀವು ಯಾವ ಹಂತದಲ್ಲಿದ್ದೀರಿ ಎಂದು ತೋರಿಸುತ್ತದೆ." : isMr ? "हे तुम्हाला नेमके कोणत्या टप्प्यावर आहात हे दाखवते, जसे की 'पात्रता' किंवा 'मंजुरी'." : "This shows you exactly what stage you are in, like 'Eligibility' or 'Approval'.", placement: "bottom" },
    
    // Privacy internals
    { route: "/privacy", target: "h1", message: isHi ? "आपका गोपनीयता केंद्र! हम कभी भी अनावश्यक डेटा नहीं रखते।" : isKn ? "ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಕೇಂದ್ರ! ನಾವು ಅನಗತ್ಯ ಡೇಟಾವನ್ನು ಇಡುವುದಿಲ್ಲ." : isMr ? "तुमचे गोपनीयता केंद्र! आम्ही कधीही अनावश्यक डेटा ठेवत नाही." : "Your Privacy Center! We never keep unnecessary data.", placement: "bottom" },
    { route: "/privacy", target: "button.min-h-12", message: isHi ? "आप यहाँ से कभी भी अपना सारा डेटा डाउनलोड या डिलीट कर सकते हैं।" : isKn ? "ನೀವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಡಿಲೀಟ್ ಮಾಡಬಹುದು." : isMr ? "तुम्ही इथून कधीही तुमचा सर्व डेटा डाउनलोड करू शकता किंवा कायमचा हटवू शकता." : "You can download or permanently delete all your data from here at any time.", placement: "bottom" },

    // Notifications internals
    { route: "/notifications", target: "h1", message: isHi ? "आपके सभी महत्वपूर्ण अलर्ट यहाँ दिखाई देंगे।" : isKn ? "ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ." : isMr ? "तुमचे सर्व महत्त्वाचे अलर्ट आणि अंतिम मुदतीचे स्मरणपत्रे येथे दिसतील." : "All your important alerts and deadline reminders will appear here.", placement: "bottom" },

    // Profile internals
    { route: "/profile", target: "select#profile-language", message: isHi ? "अपनी पसंदीदा संचार भाषा यहाँ चुनें।" : isKn ? "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಸಂವಹನ ಭಾಷೆಯನ್ನು ಇಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ." : isMr ? "तुमची पसंतीची संवादाची भाषा येथे निवडा." : "Choose your preferred communication language here.", placement: "bottom" },
    { route: "/profile", target: ".bg-red-50", message: isHi ? "यह सूची दिखाती है कि हम आपका क्या डेटा *कभी* सेव नहीं करते (जैसे पूरा आधार)।" : isKn ? "ಈ ಪಟ್ಟಿಯು ಯಾವ ಸೂಕ್ಷ್ಮ ಡೇಟಾವನ್ನು ನಾವು ಸಂಪೂರ್ಣವಾಗಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ (ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಆಧಾರ್‌ನಂತೆ)." : isMr ? "ही यादी दर्शवते की आम्ही कोणता संवेदनशील डेटा अजिबात संग्रहित करत नाही (जसे की तुमचा संपूर्ण आधार)." : "This list shows what sensitive data we absolutely NEVER store (like your full Aadhaar).", placement: "left" },

    // Documents internals (Last step)
    { route: "/documents", target: "input[type='file']", message: isHi ? "अंत में, अपनी फ़ाइलें यहाँ सुरक्षित रूप से अपलोड करें।" : isKn ? "ಕೊನೆಯದಾಗಿ, ಡಾಕ್ಯುಮೆಂಟ್ ಕೇಂದ್ರದಲ್ಲಿ, ನಿಮ್ಮ ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಾವು ಮೆಮೊರಿಯಲ್ಲಿ ಡೇಟಾವನ್ನು ಹೊರತೆಗೆಯುತ್ತೇವೆ ಮತ್ತು ತಕ್ಷಣವೇ ಫೈಲ್ ಅನ್ನು ಅಳಿಸುತ್ತೇವೆ!" : isMr ? "शेवटी, दस्तऐवज केंद्रामध्ये, तुमच्या फायली सुरक्षितपणे येथे अपलोड करा. आम्ही इन-मेमरी डेटा काढतो आणि फाइल त्वरित हटवतो!" : "Finally, in the Document Center, upload your files securely here. We extract data in-memory and delete the file immediately!", placement: "top" }
  ];
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, language, setLanguage, notifications, logout } = useAppContext();

  const tLocal = (str: string) => {
    const d: Record<string, any> = {"Guide Me":{"hi":"मेरा मार्गदर्शन करें","kn":"ನನಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ","mr":"मला मार्गदर्शन करा"},"Citizen Account":{"hi":"नागरिक खाता","kn":"ನಾಗರಿಕ ಖಾತೆ","mr":"नागरिक खाते"},"Citizen":{"hi":"नागरिक","kn":"ನಾಗರಿಕ","mr":"नागरिक"},"Admin Account":{"hi":"एडमिन खाता","kn":"ನಿರ್ವಾಹಕ ಖಾತೆ","mr":"अॅडमिन खाते"},"Administrator":{"hi":"प्रशासक","kn":"ನಿರ್ವಾಹಕರು","mr":"प्रशासक"},"CSC Operator":{"hi":"सीएससी ऑपरेटर","kn":"ಸಿಎಸ್ಸಿ ಆಪರೇಟರ್","mr":"सीएससी ऑपरेटर"},"Search schemes, benefits, or ask a question...":{"hi":"योजनाएं, लाभ खोजें या कोई प्रश्न पूछें...","kn":"ಯೋಜನೆಗಳು, ಪ್ರಯೋಜನಗಳನ್ನು ಹುಡುಕಿ, ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಿ...","mr":"योजना, फायदे शोधा किंवा प्रश्न विचारा..."}};
    if (language === 'en' || !d[str] || !d[str][language]) return str;
    return d[str][language];
  };

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourActive, setTourActive] = useState(() => sessionStorage.getItem("techSahayaTourActive") === "true");

  useEffect(() => {
    if (tourActive) {
      sessionStorage.setItem("techSahayaTourActive", "true");
    } else {
      sessionStorage.removeItem("techSahayaTourActive");
      sessionStorage.removeItem("techSahayaTourStepIndex");
    }
  }, [tourActive]);

  // ... (keeping roleNav and navContent as is)
  const roleNav: NavItem[] = user?.role === "admin" ? [
    { to: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
    { to: "/admin/schemes", label: "Schemes", icon: Search },
    { to: "/admin/rules", label: "Rules", icon: ShieldCheck },
    { to: "/admin/sources", label: "Sources", icon: Files },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/audit", label: "Audit", icon: Bell }
  ] : user?.role === "csc_operator" ? [
    { to: "/csc/dashboard", label: "CSC Dashboard", icon: LayoutDashboard },
    { to: "/csc/citizen-session", label: "Citizen Session", icon: Users }
  ] : citizenNav;
  const labelFor = (item: { label?: string; labelKey?: TranslationKey }) => item.label || (item.labelKey ? t(language, item.labelKey) : "");

  const navContent = (
    <>
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((value) => !value)}
        className="mb-3 hidden min-h-12 w-full items-center justify-center rounded-lg border text-slate-700 lg:flex"
      >
        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>
      <nav className="space-y-2" aria-label="Main navigation">
        {roleNav.map((item) => {
          const Icon = item.icon;
          const label = labelFor(item);
          return (
          <NavLink
            key={item.to}
            to={item.to}
            data-tour={item.tourId}
            title={collapsed ? label : undefined}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition ${collapsed ? "justify-center" : ""} ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-700 hover:bg-stone-100 focus-visible:bg-stone-100"}`}
          >
            <Icon size={20} aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="text-sm font-semibold">{user?.full_name}</div>
          <div className="text-xs capitalize text-slate-600">{user?.role?.replace("_", " ")}</div>
          <button onClick={() => logout()} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-emerald-700 shadow-sm">
            <LogOut size={16} /> {t(language, "logout")}
          </button>
        </div>
      )}
    </>
  );

  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-0 relative">
      <SpotlightOverlay />
      {user?.role !== "admin" && <FloatingChatWidget />}

      {/* ... keeping header as is ... */}
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-blue-600 text-white lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <Link to="/dashboard" className="hidden lg:flex items-center gap-3 text-emerald-700">
              <div className="rounded-xl bg-emerald-500 p-2 text-white"><HandHelping size={20} /></div>
              <div>
                <div className="font-bold text-slate-900">Tech Sahaya</div>
                <div className="text-xs text-slate-500">{user?.role === "admin" ? t(language, "administration") : user?.role === "csc_operator" ? t(language, "cscAssistance") : t(language, "citizenPlatform")}</div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder={tLocal("Search schemes, benefits, or ask a question...")} className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setTourActive(true)} className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all hover:scale-105 active:scale-95">
              <Bot size={16} /> Guide Me
            </button>
            <select aria-label={t(language, "chooseLanguage")} className="min-h-10 rounded-full border px-3 text-sm bg-white font-medium" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="mr">मराठी</option>
            </select>
            <Link to="/notifications" aria-label={t(language, "openNotifications")} className="relative hidden min-h-10 min-w-10 items-center justify-center rounded-full bg-slate-100 sm:inline-flex hover:bg-slate-200 transition">
              <Bell size={18} className="text-slate-700" />
              {notifications.length > 0 && <span className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-red-500 px-1.5 text-[10px] font-bold text-white">{notifications.length}</span>}
            </Link>
            <div className="hidden text-right md:block ml-2">
              <div className="text-sm font-semibold text-slate-800">{user?.full_name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <button onClick={() => logout()} className="hidden min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold md:inline-flex hover:bg-slate-50 transition"><LogOut size={16} /> {t(language, "logout")}</button>
          </div>
        </div>
      </header>
      <div className={`mx-auto grid max-w-7xl gap-6 px-4 py-6 ${collapsed ? "lg:grid-cols-[84px_1fr]" : "lg:grid-cols-[260px_1fr]"}`}>
        <aside className="hidden rounded-lg bg-white p-3 shadow-card lg:block">
          {navContent}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="h-full w-[86vw] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-bold text-emerald-700">{t(language, "menu")}</div>
              <button onClick={() => setMobileOpen(false)} className="min-h-12 min-w-12 rounded-xl border" aria-label="Close menu"><X className="mx-auto" size={20} /></button>
            </div>
            {navContent}
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 gap-1 border-t bg-white p-2 lg:hidden" aria-label="Quick navigation">
        {roleNav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const label = labelFor(item);
          return (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center rounded-lg px-1 text-center text-[10px] font-semibold ${isActive ? "bg-emerald-600 text-white" : "text-slate-600"}`}>
            <Icon size={16} />
            {label}
          </NavLink>
          );
        })}
      </nav>

      {/* GuidedTour Mount Point */}
      {tourActive && <GuidedTour steps={getTranslatedTourSteps(language)} onComplete={() => setTourActive(false)} />}
    </div>
  );
}

