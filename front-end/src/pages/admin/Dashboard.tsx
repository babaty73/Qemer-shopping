import { useEffect, useState } from "react";
import { AlertTriangle, Package, Star } from "lucide-react";
import { getProducts } from "@/services/products";
import type { Product } from "@/types";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    // Limit is capped at 48 server-side — fine for an MVP-scale catalog;
    // a dedicated stats endpoint is the right move once it outgrows that.
    getProducts({ limit: 48 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]));
  }, []);

  const stats = [
    { label: "Total Products", value: products?.length ?? 0, icon: Package },
    { label: "Featured", value: products?.filter((p) => p.featured).length ?? 0, icon: Star },
    { label: "Out of Stock", value: products?.filter((p) => !p.inStock).length ?? 0, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">A quick look at your catalog.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <stat.icon className="h-5 w-5" aria-hidden />
            </div>
            <p className="price-tag mt-4 text-3xl font-semibold text-neutral-900">
              {products === null ? "—" : stat.value}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
