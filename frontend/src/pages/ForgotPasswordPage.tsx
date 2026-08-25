import { useState } from "react";
import { api } from "../services/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-3xl border bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold">Forgot password</h1>
        <p className="mt-2 text-slate-600">Request secure password recovery instructions for your account.</p>
        <form className="mt-6 space-y-4" onSubmit={async (e) => { e.preventDefault(); const res = await api.post("/api/auth/forgot-password", { email }); setMessage(res.data.message); }}>
          <input className="min-h-12 w-full rounded-xl border px-4" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="min-h-12 w-full rounded-xl bg-sahaya-green text-white">Request reset</button>
          {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}
        </form>
      </div>
    </div>
  );
}
