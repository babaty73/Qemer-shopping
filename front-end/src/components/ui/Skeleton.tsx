import { cn } from "@/lib/utils";

/**
 * Shimmering placeholder block. Compose it into shapes (ProductCardSkeleton,
 * etc.) rather than styling `.skeleton` ad hoc — keeps loading states consistent.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("skeleton animate-shimmer rounded-xl", className)}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Loading placeholder shaped like a ProductCard, used by the Shop grid. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
