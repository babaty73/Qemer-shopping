import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));

/**
 * Home and Shop are wired so far — Product Details, About, Contact, and the
 * Admin routes are added in their own milestones as each page is actually
 * built, so there are no stub/placeholder routes here.
 */
function StorefrontLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function PageFallback() {
  return <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-400">Loading…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
