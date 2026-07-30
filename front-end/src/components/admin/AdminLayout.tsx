import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-8 sm:px-10">
        <Outlet />
      </main>
    </div>
  );
}
