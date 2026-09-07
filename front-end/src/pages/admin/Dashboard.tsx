import { useEffect, useState } from "react";
import { AlertTriangle, Package, Star } from "lucide-react";
import { getProducts } from "@/services/products";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface ProductStats {
  total: number;
  featured: number;
  outOfStock: number;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<ProductStats | null>(null);

  useEffect(() => {
    // Each request asks for a single record (limit: 1) and reads back the
    // server's totalResults — an accurate count across the FULL catalog.
    // The previous version fetched up to 48 actual products and counted
    // the array client-side, which silently undercounted every one of
    // these three stats (not just "Total") once the catalog passed 48
    // products, since anything beyond that page was invisible to the count.
    Promise.all([
      getProducts({ limit: 1 }),
      getProducts({ limit: 1, featured: true }),
      getProducts({ limit: 1, inStock: false }),
    ])
      .then(([total, featured, outOfStock]) => {
        setCounts({
          total: total.totalResults,
          featured: featured.totalResults,
          outOfStock: outOfStock.totalResults,
        });
      })
      .catch(() => setCounts({ total: 0, featured: 0, outOfStock: 0 }));
  }, []);

  const stats = [
    {
      label: "Total Products",
      value: counts?.total ?? 0,
      icon: Package,
      iconClass: "bg-primary-light text-primary",
    },
    {
      label: "Featured",
      value: counts?.featured ?? 0,
      icon: Star,
      iconClass: "bg-accent-light text-accent",
    },
    {
      label: "Out of Stock",
      value: counts?.outOfStock ?? 0,
      icon: AlertTriangle,
      iconClass: "bg-warning-light text-warning",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">A quick look at your catalog.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {counts === null
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
