import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-background">
      <button
        type="button"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsSidebarOpen((open) => !open)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-neutral-700 shadow-soft transition-colors hover:bg-neutral-50 lg:hidden"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-900/20 lg:hidden"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 pt-20 sm:px-6 sm:pt-6 lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
