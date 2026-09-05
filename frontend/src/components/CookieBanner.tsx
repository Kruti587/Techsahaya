import { useState, useEffect } from "react";
import { Cookie, X, Settings2, FileText } from "lucide-react";
import { CookiePolicyModal } from "./CookiePolicyModal";
import { CookiePreferencesModal } from "./CookiePreferencesModal";

// Bump this version to force the banner to show again for all users
const CONSENT_VERSION = "v2";
const CONSENT_KEY = `sahaya_cookie_consent_decided_${CONSENT_VERSION}`;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    // Check versioned consent key: old keys (unversioned) will be ignored
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Delay slightly for smooth entrance after page load
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(
      "sahaya_cookie_prefs",
      JSON.stringify({
        strictlyNecessary: true,
        preferences: true,
        analytics: true,
      })
    );
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(
      "sahaya_cookie_prefs",
      JSON.stringify({
        strictlyNecessary: true,
        preferences: false,
        analytics: false,
      })
    );
    setVisible(false);
  };

  return (
    <>
      <CookiePolicyModal
        isOpen={policyOpen}
        onClose={() => setPolicyOpen(false)}
        onOpenPreferences={() => {
          setPolicyOpen(false);
          setPrefsOpen(true);
        }}
      />

      <CookiePreferencesModal
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
      />

      {visible && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up"
        >
          <div className="relative rounded-3xl border border-emerald-900/40 bg-slate-950/95 p-5 sm:p-6 text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
            {/* Close button */}
            <button
              type="button"
              onClick={handleEssentialOnly}
              aria-label="Dismiss cookie notice (keep essential only)"
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={15} />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Cookie size={20} />
              </div>
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white font-serif">
                    Cookie &amp; Privacy Notice
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300 tracking-wider">
                    DPDP 2023
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tech Sahaya uses essential session cookies for secure scheme evaluations and verification. We never store raw biometrics or sell user data.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-sahaya-saffron px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 active:scale-95 transition"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 active:scale-95 transition"
              >
                Essential Only
              </button>
            </div>

            {/* Links */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="inline-flex items-center gap-1 hover:text-emerald-400 underline transition"
              >
                <FileText size={12} />
                <span>Read Cookie Policy</span>
              </button>
              <button
                type="button"
                onClick={() => setPrefsOpen(true)}
                className="inline-flex items-center gap-1 hover:text-emerald-400 underline transition"
              >
                <Settings2 size={12} />
                <span>Customize Choices</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
