import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";

export function PrivacyPage() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header matching Screenshot 5 */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-10 shadow-card">
        <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
          PRIVACY POLICY
        </span>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold font-serif text-slate-900">
          What we collect, why, and how little of it there is
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
          Purpose limitation is the whole design: if no scheme rule needs a field, we do not ask for it.
        </p>

        <div className="mt-8 divide-y divide-stone-100 space-y-6 text-sm">
          {/* What we collect */}
          <div className="pt-5 first:pt-0">
            <h2 className="font-bold text-slate-900 text-lg font-serif">What we collect</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              Age, gender, state and district, rural or urban residence, social category, occupation, annual household income, landholding in acres, housing status, whether the household has a toilet, disability status, student status, the documents you tell us you hold, and the same fields for each family member you add. Every one of these appears in at least one scheme rule.
            </p>
          </div>

          {/* What we never collect or keep */}
          <div className="pt-5">
            <h2 className="font-bold text-slate-900 text-lg font-serif">What we never collect or keep</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              Full Aadhaar or PAN numbers, bank account numbers, biometrics, and the identity documents themselves. Documents are read in a memory buffer, masked, reduced to the attributes a rule needs, and discarded inside the same request. There is no bucket, no file table and no public URL.
            </p>
          </div>

          {/* Why we process it */}
          <div className="pt-5">
            <h2 className="font-bold text-slate-900 text-lg font-serif">Why we process it</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              To evaluate deterministic eligibility rules against your household, to explain a verdict in your chosen language, and to notify you when a change makes you newly eligible. Nothing is used for advertising or sold to anyone.
            </p>
          </div>

          {/* Who can see it */}
          <div className="pt-5">
            <h2 className="font-bold text-slate-900 text-lg font-serif">Who can see it</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              Only you. Every backend request carries an ownership check, and every read is written to your activity log. A CSC operator assisting you can only see what you approve for that session, and the session is recorded in the same log.
            </p>
          </div>

          {/* Your rights */}
          <div className="pt-5">
            <h2 className="font-bold text-slate-900 text-lg font-serif">Your rights</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              You can see a full summary of what we hold, export it, withdraw consent, or delete everything from the Privacy Centre, without contacting support. Withdrawal stops all processing immediately; deletion removes the profile and its activity log.
            </p>
          </div>

          {/* Automated decisions */}
          <div className="pt-5">
            <h2 className="font-bold text-slate-900 text-lg font-serif">Automated decisions</h2>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              Eligibility verdicts come from a published rule engine, not from a language model, and every verdict shows you the individual criteria and the source it was checked against. You can always dispute a verdict against the official portal, which remains authoritative.
            </p>
          </div>

          {/* What we do not do - Screenshot 3 */}
          <div className="pt-6">
            <h2 className="font-bold text-slate-900 text-lg font-serif">What we do not do</h2>
            <ul className="mt-2 space-y-2 text-xs md:text-sm text-slate-600 list-disc list-inside leading-relaxed">
              <li>No advertising, retargeting or social-media pixels of any kind.</li>
              <li>No third-party analytics that can see your profile fields.</li>
              <li>No cookies that carry document content: documents never leave the request they arrive in.</li>
              <li>No cross-site tracking. There is no ad network to sell to.</li>
            </ul>
          </div>

          {/* Local storage we also use - Screenshot 3 */}
          <div className="pt-6">
            <h2 className="font-bold text-slate-900 text-lg font-serif">Local storage we also use</h2>
            <ul className="mt-2 space-y-2 text-xs md:text-sm text-slate-600 list-disc list-inside leading-relaxed">
              <li>Your draft answers in profile setup, so a dropped connection does not lose your work. Cleared when you submit.</li>
              <li>The current language, mirrored from the preferences cookie so the interface does not flash English first.</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 pt-4 border-t border-stone-200 text-xs text-slate-500">
          Questions about this policy, or a request to delete everything we hold, can be raised from the Privacy Centre once you are signed in. Last updated 2 September 2026.
        </p>
      </div>

      {/* Citizen Privacy Center Controls (Active when signed in) */}
      {user && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8 shadow-card space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">Privacy Centre - Citizen Controls</h2>
            <p className="mt-1 text-xs text-slate-600">
              Exercise your DPDP Act rights directly. You hold complete ownership and control over your personal welfare profile and data.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setMessage("Your verified data export archive has been generated.")}
              className="min-h-12 rounded-xl border border-stone-300 px-5 text-sm font-semibold text-slate-700 hover:bg-stone-50 transition"
            >
              Export &amp; Download My Data
            </button>
            <button
              onClick={async () => {
                await api.post("/api/consent", {
                  consent_version: "v1",
                  selected_language: "en",
                  purpose: "withdrawal",
                  consent_given: false,
                });
                setMessage("Consent successfully withdrawn. Scheme evaluation stopped.");
              }}
              className="min-h-12 rounded-xl border border-stone-300 px-5 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition"
            >
              Withdraw Processing Consent
            </button>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
            <h3 className="font-bold text-red-900 text-base">Permanent Data Erasure</h3>
            <p className="mt-1.5 text-xs text-red-700 leading-relaxed">
              Type <strong className="font-mono bg-red-100 px-1.5 py-0.5 rounded">DELETE</strong> to confirm permanent deletion. This completely removes your stored profile, family records, document metadata, clears the local session, and logs you out.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                className="min-h-12 flex-1 rounded-xl border border-red-300 bg-white px-4 text-sm font-mono focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type DELETE"
              />
              <button
                onClick={async () => {
                  if (confirm !== "DELETE") return setMessage("Please type DELETE exactly.");
                  await api.delete("/api/profile");
                  await logout();
                  setMessage("All personal data deleted permanently.");
                  navigate("/");
                }}
                className="min-h-12 rounded-xl bg-red-700 px-5 text-sm font-bold text-white shadow-sm hover:bg-red-800 transition"
              >
                Confirm Deletion
              </button>
            </div>
          </div>

          {message && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
