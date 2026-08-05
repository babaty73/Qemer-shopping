import { Sparkles } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { useProductRequest } from "@/context/ProductRequestContext";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface RequestProductButtonProps extends VariantProps<typeof buttonVariants> {
  /** Pre-fills the form's Product Name — e.g. the product being viewed. */
  productName?: string;
  label?: string;
  className?: string;
}

/** Reusable trigger — drop this anywhere a "Request a Product" CTA makes sense. */
export function RequestProductButton({
  productName,
  label = "Can't Find What You're Looking For?",
  variant,
  size,
  className,
}: RequestProductButtonProps) {
  const { openRequestForm } = useProductRequest();

  return (
    <button
      type="button"
      onClick={() => openRequestForm(productName)}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <Sparkles className="h-4 w-4" aria-hidden /> {label}
    </button>
  );
}
