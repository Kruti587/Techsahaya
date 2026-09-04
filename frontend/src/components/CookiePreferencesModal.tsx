import { useState } from "react";
import { X, Check } from "lucide-react";

export function CookiePreferencesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [preferences, setPreferences] = useState(() => {
    return {
      strictlyNecessary: true,
      preferences: true,
      analytics: false,
    };
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("sahaya_cookie_prefs", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl text-slate-800">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preferences"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-slate-500 hover:bg-stone-200 hover:text-slate-800 transition"
        >
          <X size={18} />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
          YOUR CHOICES
        </span>
        <h2 className="mt-1 text-xl md:text-2xl font-bold font-serif text-slate-900">
          Manage Cookie Preferences
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Control how Tech Sahaya uses cookies on your browser. Strictly necessary cookies are always required for authentication and security rate-limiting.
        </p>

        <div className="mt-5 space-y-3 text-xs">
          {/* Strictly necessary */}
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
            <div>
              <div className="font-bold text-slate-900">Strictly Necessary</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Session token, CSRF, and AI gateway rate-limiting. Cannot be disabled.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-[10px] text-emerald-800 uppercase tracking-wide">
              Always On
            </span>
          </div>

          {/* Preferences */}
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5">
            <div>
              <div className="font-bold text-slate-900">Language &amp; Accessibility Preferences</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Remembers your selected language (English, Hindi, Kannada, etc.) and text display size.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, preferences: e.target.checked }))
                }
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-stone-300 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-sahaya-green peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Anonymous Analytics */}
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5">
            <div>
              <div className="font-bold text-slate-900">Anonymous Usage Analytics</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Aggregate screen views to improve scheme discoverability. No identity or document data.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                }
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-stone-300 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-sahaya-green peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d2e] px-5 py-2 text-xs font-bold text-white hover:bg-emerald-950 shadow transition"
          >
            {saved ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
