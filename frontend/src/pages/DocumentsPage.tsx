import { useEffect, useState } from "react";
import { FileCheck2, FileText, RefreshCcw, ShieldCheck, UploadCloud } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

const commonDocuments = [
  { name: "Ration card", documentType: "ration_card", usedFor: "Household income, family, food security and health-benefit checks" },
  { name: "Income certificate", documentType: "income_certificate", usedFor: "Scholarship, housing, LPG and low-income welfare checks" },
  { name: "Land record", documentType: "land_record", usedFor: "Farmer and agriculture benefit checks" },
  { name: "Bank account proof", documentType: "bank_account_proof", usedFor: "Benefit transfer readiness" },
  { name: "Residence proof", documentType: "residence_proof", usedFor: "State and district applicability checks" },
  { name: "Disability certificate", documentType: "disability_certificate", usedFor: "Disability support and priority access checks" },
  { name: "Student ID", documentType: "student_id", usedFor: "Scholarship and education schemes" },
  { name: "Birth certificate", documentType: "birth_certificate", usedFor: "Age, child and girl-child scheme checks" }
];

export function DocumentsPage() {
  const { language, profile, setProfile } = useAppContext();
  const [documents, setDocuments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = async () => {
    const res = await api.get("/api/documents");
    setDocuments(res.data);
  };
  useEffect(() => { load().catch(() => setDocuments([])); }, []);
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sahaya-saffron">{t(language, "processedSafely")}</p>
            <h1 className="mt-1 text-3xl font-bold">{t(language, "secureDocuments")}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{t(language, "documentsIntro")}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-sahaya-green">
            <ShieldCheck className="mb-2" />
            <b>{t(language, "documentPrivacyNote")}</b>
            <p className="mt-2 text-slate-700">{t(language, "doNotUploadIds")}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">{t(language, "commonDocuments")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {commonDocuments.map((item) => (
              <div key={item.documentType} className="rounded-2xl border p-4">
                <div className="flex items-center gap-2 font-semibold"><FileCheck2 className="text-sahaya-green" size={18} /> {item.name}</div>
                <p className="mt-2 text-sm text-slate-600"><span className="font-semibold">{t(language, "usedFor")}:</span> {item.usedFor}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="mb-2 text-lg font-semibold">{t(language, "uploadDocument")}</h2>
          <p className="mb-4 text-sm text-slate-600">{t(language, "uploadHelp")}</p>
          <form className="space-y-3" onSubmit={async (e) => {
            e.preventDefault();
            const input = document.getElementById("upload") as HTMLInputElement;
            const file = input.files?.[0];
            if (!file) return;
            if (/aadhaar|aadhar|pan/i.test(file.name)) { setError(t(language, "doNotUploadIds")); return; }
            if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) { setError(t(language, "invalidDocumentType")); return; }
            if (file.size > 5242880) { setError(t(language, "documentTooLarge")); return; }
            const form = new FormData();
            form.append("file", file);
            const res = await api.post("/api/documents/upload", form);
            setMessage(res.data.message);
            setProfile({ ...profile, available_documents: res.data.available_documents || profile.available_documents });
            setError("");
            input.value = "";
            await load();
          }}>
            <label className="grid gap-1 text-sm font-semibold" htmlFor="upload">
              {t(language, "chooseDocument")}
              <input id="upload" aria-label={t(language, "uploadDocument")} className="min-h-12 rounded-xl border p-3 font-normal" type="file" accept=".pdf,.png,.jpg,.jpeg" />
            </label>
            <button className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-4 font-semibold text-white"><UploadCloud size={18} /> {t(language, "uploadDocument")}</button>
            <button type="button" onClick={() => load()} className="ml-2 inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 font-semibold"><RefreshCcw size={18} /> {t(language, "refreshDocuments")}</button>
          </form>
        </div>
      </section>

      {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-card">
        {documents.length === 0 && <div className="rounded-xl border p-4 text-sm text-slate-600">{t(language, "noDocuments")}</div>}
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl border p-4">
            <div className="flex items-center gap-2 font-semibold"><FileText size={18} /> {doc.document_type}</div>
            <div className="mt-2 text-sm text-slate-600">{t(language, "documentStatus")}: {doc.status} | {t(language, "verification")}: {doc.verification_state}</div>
            <div className="mt-2 rounded-xl bg-stone-50 p-3 text-sm">{t(language, "maskedInfo")}: {JSON.stringify(doc.masked_fields)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
