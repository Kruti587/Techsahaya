import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FooterWaves } from "./FooterWaves";
import { ShieldCheck, Mail, ExternalLink, Sparkles, Bell, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { t } from "../utils/i18n";
import { CookiePolicyModal } from "./CookiePolicyModal";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { AccessibilityModal } from "./AccessibilityModal";
import { CookiePreferencesModal } from "./CookiePreferencesModal";
import { api } from "../services/api";

export function Footer() {
  const { language } = useAppContext();
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  // Modals state
  const [cookieOpen, setCookieOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);

  const handleOpenEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-support-email"));
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = notifyEmail.trim();
    if (!targetEmail) return;

    try {
      await api.post("/api/newsletter/subscribe", { email: targetEmail });
      setNotified(true);
    } catch (err) {
      console.error("Failed to subscribe newsletter:", err);
      setNotified(true);
    }

    setTimeout(() => {
      setNotifyEmail("");
    }, 4000);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#0b1f18] text-[#f1f5f9] pt-12 border-t border-emerald-900/30">
      {/* Modal Dialogs */}
      <CookiePolicyModal
        isOpen={cookieOpen}
        onClose={() => setCookieOpen(false)}
        onOpenPreferences={() => setCookiePrefsOpen(true)}
      />
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <AccessibilityModal
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
      <CookiePreferencesModal
        isOpen={cookiePrefsOpen}
        onClose={() => setCookiePrefsOpen(false)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top grid: Tech Sahaya Brand on Left + Get Scheme Notifications Card on Right */}
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-white/10 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Left Column: Brand & Official Contacts */}
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 text-white">
              <Logo size={48} />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">
                  Tech Sahaya
                </span>
                <span className="text-sm text-emerald-400 font-semibold tracking-wide block">
                  {t(language, "footerTagline")}
                </span>
              </div>
            </Link>

            <p className="text-base text-slate-200 leading-relaxed max-w-lg">
              {t(language, "footerDesc")}
            </p>

            <div className="text-sm text-slate-300 space-y-1.5">
              <p>
                {t(language, "headquarters")}
              </p>
            </div>

            {/* Official Support Email */}
            <div className="pt-2 text-sm text-slate-300">
              <div className="flex flex-wrap items-center gap-2.5">
                <strong className="text-white font-semibold">{t(language, "emailSupportLabel")}</strong>
                <a
                  href="mailto:techsahaya.support@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-sm"
                >
                  techsahaya.support@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Replaced with Get Scheme & Renewal Notifications Widget */}
          <div className="rounded-3xl border border-emerald-600/40 bg-gradient-to-br from-emerald-950/70 to-[#071d15] p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-emerald-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sahaya-saffron/20 border border-sahaya-saffron/50 text-sahaya-saffron">
                <Bell size={17} />
              </div>
              <span>{t(language, "getSchemeNotifications")}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {t(language, "footerDesc")}
            </p>
            <form onSubmit={handleNotifySubmit} className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder={t(language, "enterEmailToNotify")}
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 rounded-xl border border-emerald-700/60 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 outline-none focus:border-sahaya-saffron focus:ring-2 focus:ring-sahaya-saffron transition"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sahaya-saffron px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-600 active:scale-95 transition"
              >
                <Mail size={16} />
                <span>{t(language, "notifyMe")}</span>
              </button>
            </form>
            {notified && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-semibold animate-fade-in bg-emerald-900/50 border border-emerald-600/40 p-2.5 rounded-xl">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>
                  {language === "hi"
                    ? "सदस्यता की पुष्टि हो गई! आपके इनबॉक्स में एक आधिकारिक पुष्टि ईमेल भेजा गया है।"
                    : language === "kn"
                    ? "ಚಂದಾದಾರಿಕೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್‌ಗೆ ಅಧಿಕೃತ ದೃಢೀಕರಣ ಇಮೇಲ್ ಕಳುಹಿಸಲಾಗಿದೆ."
                    : language === "te"
                    ? "సభ్యత్వం నిర్ధారించబడింది! మీ ఇన్‌బాక్స్‌కు అధికారిక నిర్ధారణ ఈమెయిల్ పంపబడింది."
                    : language === "ta"
                    ? "சந்தா உறுதிசெய்யப்பட்டது! உங்கள் இன்பாக்ஸுக்கு அதிகாரப்பூர்வ உறுதிப்படுத்தல் மின்னஞ்சல் அனுப்பப்பட்டுள்ளது."
                    : language === "ml"
                    ? "വരിക്കാരായത് സ്ഥിരീകരിച്ചു! നിങ്ങളുടെ ഇൻബോക്സിലേക്ക് ഔദ്യോഗിക സ്ഥിരീകരണ ഇമെയിൽ അയച്ചിട്ടുണ്ട്."
                    : language === "bn"
                    ? "সাবস্ক্রিপশন নিশ্চিত করা হয়েছে! আপনার ইনবক্সে একটি অফিসিয়াল নিশ্চিতকরণ ইমেল পাঠানো হয়েছে।"
                    : language === "mr"
                    ? "सदस्यत्व पुष्टी झाले! आपल्या इनबॉक्समध्ये अधिकृत पुष्टीकरण ईमेल पाठवला आहे."
                    : language === "gu"
                    ? "સબ્સ્ક્રિપ્શન કન્ફર્મ થયું! તમારા ઇનબૉક્સમાં સત્તાવાર પુષ્ટિ ઇમેઇલ મોકલવામાં આવ્યો છે."
                    : "Subscription confirmed! An official confirmation email has been sent to your inbox."}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 pt-1">
              <ShieldCheck size={16} className="shrink-0 text-emerald-400" />
              <span>{t(language, "zeroSpamGuarantee")}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: 4-Column Navigation Table with Bolder, Larger Text */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 py-12 border-b border-white/10" aria-label="Footer navigation">
          {/* Column 1: Citizen Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              {t(language, "citizenServices")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/eligibility" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "eligibilityChecker")}</Link></li>
              <li><Link to="/welfare-gaps" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "welfareGapsReport")}</Link></li>
              <li><Link to="/documents" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "digilockerVerification")}</Link></li>
              <li><Link to="/what-if" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "whatIfSimulation")}</Link></li>
              <li><Link to="/roadmap" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "interactiveRoadmap")}</Link></li>
            </ul>
          </div>

          {/* Column 2: PRODUCT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              {t(language, "product")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/how-it-works" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "howItWorks")}</Link></li>
              <li><Link to="/schemes" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "schemes")}</Link></li>
              <li><Link to="/security" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "securityPrivacy")}</Link></li>
              <li><Link to="/about" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">{t(language, "about")}</Link></li>
            </ul>
          </div>

          {/* Column 3: TRUST */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              {t(language, "trustAndCompliance")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/cookie-policy" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">
                  {t(language, "cookiePolicy")}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">
                  {t(language, "privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">
                  {t(language, "accessibility")}
                </Link>
              </li>
              <li>
                <Link to="/dpdp" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">
                  {t(language, "dpdpCompliance")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: YOUR CHOICES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              {t(language, "yourChoices")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setCookiePrefsOpen(true)}
                  className="text-emerald-300 hover:text-emerald-200 transition underline font-semibold text-left"
                >
                  {t(language, "manageCookiePreferences")}
                </button>
              </li>
              <li>
                <Link to="/consent-framework" className="text-slate-200 hover:text-white transition font-medium hover:translate-x-1 inline-block">
                  {t(language, "consentFramework")}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Bottom bar with Social Icons and Legal Links (No duplicate back to top!) */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            {language === "hi"
              ? "© 2026 टेक सहाय। नागरिक कल्याण और साइबर सुरक्षा के लिए डिजिटल सार्वजनिक मंच।"
              : language === "kn"
              ? "© 2026 ಟೆಕ್ ಸಹಾಯ. ನಾಗರಿಕ ಕಲ್ಯಾಣ ಮತ್ತು ಸೈಬರ್ ಭದ್ರತೆಗಾಗಿ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಸೇವೆ."
              : language === "te"
              ? "© 2026 టెక్ సహాయ. పౌర సంక్షేమం మరియు సైబర్ భద్రత కోసం డిజిటల్ ప్రజా వేదిక."
              : language === "ta"
              ? "© 2026 டெக் சகாயா. குடிமக்கள் நலம் மற்றும் சைபர் பாதுகாப்பிற்கான டிஜிட்டல் பொது சேவை."
              : language === "ml"
              ? "© 2026 ടെക് സഹായ. പൗരക്ഷേമത്തിനും സൈബർ സുരക്ഷയ്ക്കുമായുള്ള ഡിജിറ്റൽ പബ്ലിക് ഗുഡ്."
              : language === "bn"
              ? "© 2026 টেক সহায়। নাগরিক কল্যাণ ও সাইবার নিরাপত্তার জন্য ডিজিটাল পাবলিক প্ল্যাটফর্ম।"
              : language === "mr"
              ? "© 2026 टेक सहाया. नागरिक कल्याण आणि सायबर सुरक्षेसाठी डिजिटल सार्वजनिक व्यासपीठ."
              : language === "gu"
              ? "© 2026 ટેક સહાય. નાગરિક કલ્યાણ અને સાયબર સુરક્ષા માટે ડિજિટલ સાર્વજનિક મંચ."
              : "© 2026 Tech Sahaya. Digital Public Good for Citizen Welfare & Cybersecurity."}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {/* Social icons: LinkedIn & Gmail for Support */}
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] transition shadow-sm"
                aria-label="LinkedIn Support"
                title="LinkedIn Support"
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z" />
                </svg>
              </a>

              <button
                type="button"
                onClick={handleOpenEmail}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#ea4335] hover:text-white hover:border-[#ea4335] transition shadow-sm"
                aria-label="Gmail Support / Compose Email"
                title="Gmail Support / Compose Email"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </button>
            </div>

            {/* Legal policy shortcuts */}
            <div className="flex items-center gap-4">
              <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition">
                Privacy Policy
              </button>
              <button onClick={() => setCookieOpen(true)} className="hover:text-white transition">
                Cookie Policy
              </button>
              <button onClick={() => setAccessibilityOpen(true)} className="hover:text-white transition">
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Strip */}
      <div className="w-full overflow-hidden whitespace-nowrap py-3.5 border-t border-white/5 bg-[#071712] relative z-10">
        <div className="inline-flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-slate-400 animate-marquee-concepts">
          <span>PM-KISAN Samman Nidhi</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ayushman Bharat PM-JAY</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Pradhan Mantri Awas Yojana</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DigiLocker Verified Documents</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DPDP Privacy By Design</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>9 Official Indian Languages</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Direct Benefit Transfer (DBT)</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ration Card Watermark Verification</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Social Audit &amp; Accountability</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          {/* Loop duplicate */}
          <span>PM-KISAN Samman Nidhi</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ayushman Bharat PM-JAY</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Pradhan Mantri Awas Yojana</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DigiLocker Verified Documents</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DPDP Privacy By Design</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>9 Official Indian Languages</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Direct Benefit Transfer (DBT)</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
        </div>
      </div>

      {/* Animated waves (flush at bottom) */}
      <FooterWaves />
    </footer>
  );
}
