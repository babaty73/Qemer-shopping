import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * Shell applied to every public storefront route (wired to React Router via
 * <Outlet />). Kept as a plain children wrapper so it's also usable directly
 * around a single page during development. The cart drawer is mounted here
 * — it's a storefront-only concern, not part of the admin dashboard shell.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
