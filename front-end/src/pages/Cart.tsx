import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { PaymentInfoCard } from "@/components/checkout/PaymentInfoCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const { items, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <SectionTitle eyebrow="Cart" title="Your Cart" />
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            description="Browse the shop and add something you like."
            action={
              <Link to="/shop" className={buttonVariants({ size: "lg" })}>
                Browse Shop
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Cart"
          title="Your Cart"
          description={`${items.length} item${items.length === 1 ? "" : "s"}`}
        />
        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-error"
        >
          <Trash2 className="h-4 w-4" aria-hidden /> Clear cart
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="surface-card divide-y divide-border p-6 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="py-5 first:pt-0 last:pb-0">
              <CartLineItem item={item} />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Order Summary</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="price-tag font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Delivery is arranged directly after checkout.</p>
            <Link to="/checkout" className={buttonVariants({ size: "lg", className: "mt-5 w-full" })}>
              <ShoppingBag className="h-4 w-4" aria-hidden /> Proceed to Checkout
            </Link>
          </div>

          <PaymentInfoCard />
        </div>
      </div>
    </div>
  );
}
