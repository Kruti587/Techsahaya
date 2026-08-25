import { useEffect, useState } from "react";
import { api } from "../services/api";

export function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  useEffect(() => { api.get("/api/admin/dashboard").then((res) => setData(res.data)); }, []);
  if (!data) return <div className="rounded-3xl bg-white p-6 shadow-card">Loading admin dashboard...</div>;
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Object.entries(data).map(([key, value]) => <div key={key} className="rounded-2xl bg-white p-5 shadow-card"><div className="text-sm text-slate-500">{key}</div><div className="mt-2 font-semibold">{Array.isArray(value) ? value.join(", ") : String(value)}</div></div>)}</div>;
}
