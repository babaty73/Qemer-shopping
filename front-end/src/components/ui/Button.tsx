import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-card",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary-hover hover:shadow-card",
        outline:
          "border border-border bg-surface text-neutral-800 hover:border-primary/40 hover:bg-primary-light hover:text-primary",
        ghost: "text-neutral-700 hover:bg-neutral-100",
        link: "text-primary underline-offset-4 hover:underline",
        danger: "bg-error text-white shadow-soft hover:bg-error/90 hover:shadow-card",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: ReactNode;
}

/**
 * Base action control used across the storefront and admin dashboard.
 * Order buttons (Telegram/WhatsApp) render as <a> tags styled with the
 * same variants — see ProductDetails. `danger` is reserved for destructive
 * admin actions (delete confirmations).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
