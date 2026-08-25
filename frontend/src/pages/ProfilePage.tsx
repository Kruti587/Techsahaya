import { useEffect, useState } from "react";
import { ProfileForm } from "../components/ProfileForm";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

const friendlyFieldNames: Record<string, string> = {
  full_name: "Name",
  email: "Email",
  phone_number: "Phone number",
  preferred_language: "Preferred language",
  accessibility_preference: "Accessibility preference",
  consent_given: "Consent status",
  age: "Age",
  gender: "Gender",
  state: "State",
  occupation: "Occupation",
  income: "Income range",
  landholding: "Landholding",
  disability: "Disability support need",
  family_members: "Family members",
  available_documents: "Available document names",
  recently_viewed_schemes: "Recently viewed schemes",
  digital_literacy: "Guidance preference"
};

export function ProfilePage() {
  const { profile, setProfile, language, setLanguage } = useAppContext();
  const [storedSummary, setStoredSummary] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  useEffect(() => {
    api.get("/api/profile").then((res) => setStoredSummary(res.data.stored_data_summary)).catch(() => undefined);
  }, []);
  const fieldsStored = (storedSummary?.fields_stored || []).map((field: string) => friendlyFieldNames[field] || field);
  const neverStored = storedSummary?.what_we_never_store || [
    "Full Aadhaar number",
    "Full PAN number",
    "Biometric data",
    "Raw identity documents"
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <SectionCard title={t(language, "profilePrivacy")}>
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-lg font-semibold text-sahaya-green">{t(language, "tellOnlyNeeded")}</div>
          <p className="mt-1 text-sm text-slate-700">{t(language, "profileHelp")}</p>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="profile-language">{t(language, "language")}</label>
          <select id="profile-language" className="min-h-12 rounded-xl border p-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
        </div>
        <ProfileForm
          initialValue={profile}
          submitLabel={t(language, "saveProfile")}
          onSubmit={async (nextProfile) => {
            setProfile(nextProfile);
            await api.put("/api/profile", { ...nextProfile, preferred_language: language, consent_given: true });
            setMessage(t(language, "profileSaved"));
          }}
        />
      </SectionCard>
      <SectionCard title={t(language, "storedDataControls")}>
        <p className="text-sm leading-6 text-slate-600">{t(language, "minimumData")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold">{t(language, "whatMayBeStored")}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {fieldsStored.map((field: string) => <span key={field} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-medium text-slate-700">{field}</span>)}
            </div>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <h3 className="font-semibold text-red-900">{t(language, "whatNeverStored")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-red-950">
              {neverStored.map((item: string) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            {storedSummary?.sensitive_data_policy || "Documents are processed in memory whenever possible and only masked extracted metadata is retained."}
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-red-200 p-4">
          <h3 className="font-semibold text-red-900">{t(language, "deletePersonalData")}</h3>
          <p className="mt-1 text-sm text-slate-600">{t(language, "typeDeleteHelp")}</p>
          <input className="mt-3 min-h-12 w-full rounded-xl border p-3" placeholder="Type DELETE" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} />
          <button
          onClick={async () => {
            await api.delete("/api/profile");
            setProfile({ available_documents: [] });
            setMessage(t(language, "allDataDeleted"));
          }}
            disabled={confirmDelete !== "DELETE"}
            className="mt-3 min-h-12 rounded-xl bg-red-700 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Delete All My Data
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-sahaya-green">{message}</p>}
      </SectionCard>
    </div>
  );
}
