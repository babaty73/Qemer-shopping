import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  size?: "sm" | "md";
  className?: string;
}

/** Shared +/- quantity control used on the cart drawer, cart page, and product details. */
export function QuantityStepper({ quantity, onChange, size = "md", className }: QuantityStepperProps) {
  const dimension = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <div
      className={cn("inline-flex items-center rounded-full border border-border bg-surface", className)}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100",
          dimension
        )}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className="w-8 text-center text-sm font-medium text-neutral-900" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100",
          dimension
        )}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
