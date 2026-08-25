import { useEffect, useState } from "react";
import { api } from "../services/api";

export function AdminRulesPage() {
  const [rules, setRules] = useState<Record<string, unknown>>({});
  useEffect(() => { api.get("/api/admin/rules").then((res) => setRules(res.data)); }, []);
  return <pre className="overflow-auto rounded-3xl bg-white p-6 text-xs shadow-card">{JSON.stringify(rules, null, 2)}</pre>;
}
