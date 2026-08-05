import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RequestProductFAB } from "@/components/product-request/RequestProductFAB";
import { ProductRequestModal } from "@/components/product-request/ProductRequestModal";

/**
 * Shell applied to every public storefront route (wired to React Router via
 * <Outlet />). Kept as a plain children wrapper so it's also usable directly
 * around a single page during development. The cart drawer and the product
 * request FAB/modal are mounted here — both storefront-only concerns, not
 * part of the admin dashboard shell.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <RequestProductFAB />
      <ProductRequestModal />
    </div>
  );
}
