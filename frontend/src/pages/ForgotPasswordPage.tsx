import { useState } from "react";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";
import { t } from "../utils/i18n";

export function ForgotPasswordPage() {
  const { language } = useAppContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          {t(language, "auth.forgotPasswordTitle")}
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          {t(language, "auth.forgotPasswordDesc")}
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const res = await api.post("/api/auth/forgot-password", { email });
              setMessage(res.data.message || t(language, "auth.resetSent"));
            } catch {
              setMessage(t(language, "auth.resetSent"));
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t(language, "auth.emailAddressLabel")} *
            </label>
            <input
              required
              className="min-h-12 w-full rounded-xl border border-stone-300 px-4 text-sm focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-xl bg-sahaya-green font-bold text-white shadow-md hover:bg-emerald-900 transition disabled:opacity-60"
          >
            {loading ? t(language, "auth.verifying") : t(language, "auth.requestReset")}
          </button>
          {message && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
