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
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

/** Loading placeholder for the Product Details page (gallery + info column). */
export function ProductDetailsSkeleton() {
  return (
    <div className="container py-16">
      <Skeleton className="mb-8 h-4 w-24" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-6 h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Loading placeholder for the admin products table rows. */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className={cn("h-4", i === 0 ? "w-40" : "w-16")} />
        </td>
      ))}
    </tr>
  );
}

/** Loading placeholder for admin stat cards. */
export function StatCardSkeleton() {
  return (
    <div className="surface-card p-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-4 w-24" />
    </div>
  );
}
