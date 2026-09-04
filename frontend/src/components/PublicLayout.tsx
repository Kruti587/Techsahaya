import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { t, type TranslationKey } from "../utils/i18n";
import { SUPPORTED_LANGUAGES } from "../utils/languages";
import { Logo } from "./Logo";
import { Footer } from "./Footer";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { BackToTop } from "./BackToTop";

const items: { to: string; labelKey: TranslationKey }[] = [
  { to: "/", labelKey: "home" },
  { to: "/how-it-works", labelKey: "howItWorks" },
  { to: "/schemes", labelKey: "schemes" },
  { to: "/security", labelKey: "securityPrivacy" },
  { to: "/about", labelKey: "about" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, offline } = useAppContext();
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between relative">
      {/* Floating Chatbot widget visible across public site */}
      <FloatingChatWidget />

      {/* Back to Top floating pill button in the middle of page */}
      <BackToTop />

      <header className="border-b bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-sahaya-green">
            <Logo size={42} />
            <div>
              <div className="font-bold text-lg leading-tight">Tech Sahaya</div>
              <div className="text-xs text-slate-500">{t(language, "publicTagline")}</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main menu">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-sahaya-green font-bold" : "text-slate-700 hover:text-sahaya-green"
                  }`
                }
              >
                {t(language, item.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <select
              aria-label="Language selector"
              className="min-h-12 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sahaya-green"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
            <Link
              to="/login"
              className="hidden min-h-12 items-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 md:inline-flex"
            >
              {t(language, "login")}
            </Link>
            <Link
              to="/signup"
              className="inline-flex min-h-12 items-center rounded-xl bg-sahaya-green px-5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-900"
            >
              {t(language, "getStarted")}
            </Link>
          </div>
        </div>
        {offline && (
          <div className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900">
            You are offline. Cached scheme information is still available.
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
