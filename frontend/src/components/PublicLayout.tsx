import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { t, type TranslationKey } from "../utils/i18n";
import { SUPPORTED_LANGUAGES } from "../utils/languages";
import { Logo } from "./Logo";
import { Footer } from "./Footer";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { BackToTop } from "./BackToTop";
import { CookieBanner } from "./CookieBanner";

const items: { to: string; label: string; labelKey: TranslationKey }[] = [
  { to: "/", label: "Home", labelKey: "home" },
  { to: "/how-it-works", label: "How It Works", labelKey: "howItWorks" },
  { to: "/schemes", label: "Schemes", labelKey: "schemes" },
  { to: "/eligibility", label: "Eligibility", labelKey: "eligibility" },
  { to: "/welfare-gaps", label: "Welfare Gaps", labelKey: "welfareGaps" },
  { to: "/security", label: "Security & Privacy", labelKey: "securityPrivacy" },
  { to: "/dpdp", label: "DPDP Act", labelKey: "dpdpAct" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, offline, user } = useAppContext();
  const [fontScale, setFontScale] = useState<"small" | "normal" | "large">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontScale === "small") {
      root.style.fontSize = "14px";
    } else if (fontScale === "large") {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [fontScale]);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative transition-colors duration-200 ${
        highContrast ? "high-contrast-mode bg-black text-white" : "bg-[#fcfbf9] text-sahaya-ink"
      }`}
    >
      {/* Floating Chatbot widget visible across public site */}
      <FloatingChatWidget />

      {/* Cookie policy & consent banner automatically presented on opening */}
      <CookieBanner />

      {/* Back to Top floating pill button in the middle of page */}
      <BackToTop />

      {/* Top Accessibility & Multilingual Status Strip */}
      <div className="bg-[#022c22] text-emerald-100 text-[11px] py-1.5 px-3 sm:px-4 border-b border-emerald-950 flex flex-wrap justify-between items-center gap-2 z-40">
        {/* Right: Language selector & Font/Contrast tools */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Language selector */}
          <div className="flex items-center gap-1.5">
            <Globe size={13} className="text-emerald-400" />
            <select
              aria-label="Language selector"
              className="bg-emerald-950 text-white font-medium border border-emerald-700/60 rounded px-2 py-0.5 text-[11px] focus:outline-none cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#0f3d2e] text-white">
                  {lang.nativeLabel} &bull; {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Accessibility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font scale buttons */}
            <div className="flex items-center gap-0.5 border-r border-emerald-700/60 pr-1.5 sm:pr-2">
              <span className="text-[10px] text-emerald-300 font-bold mr-0.5">T</span>
              <button
                type="button"
                onClick={() => setFontScale("small")}
                className={`px-1 py-0.5 rounded text-[10px] font-bold ${
                  fontScale === "small" ? "bg-emerald-600 text-white" : "hover:text-white text-emerald-200"
                }`}
                title="Smaller font"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontScale("normal")}
                className={`px-1 py-0.5 rounded text-[10px] font-bold ${
                  fontScale === "normal" ? "bg-emerald-600 text-white" : "hover:text-white text-emerald-200"
                }`}
                title="Default font"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale("large")}
                className={`px-1 py-0.5 rounded text-[10px] font-bold ${
                  fontScale === "large" ? "bg-emerald-600 text-white" : "hover:text-white text-emerald-200"
                }`}
                title="Larger font"
              >
                A+
              </button>
            </div>

            {/* High contrast toggle */}
            <button
              type="button"
              onClick={() => setHighContrast((c) => !c)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                highContrast
                  ? "bg-amber-400 text-black border-amber-400"
                  : "border-emerald-700/60 text-emerald-200 hover:text-white hover:border-emerald-500"
              }`}
              title="Toggle High Contrast for WCAG accessibility"
            >
              {highContrast ? `${t(language, "highContrastMode")}: ON` : t(language, "highContrastMode")}
            </button>

            {/* Simple mode toggle */}
            <button
              type="button"
              onClick={() => setSimpleMode((s) => !s)}
              className={`hidden md:inline-flex px-2 py-0.5 rounded border text-[10px] font-bold transition ${
                simpleMode
                  ? "bg-sahaya-saffron text-white border-sahaya-saffron"
                  : "border-emerald-700/60 text-emerald-200 hover:text-white"
              }`}
            >
              {t(language, "simpleModeLabel")}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`border-b sticky top-0 z-40 transition-colors ${highContrast ? "bg-black border-stone-800" : "bg-white/95 backdrop-blur-md border-stone-200"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 text-sahaya-green">
            <Logo size={42} />
            <div>
              <div className="font-bold text-base sm:text-lg leading-tight tracking-tight text-slate-900">Tech Sahaya</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide truncate max-w-[170px] sm:max-w-none">
                {t(language, "digitalCitizenWelfare")}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-4 lg:gap-6 md:flex" aria-label="Main menu">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-xs lg:text-sm font-semibold transition ${
                    isActive ? "text-sahaya-green font-bold underline underline-offset-8" : "text-slate-700 hover:text-sahaya-green"
                  }`
                }
              >
                {item.labelKey ? t(language, item.labelKey) : item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex h-9 sm:h-10 items-center justify-center rounded-xl bg-sahaya-green px-3 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 leading-none"
              >
                {t(language, "dashboard")}
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="h-9 sm:h-10 items-center justify-center rounded-xl border border-stone-300 bg-white px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-stone-50 inline-flex leading-none"
                >
                  {t(language, "signIn")}
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-9 sm:h-10 items-center justify-center rounded-xl bg-[#0f3d2e] px-3.5 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 leading-none"
                >
                  {t(language, "createAccount")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-stone-300 bg-stone-50 text-slate-700 hover:bg-stone-100 transition focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white/98 px-4 py-4 shadow-xl space-y-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                      isActive
                        ? "bg-emerald-50 text-sahaya-green font-bold"
                        : "text-slate-700 hover:bg-stone-100 hover:text-sahaya-green"
                    }`
                  }
                >
                  <span>{item.labelKey ? t(language, item.labelKey) : item.label}</span>
                </NavLink>
              ))}
            </nav>

            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 flex items-center justify-center rounded-xl border border-stone-300 bg-white text-xs font-bold text-slate-700 shadow-sm hover:bg-stone-50 text-center"
                >
                  {t(language, "signIn")}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 flex items-center justify-center rounded-xl bg-[#0f3d2e] text-xs font-bold text-white shadow-sm hover:bg-emerald-900 text-center"
                >
                  {t(language, "createAccount")}
                </Link>
              </div>
            )}

            {/* Quick Language Switcher for Mobile */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="text-sahaya-green" />
                <span>{t(language, "chooseLanguage")}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition ${
                      language === lang.code
                        ? "bg-sahaya-green text-white font-bold"
                        : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                    }`}
                  >
                    {lang.nativeLabel} ({lang.label})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {offline && (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-900">
            You are offline. Cached scheme information is still available.
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
