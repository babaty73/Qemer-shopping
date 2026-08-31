import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "./CartLineItem";
import { buttonVariants } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";

/** Slide-in quick view of the cart, opened from the navbar's cart icon. */
export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <motion.button
        type="button"
        aria-label="Close cart"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 cursor-default bg-neutral-900/45"
        onClick={closeCart}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-surface shadow-lifted"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="text-base font-medium text-neutral-900">
            Your Cart {items.length > 0 && `(${items.length})`}
          </p>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>

            <p className="mt-5 text-base font-medium text-neutral-900">
              Your cart is empty
            </p>

            <p className="mt-1.5 text-sm text-neutral-500">
              Add something you like from the shop.
            </p>

            <Link
              to="/shop"
              onClick={closeCart}
              className={cn(buttonVariants(), "mt-6")}
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-5">
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>

                <span className="price-tag font-semibold text-neutral-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className={buttonVariants({ size: "lg" })}
                >
                  View Cart
                </Link>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
