import { X } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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
          aria-label="Close Privacy Policy"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-500 hover:bg-stone-200 hover:text-slate-800 transition"
        >
          <X size={20} />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
          PRIVACY POLICY
        </span>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold font-serif text-slate-900">
          What we collect, why, and how little of it there is
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Purpose limitation is the whole design: if no scheme rule needs a field, we do not ask for it.
        </p>

        <div className="mt-6 divide-y divide-stone-100 space-y-5 text-sm">
          {/* What we collect */}
          <div className="pt-4 first:pt-0">
            <h3 className="font-bold text-slate-900 text-base font-serif">What we collect</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Age, gender, state and district, rural or urban residence, social category, occupation, annual household income, landholding in acres, housing status, whether the household has a toilet, disability status, student status, the documents you tell us you hold, and the same fields for each family member you add. Every one of these appears in at least one scheme rule.
            </p>
          </div>

          {/* What we never collect or keep */}
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">What we never collect or keep</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Full Aadhaar or PAN numbers, bank account numbers, biometrics, and the identity documents themselves. Documents are read in a memory buffer, masked, reduced to the attributes a rule needs, and discarded inside the same request. There is no bucket, no file table and no public URL.
            </p>
          </div>

          {/* Why we process it */}
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Why we process it</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              To evaluate deterministic eligibility rules against your household, to explain a verdict in your chosen language, and to notify you when a change makes you newly eligible. Nothing is used for advertising or sold to anyone.
            </p>
          </div>

          {/* Who can see it */}
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Who can see it</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Only you. Every backend request carries an ownership check, and every read is written to your activity log. A CSC operator assisting you can only see what you approve for that session, and the session is recorded in the same log.
            </p>
          </div>

          {/* Your rights */}
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Your rights</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              You can see a full summary of what we hold, export it, withdraw consent, or delete everything — from the Privacy Centre, without contacting support. Withdrawal stops all processing immediately; deletion removes the profile and its activity log.
            </p>
          </div>

          {/* Automated decisions */}
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base font-serif">Automated decisions</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Eligibility verdicts come from a published rule engine, not from a language model, and every verdict shows you the individual criteria and the source it was checked against. You can always dispute a verdict against the official portal, which remains authoritative.
            </p>
          </div>

          {/* What we do not do */}
          <div className="pt-5">
            <h3 className="font-bold text-slate-900 text-base font-serif">What we do not do</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside leading-relaxed">
              <li>No advertising, retargeting or social-media pixels of any kind.</li>
              <li>No third-party analytics that can see your profile fields.</li>
              <li>No cookies that carry document content — documents never leave the request they arrive in.</li>
              <li>No cross-site tracking. There is no ad network to sell to.</li>
            </ul>
          </div>

          {/* Local storage we also use */}
          <div className="pt-5">
            <h3 className="font-bold text-slate-900 text-base font-serif">Local storage we also use</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside leading-relaxed">
              <li>Your draft answers in profile setup, so a dropped connection does not lose your work. Cleared when you submit.</li>
              <li>The current language, mirrored from the preferences cookie so the interface does not flash English first.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Questions about this policy, or a request to delete everything we hold, can be raised from the{" "}
            <Link
              to="/privacy"
              onClick={onClose}
              className="text-[#0f3d2e] underline font-semibold hover:text-emerald-950"
            >
              Privacy Centre
            </Link>{" "}
            once you are signed in. Last updated 2 September 2026.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#0f3d2e] px-5 py-2 text-xs font-bold text-white hover:bg-emerald-950 transition whitespace-nowrap"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
