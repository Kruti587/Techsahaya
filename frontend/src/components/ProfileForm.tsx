import { useState } from "react";
import type { EligibilityProfile } from "../types";

const defaults: EligibilityProfile = { available_documents: [] };

export function ProfileForm({
  initialValue,
  onSubmit,
  submitLabel = "Save"
}: {
  initialValue?: EligibilityProfile;
  onSubmit: (profile: EligibilityProfile) => void;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<EligibilityProfile>(initialValue || defaults);
  const update = (key: keyof EligibilityProfile, value: string | number | boolean) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <input className="min-h-12 rounded-xl border p-3" placeholder="Age" type="number" value={form.age || ""} onChange={(e) => update("age", Number(e.target.value))} />
      <select className="min-h-12 rounded-xl border p-3" value={form.gender || ""} onChange={(e) => update("gender", e.target.value)}>
        <option value="">Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <input className="min-h-12 rounded-xl border p-3" placeholder="State" value={form.state || ""} onChange={(e) => update("state", e.target.value)} />
      <input className="min-h-12 rounded-xl border p-3" placeholder="Occupation" value={form.occupation || ""} onChange={(e) => update("occupation", e.target.value)} />
      <input className="min-h-12 rounded-xl border p-3" placeholder="Income" type="number" value={form.income || ""} onChange={(e) => update("income", Number(e.target.value))} />
      <input className="min-h-12 rounded-xl border p-3" placeholder="Landholding" type="number" value={form.landholding || ""} onChange={(e) => update("landholding", Number(e.target.value))} />
      <label className="flex min-h-12 items-center gap-2 rounded-xl border p-3">
        <input type="checkbox" checked={form.disability || false} onChange={(e) => update("disability", e.target.checked)} />
        Disability
      </label>
      <input className="min-h-12 rounded-xl border p-3 md:col-span-2" placeholder="Documents (comma separated)" value={(form.available_documents || []).join(", ")} onChange={(e) => update("available_documents", e.target.value.split(",").map((item) => item.trim()).filter(Boolean) as never)} />
      <button className="min-h-12 rounded-xl bg-sahaya-green px-4 text-white md:col-span-2" type="submit">{submitLabel}</button>
    </form>
  );
}
