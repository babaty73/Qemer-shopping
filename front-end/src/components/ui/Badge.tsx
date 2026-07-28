import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Small stamped label — the storefront's recurring "market stamp" motif,
 * used for Featured / New / Out of Stock indicators on product cards.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        featured: "border-emerald-200 bg-emerald-50 text-emerald-700",
        sale: "border-amber-200 bg-amber-50 text-amber-700",
        outOfStock: "border-neutral-200 bg-neutral-100 text-neutral-500",
        neutral: "border-neutral-200 bg-white text-neutral-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
