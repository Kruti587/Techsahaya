import { Link, NavLink } from "react-router-dom";
import { House, CircleUser, GitCompareArrows, MessageSquareText, Network, Search, ShieldCheck, Users, WalletCards } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Logo } from "./Logo";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/dashboard", label: "Dashboard", icon: WalletCards },
  { to: "/ask", label: "Ask Sahaya", icon: MessageSquareText },
  { to: "/schemes", label: "Schemes", icon: Search },
  { to: "/welfare-gaps", label: "Welfare Gaps", icon: ShieldCheck },
  { to: "/family", label: "Family", icon: Users },
  { to: "/what-if", label: "What-If", icon: GitCompareArrows },
  { to: "/journey", label: "Journey", icon: Network },
  { to: "/profile", label: "Profile", icon: CircleUser }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { offline } = useAppContext();
  return (
    <div className="min-h-screen bg-sahaya-sand">
      <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-sahaya-green">
            <Logo size={40} />
            <div>
              <div className="font-bold">Tech Sahaya</div>
              <div className="text-xs text-slate-500">Public-service welfare assistant</div>
            </div>
          </Link>
          <div className="hidden gap-2 md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-3 py-2 text-sm ${isActive ? "bg-sahaya-green text-white" : "text-slate-700 hover:bg-stone-100"}`}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        {offline && <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">You are offline. Cached scheme information is still available.</div>}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 gap-1 border-t bg-white p-2 md:hidden">
        {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center rounded-lg text-[11px] ${isActive ? "bg-sahaya-green text-white" : "text-slate-600"}`}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
