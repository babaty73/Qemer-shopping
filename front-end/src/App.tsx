import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const ProductForm = lazy(() => import("@/pages/admin/ProductForm"));

/** The public storefront shell — Navbar/Footer around every non-admin page. */
function StorefrontLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-400">Loading…</div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:slug" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:slug/edit" element={<ProductForm />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}
