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
        featured: "border-primary/20 bg-primary-light text-primary",
        sale: "border-secondary/25 bg-secondary-light text-secondary",
        outOfStock: "border-border bg-neutral-100 text-neutral-500",
        neutral: "border-border bg-surface text-neutral-700",
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
