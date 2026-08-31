import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { ProductRequestProvider } from "@/context/ProductRequestContext";

const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const ProductForm = lazy(() => import("@/pages/admin/ProductForm"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const OrderDetail = lazy(() => import("@/pages/admin/OrderDetail"));
const AdminRequests = lazy(() => import("@/pages/admin/AdminRequests"));
const RequestDetail = lazy(() => import("@/pages/admin/RequestDetail"));

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
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-neutral-400">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <ProductRequestProvider>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route element={<StorefrontLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:slug" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/:slug/edit" element={<ProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="requests" element={<AdminRequests />} />
                    <Route path="requests/:id" element={<RequestDetail />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </ProductRequestProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
