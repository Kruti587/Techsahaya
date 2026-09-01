import { useEffect, useState } from "react";
import { api } from "../services/api";

export function AdminSourcesPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.get("/api/admin/sources").then((res) => setItems(res.data)); }, []);
  return <div className="space-y-3">{items.map((item) => <div key={item.scheme_id} className="rounded-2xl bg-white p-4 shadow-card"><div className="font-semibold">{item.scheme_id}</div><div className="text-sm text-slate-600">{item.source_name}</div><div className="text-sm">Last verified: {item.last_verified}</div></div>)}</div>;
}
