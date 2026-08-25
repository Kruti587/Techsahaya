import { useEffect, useState } from "react";
import { api } from "../services/api";

export function AdminAuditPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.get("/api/admin/audit").then((res) => setItems(res.data)); }, []);
  return <div className="space-y-3">{items.map((item) => <div key={item.id} className="rounded-2xl bg-white p-4 shadow-card"><div className="font-semibold">{item.event_type}</div><div className="text-sm">{item.detail}</div><div className="text-xs text-slate-500">{item.created_at}</div></div>)}</div>;
}
