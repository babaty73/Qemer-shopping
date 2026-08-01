import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-10 sm:py-8">
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <button
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
          <span className="text-lg font-semibold text-neutral-900">Admin</span>
        </div>

        <Outlet />
      </main>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 sm:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
