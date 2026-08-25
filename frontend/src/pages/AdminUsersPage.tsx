import { useEffect, useState } from "react";
import { api } from "../services/api";

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { api.get("/api/admin/users").then((res) => setUsers(res.data)); }, []);
  return <div className="space-y-3">{users.map((user) => <div key={user.id} className="rounded-2xl bg-white p-4 shadow-card"><div className="font-semibold">{user.full_name}</div><div className="text-sm">{user.email}</div><div className="text-sm text-slate-600">{user.role}</div></div>)}</div>;
}
