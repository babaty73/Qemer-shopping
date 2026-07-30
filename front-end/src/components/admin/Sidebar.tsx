import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
];

export function Sidebar() {
  const { admin, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-100 bg-white">
      <div className="px-6 py-6">
        <p className="font-display text-lg font-semibold text-neutral-900">Kemer Market</p>
        <p className="text-xs text-neutral-400">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-emerald-50 text-emerald-700" : "text-neutral-600 hover:bg-neutral-50"
              )
            }
          >
            <link.icon className="h-4 w-4" aria-hidden />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-100 px-6 py-4">
        <p className="truncate text-xs text-neutral-400">{admin?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Log out
        </button>
      </div>
    </aside>
  );
}
