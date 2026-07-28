import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Shell applied to every public storefront route (wired to React Router in
 * the next milestone via <Outlet />). Kept as a plain children wrapper for
 * now so it's also usable directly around a single page during development.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
