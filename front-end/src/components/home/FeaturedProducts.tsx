import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FEATURED_PRODUCTS } from "@/lib/mockData";

export function FeaturedProducts() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Just In"
            title="Featured products"
            description="A rotating edit of what's moving fastest this week."
          />
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all products <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid products={FEATURED_PRODUCTS} />
        </div>
      </div>
    </section>
  );
}
