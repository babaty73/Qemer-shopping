import { useEffect, useState } from "react";
import { AlertTriangle, Package, Star } from "lucide-react";
import { getProducts } from "@/services/products";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
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
    {
      label: "Total Products",
      value: products?.length ?? 0,
      icon: Package,
      iconClass: "bg-primary-light text-primary",
    },
    {
      label: "Featured",
      value: products?.filter((p) => p.featured).length ?? 0,
      icon: Star,
      iconClass: "bg-accent-light text-accent",
    },
    {
      label: "Out of Stock",
      value: products?.filter((p) => !p.inStock).length ?? 0,
      icon: AlertTriangle,
      iconClass: "bg-warning-light text-warning",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">A quick look at your catalog.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {products === null
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => (
              <div key={stat.label} className="surface-card p-6">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", stat.iconClass)}>
                  <stat.icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="price-tag mt-4 text-3xl font-semibold text-neutral-900">{stat.value}</p>
                <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
