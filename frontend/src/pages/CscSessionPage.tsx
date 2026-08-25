import { useState } from "react";
import { api } from "../services/api";

export function CscSessionPage() {
  const [citizen_email, setCitizenEmail] = useState("citizen@techsahaya.org");
  const [session, setSession] = useState<any | null>(null);
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <h1 className="text-3xl font-bold">Start Citizen Assistance Session</h1>
      <form className="mt-6 flex flex-wrap gap-3" onSubmit={async (e) => { e.preventDefault(); const res = await api.post("/api/csc/citizen-session", { citizen_email, language: "en" }); setSession(res.data); }}>
        <input className="min-h-12 rounded-xl border px-4" value={citizen_email} onChange={(e) => setCitizenEmail(e.target.value)} />
        <button className="min-h-12 rounded-xl bg-sahaya-green px-4 text-white">Start Session</button>
      </form>
      {session && <div className="mt-4 rounded-xl border p-4"><div className="font-semibold">Active session</div><div className="text-sm">Session ID: {session.session_id}</div><div className="text-sm">Citizen ID: {session.citizen_user_id}</div></div>}
    </div>
  );
}
