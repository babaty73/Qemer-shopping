import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "./CartLineItem";
import { buttonVariants } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";

/** Slide-in quick view of the cart, opened from the navbar's cart icon. */
export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[95] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-neutral-900/45"
            aria-hidden
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-lifted"
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
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                  <ShoppingBag className="h-6 w-6" aria-hidden />
                </div>
                <p className="mt-5 text-base font-medium text-neutral-900">Your cart is empty</p>
                <p className="mt-1.5 text-sm text-neutral-500">Add something you like from the shop.</p>
                <Link to="/shop" onClick={closeCart} className={cn(buttonVariants(), "mt-6")}>
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
                    <span className="price-tag font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link to="/cart" onClick={closeCart} className={buttonVariants({ size: "lg" })}>
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
