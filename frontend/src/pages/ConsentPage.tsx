import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";

export function ConsentPage() {
  const { language } = useAppContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const submit = async (consent_given: boolean) => {
    await api.post("/api/consent", { consent_version: "v1", selected_language: language, purpose: "welfare_assistance", consent_given });
    setMessage("Consent preference recorded.");
    navigate("/profile-setup");
  };
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <h1 className="text-3xl font-bold">What data does Tech Sahaya need?</h1>
      <div className="mt-4 space-y-3 text-slate-600">
        <p>We collect only minimum profile information needed for welfare assistance.</p>
        <p>We do not store full Aadhaar numbers, PAN numbers, biometrics, or raw identity images.</p>
        <p>You can continue without saving personal data, or withdraw consent later from the Privacy Center.</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => submit(true)} className="min-h-12 rounded-xl bg-sahaya-green px-4 text-white">Agree & Continue</button>
        <button onClick={() => submit(false)} className="min-h-12 rounded-xl border px-4">Continue Without Saving Personal Data</button>
      </div>
      {message && <div className="mt-4 text-sm text-sahaya-green">{message}</div>}
    </div>
  );
}
