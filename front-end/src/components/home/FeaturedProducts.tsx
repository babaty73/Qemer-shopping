import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/services/products";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProducts({ featured: true, limit: 4 })
      .then((res) => {
        if (active) setProducts(res.products);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-y border-border bg-surface py-20 sm:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Just In"
            title="Featured products"
            description="A rotating edit of what's moving fastest this week."
          />
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all products <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </section>
  );
}
