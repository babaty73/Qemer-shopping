import type { ReactNode } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
}

/** Responsive product grid with built-in loading and empty states. */
export function ProductGrid({ products, loading, emptyMessage, emptyAction }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description={emptyMessage ?? "Try a different search term or category."}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
