import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { EligibilityProfile } from "../types";
import { t } from "../utils/i18n";

const defaults: EligibilityProfile = { available_documents: [] };

export function ProfileForm({
  initialValue,
  onSubmit,
  submitLabel
}: {
  initialValue?: EligibilityProfile;
  onSubmit: (profile: EligibilityProfile) => void;
  submitLabel?: string;
}) {
  const { language } = useAppContext();
  const [form, setForm] = useState<EligibilityProfile>(initialValue || defaults);
  useEffect(() => {
    setForm(initialValue || defaults);
  }, [initialValue]);
  const update = (key: keyof EligibilityProfile, value: string | number | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const buttonText = submitLabel || t(language, "save");

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <input className="min-h-12 rounded-xl border p-3" placeholder={t(language, "age")} type="number" value={form.age || ""} onChange={(e) => update("age", Number(e.target.value))} />
      <select className="min-h-12 rounded-xl border p-3" value={form.gender || ""} onChange={(e) => update("gender", e.target.value)}>
        <option value="">{t(language, "gender")}</option>
        <option value="female">{t(language, "female")}</option>
        <option value="male">{t(language, "male")}</option>
      </select>
      <input data-tour="profile-state-select" className="min-h-12 rounded-xl border p-3" placeholder={t(language, "state")} value={form.state || ""} onChange={(e) => update("state", e.target.value)} />
      <input data-tour="profile-occupation-select" className="min-h-12 rounded-xl border p-3" placeholder={t(language, "occupation")} value={form.occupation || ""} onChange={(e) => update("occupation", e.target.value)} />
      <input data-tour="profile-income-input" className="min-h-12 rounded-xl border p-3" placeholder={t(language, "income")} type="number" value={form.income || ""} onChange={(e) => update("income", Number(e.target.value))} />
      <input className="min-h-12 rounded-xl border p-3" placeholder={t(language, "landholding")} type="number" value={form.landholding || ""} onChange={(e) => update("landholding", Number(e.target.value))} />
      <label className="flex min-h-12 items-center gap-2 rounded-xl border p-3">
        <input type="checkbox" checked={form.disability || false} onChange={(e) => update("disability", e.target.checked)} />
        {t(language, "disability")}
      </label>
      <input className="min-h-12 rounded-xl border p-3 md:col-span-2" placeholder={t(language, "documentsList")} value={(form.available_documents || []).join(", ")} onChange={(e) => update("available_documents", e.target.value.split(",").map((item) => item.trim()).filter(Boolean) as never)} />
      <button data-tour="profile-save-button" className="min-h-12 rounded-xl bg-sahaya-green px-4 font-semibold text-white md:col-span-2 shadow-sm hover:opacity-90 transition" type="submit">{buttonText}</button>

    </form>
  );
}
