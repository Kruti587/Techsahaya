import { X } from "lucide-react";

export function CookiePolicyModal({
  isOpen,
  onClose,
  onOpenPreferences,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreferences: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 md:p-8 shadow-2xl text-slate-800">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Cookie Policy"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-500 hover:bg-stone-200 hover:text-slate-800 transition"
        >
          <X size={20} />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
          COOKIE POLICY
        </span>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold font-serif text-slate-900">
          Six cookies. Three of them optional.
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          We list every cookie we set, what it does and how long it lasts. Nothing in the optional categories runs until you turn it on.
        </p>

        {/* Your current choices */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Your current choices
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-stone-200 bg-white p-3">
              <span className="font-bold text-slate-700 block text-[11px] uppercase">
                Strictly Necessary
              </span>
              <span className="text-emerald-700 font-semibold mt-1 block">Always on</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-3">
              <span className="font-bold text-slate-700 block text-[11px] uppercase">
                Preferences
              </span>
              <span className="text-slate-600 mt-1 block font-medium">Allowed</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-3">
              <span className="font-bold text-slate-700 block text-[11px] uppercase">
                Anonymous Analytics
              </span>
              <span className="text-slate-600 mt-1 block font-medium">Blocked</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPreferences();
            }}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0f3d2e] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-950 transition"
          >
            Change my cookie choices
          </button>
        </div>

        {/* Every cookie we set table */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">
            Every cookie we set
          </h3>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/70 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 leading-relaxed text-slate-700">
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_session</td>
                  <td className="p-3 font-semibold text-slate-800">Strictly necessary</td>
                  <td className="p-3">Keeps you signed in and ties requests to your own profile so no one else&apos;s data can load.</td>
                  <td className="p-3 font-medium">Session, or 30 days if you choose &quot;keep me signed in&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_consent</td>
                  <td className="p-3 font-semibold text-slate-800">Strictly necessary</td>
                  <td className="p-3">Records which cookie categories you allowed, and when, so we do not ask again.</td>
                  <td className="p-3 font-medium">12 months</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_ratelimit</td>
                  <td className="p-3 font-semibold text-slate-800">Strictly necessary</td>
                  <td className="p-3">Counts requests in a sliding window so the AI Security Gateway can enforce its limits.</td>
                  <td className="p-3 font-medium">1 minute</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_language</td>
                  <td className="p-3 font-semibold text-slate-800">Preferences</td>
                  <td className="p-3">Remembers whether you use English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు or मराठी.</td>
                  <td className="p-3 font-medium">12 months</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_reading</td>
                  <td className="p-3 font-semibold text-slate-800">Preferences</td>
                  <td className="p-3">Remembers your text size, high-contrast setting and whether Simple Mode is on.</td>
                  <td className="p-3 font-medium">12 months</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-emerald-900">sahaya_usage</td>
                  <td className="p-3 font-semibold text-slate-800">Anonymous analytics</td>
                  <td className="p-3">Aggregate page counts only, so we can see which screens confuse people. No identifiers, no profile fields, no document content.</td>
                  <td className="p-3 font-medium">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-300 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
