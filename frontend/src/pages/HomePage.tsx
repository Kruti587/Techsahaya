import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSearch2,
  HelpCircle,
  Languages,
  Mic,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { t } from "../utils/i18n";

export function HomePage() {
  const { language, personas, loadPersona, user } = useAppContext();

  // Localized headline and descriptions
  const heroHeadlines: Record<string, { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string }> = {
    en: {
      title: "You should never have to ask “am I eligible?”",
      subtitle:
        "Tech Sahaya reads your household once and then tells you, unprompted, every government scheme you and your family already qualify for, in your language, with the official rule quoted beside it.",
      ctaPrimary: "See what I qualify for",
      ctaSecondary: "Browse verified schemes",
    },
    hi: {
      title: "आपको कभी यह नहीं पूछना पड़ेगा “क्या मैं पात्र हूँ?”",
      subtitle:
        "टेक सहाय आपके परिवार की जानकारी को समझकर बिना पूछे बताता है कि आप और आपका परिवार किस सरकारी योजना के पात्र हैं, आपकी भाषा में, आधिकारिक नियमों के साथ।",
      ctaPrimary: "देखें मैं किस योजना का पात्र हूँ",
      ctaSecondary: "सत्यापित योजनाएं देखें",
    },
    kn: {
      title: "ನೀವು ಎಂದಿಗೂ “ನಾನು ಅರ್ಹನೇ?” ಎಂದು ಕೇಳಬೇಕಾಗಿಲ್ಲ",
      subtitle:
        "ಟೆಕ್ ಸಹಾಯ ನಿಮ್ಮ ಕುಟುಂಬದ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ನೀವು ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರು ಎಂಬುದನ್ನು ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಅಧಿಕೃತ ನಿಯಮಗಳೊಂದಿಗೆ ತಿಳಿಸುತ್ತದೆ.",
      ctaPrimary: "ನಾನು ಯಾವುದಕ್ಕೆ ಅರ್ಹನೆಂದು ನೋಡಿ",
      ctaSecondary: "ಪರಿಶೀಲಿಸಿದ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    },
  };

  const copy = heroHeadlines[language] || heroHeadlines.en;

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 md:py-12">
      {/* Hero Section matching Screenshot 2 */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] xl:gap-14">
        {/* Left Column: Headlines, CTA & Stats */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sahaya-green">
            <Sparkles size={14} className="text-sahaya-saffron" />
            <span>Digital Citizen Welfare Infrastructure</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] font-serif leading-[1.15]">
            {copy.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
            {copy.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={user ? "/eligibility" : "/signup"}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#0f3d2e] px-6 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-900 active:scale-95"
            >
              <span>{copy.ctaPrimary}</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/schemes"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-stone-50 active:scale-95"
            >
              {copy.ctaSecondary}
            </Link>
          </div>

          {/* 3 Metrics Stats Row */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">9</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">languages, with voice</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">0</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">documents ever stored</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">9</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">audited reasoning stages</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image with Floating Notification Card */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl border border-stone-200 bg-stone-100 aspect-[4/3] sm:aspect-[4/3] relative">
            <img
              src="/hero-lakshmi.jpg"
              alt="Indian citizen checking welfare scheme eligibility on smartphone"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />

            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating Notification Badge Card (Lakshmi Unprompted) */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-2xl border border-white/30 bg-stone-900/85 p-3.5 text-white backdrop-blur-md shadow-2xl animate-fade-in">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Bell size={13} className="text-amber-400" />
                <span>PUSHED TO LAKSHMI, UNPROMPTED</span>
              </div>
              <p className="mt-1 text-xs font-medium leading-snug text-stone-100">
                Kavya (age 7) became eligible for <strong>Sukanya Samriddhi</strong> when you added her to your household.
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Rule engine &bull; high confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Hero Section matching Screenshot 2 */}
      <section className="rounded-3xl border border-stone-200 bg-stone-100/70 p-8 md:p-12 space-y-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Most welfare goes unclaimed because nobody knew to ask for it.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            So we inverted the question. You do not search a catalogue; the catalogue is evaluated against you and your family the moment your profile changes.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <Languages size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">9 Indian Languages</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full native interface in English, Hindi, Kannada, Telugu, Tamil, Malayalam, Bengali, Marathi, and Gujarati.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <Mic size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Voice-First Queries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak naturally about schemes, eligibility, and documents powered by Sarvam AI voice integration.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <FileSearch2 size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Explainable Eligibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic rule evaluation explains exactly which condition passed, which failed, and how to qualify.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Zero-Storage Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              DPDP Act compliant. No raw Aadhaar storage, masked document metadata, and revocable consent.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Persona Exploration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">Explore Instant Sample Households</h3>
            <p className="text-xs text-slate-600">Simulate how scheme recommendations adapt to diverse citizen situations.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(personas).map(([key, persona]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPersona(key)}
              className="min-h-12 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-sahaya-green hover:shadow-md active:scale-95"
            >
              <div className="font-bold text-sm text-slate-900">{persona.label}</div>
              <div className="mt-1 text-xs text-slate-500">
                Click to load this profile and explore verified recommendations.
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
            <HelpCircle size={16} />
            <span>{language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : language === "kn" ? "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು" : "Frequently Asked Questions"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2">
            {language === "hi"
              ? "नागरिक कल्याण और गोपनीयता से जुड़े सवाल"
              : language === "kn"
              ? "ನಾಗರಿಕ ಕಲ್ಯಾಣ ಮತ್ತು ಗೌಪ್ಯತೆಯ ಪ್ರಶ್ನೆಗಳು"
              : "Everything you need to know about Tech Sahaya"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {language === "hi"
              ? "डीपीडीपी अनुपालन, पारिवारिक पात्रता और दस्तावेज़ सत्यापन के बारे में विस्तृत जानकारी।"
              : language === "kn"
              ? "ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ, ಕುಟುಂಬದ ಅರ್ಹತೆ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆಯ ವಿವರವಾದ ಮಾಹಿತಿ."
              : "Clear answers on our DPDP-compliant privacy architecture, family benefit inheritance, and official scheme applications."}
          </p>
        </div>

        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50">
          {[
            {
              q:
                language === "hi"
                  ? "टेक सहाय डीपीडीपी अधिनियम 2023 के तहत मेरी गोपनीयता की सुरक्षा कैसे करता है?"
                  : language === "kn"
                  ? "ಟೆಕ್ ಸಹಾಯ ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆಯಡಿ ನನ್ನ ಖಾಸಗಿತನವನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತದೆ?"
                  : "How does Tech Sahaya protect my personal privacy under the DPDP Act 2023?",
              a:
                language === "hi"
                  ? "टेक सहाय केवल इन-मेमोरी (रैम) में दस्तावेज़ों की जांच करता है और तुरंत मिटा देता है। हम कभी भी आपका आधार नंबर, पैन नंबर या बायोमेट्रिक्स अपने सर्वर पर स्टोर नहीं करते हैं।"
                  : language === "kn"
                  ? "ಟೆಕ್ ಸಹಾಯ ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಕೇವಲ ಇನ್-ಮೆಮೊರಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ ತಕ್ಷಣವೇ ಅಳಿಸುತ್ತದೆ. ಯಾವುದೇ ಆಧಾರ್, ಪ್ಯಾನ್ ಅಥವಾ ಬಯೋಮೆಟ್ರಿಕ್ ವಿವರಗಳನ್ನು ಶೇಖರಿಸಿಡುವುದಿಲ್ಲ."
                  : "Tech Sahaya strictly complies with India's Digital Personal Data Protection (DPDP) Act. All documents uploaded for eligibility verification are processed ephemerally in RAM and immediately discarded. No Aadhaar or PAN numbers, biometric records, or raw files are ever stored on disk.",
            },
            {
              q:
                language === "hi"
                  ? "पारिवारिक लाभ कैसे काम करता है यदि सदस्यों के पास अलग दस्तावेज़ नहीं हैं?"
                  : language === "kn"
                  ? "ಕುಟುಂಬದ ಸದಸ್ಯರ ಬಳಿ ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗಳಿಲ್ಲದಿದ್ದರೆ ಕುಟುಂಬ ಪ್ರಯೋಜನಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ?"
                  : "How does Family Benefits matching work if members do not have separate documents?",
              a:
                language === "hi"
                  ? "भारतीय परिवारों में राशन कार्ड, जमीन का रिकॉर्ड और निवास प्रमाण पत्र मुख्य आवेदक का होता है। टेक सहाय परिवार के सदस्यों को वही सत्यापित दस्तावेज साझा करता है और उनकी उम्र व लिंग के आधार पर योजनाएं (जैसे सुकन्या समृद्धि, छात्रवृत्ति या वृद्धावस्था पेंशन) ढूंढता है।"
                  : language === "kn"
                  ? "ಭಾರತೀಯ ಕುಟುಂಬಗಳಲ್ಲಿ ರೇಷನ್ ಕಾರ್ಡ್ ಮತ್ತು ಜಮೀನು ದಾಖಲೆಗಳು ಮುಖ್ಯಸ್ಥರ ಹೆಸರಿನಲ್ಲಿರುತ್ತವೆ. ಟೆಕ್ ಸಹಾಯ ಆ ದಾಖಲೆಗಳನ್ನು ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಅನ್ವಯಿಸಿ, ವಯಸ್ಸು ಮತ್ತು ಲಿಂಗಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿಸುತ್ತದೆ."
                  : "In Indian households, documents like Ration Cards and Land Records belong to the household file. Tech Sahaya allows family members to inherit the household's verified state, income bracket, and ration credentials, evaluating individual eligibility based on age, gender, and relationship without requiring duplicate documents.",
            },
            {
              q:
                language === "hi"
                  ? "ऑटो-भरे हुए पीडीएफ (Auto-Filled PDF) आवेदन क्या है?"
                  : language === "kn"
                  ? "ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಿದ ಪಿಡಿಎಫ್ (Auto-Filled PDF) ಅರ್ಜಿ ಎಂದರೇನು?"
                  : "What is the Auto-Filled PDF Application feature?",
              a:
                language === "hi"
                  ? "जब आपकी प्रोफ़ाइल सत्यापित हो जाती है, तो आप किसी भी योजना के लिए भारत सरकार का आधिकारिक आवेदन पत्र एक क्लिक में ऑटो-भरकर डाउनलोड या प्रिंट कर सकते हैं और सीएससी केंद्र या सरकारी पोर्टल पर जमा कर सकते हैं।"
                  : language === "kn"
                  ? "ನಿಮ್ಮ ವಿವರಗಳು ಪರಿಶೀಲನೆಯಾದ ನಂತರ, ನೀವು ಯಾವುದೇ ಯೋಜನೆಗೆ ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಅರ್ಜಿ ನಮೂನೆಯನ್ನು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಪ್ರಿಂಟ್ ಮಾಡಿಕೊಂಡು ಸಲ್ಲಿಸಬಹುದು."
                  : "Once your profile details are verified, Tech Sahaya generates an official Government of India Scheme Application Form pre-filled with your verified credentials. You can download or print the PDF with one click and submit it directly to your nearest CSC center or official scheme portal.",
            },
            {
              q:
                language === "hi"
                  ? "क्या मुझे टेक सहाय का उपयोग करने के लिए तेज़ इंटरनेट की आवश्यकता है?"
                  : language === "kn"
                  ? "ಟೆಕ್ ಸಹಾಯ ಬಳಸಲು ನನಗೆ ವೇಗದ ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿದೆಯೇ?"
                  : "Do I need high-speed internet to use Tech Sahaya?",
              a:
                language === "hi"
                  ? "नहीं! टेक सहाय एक प्रोग्रेसिव वेब ऐप (PWA) है जिसमें 'विलेज ऑफलाइन मोड' और स्थानीय नियम कैशिंग शामिल है, जिससे यह ग्रामीण और धीमे नेटवर्क वाले क्षेत्रों में भी आसानी से काम करता है।"
                  : language === "kn"
                  ? "ಇಲ್ಲ! ಟೆಕ್ ಸಹಾಯ ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಮತ್ತು ಸ್ಥಳೀಯ ಕ್ಯಾಶಿಂಗ್ ಹೊಂದಿದ್ದು, ಗ್ರಾಮೀಣ ಭಾಗಗಳಲ್ಲಿ ನಿಧಾನಗತಿಯ ಇಂಟರ್ನೆಟ್‌ನಲ್ಲೂ ಸರಾಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ."
                  : "No. Tech Sahaya is built as an offline-first Progressive Web App (PWA) with built-in Village Offline Mode and local rule caching, ensuring continuous operation even in low-connectivity rural areas.",
            },
            {
              q:
                language === "hi"
                  ? "सरकारी योजनाओं की सत्यता की पुष्टि कैसे की जाती है?"
                  : language === "kn"
                  ? "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ನಿಖರತೆಯನ್ನು ಹೇಗೆ ದೃಢೀಕರಿಸಲಾಗುತ್ತದೆ?"
                  : "How are government schemes verified for authenticity?",
              a:
                language === "hi"
                  ? "टेक सहाय में प्रत्येक योजना की पुष्टि आधिकारिक सरकारी राजपत्रों, मंत्रालयों के पोर्टल्स (जैसे pmkisan.gov.in) और दिनांकित आधिकारिक सूचनाओं से की जाती है।"
                  : language === "kn"
                  ? "ಟೆಕ್ ಸಹಾಯದಲ್ಲಿರುವ ಪ್ರತಿಯೊಂದು ಯೋಜನೆಯನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಗೆಜೆಟ್ ಹಾಗೂ ಇಲಾಖಾ ಪೋರ್ಟಲ್‌ಗಳ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ ನವೀಕರಿಸಲಾಗುತ್ತದೆ."
                  : "Every scheme in Tech Sahaya is grounded in official government gazette notifications, ministerial portals, and source citations with date-stamped verification records and conflict detection.",
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="group p-5 transition-colors hover:bg-white open:bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 text-sm sm:text-base list-none">
                <span>{faq.q}</span>
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 group-open:rotate-180 transition-transform">
                  <ChevronDown size={16} className="text-slate-600" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed pr-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
