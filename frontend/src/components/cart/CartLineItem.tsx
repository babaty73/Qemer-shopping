import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "./QuantityStepper";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartLineItemProps {
  item: CartItem;
}

/** A single product row — shared by the cart drawer and the full cart page. */
export function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const variantLabel = [item.color, item.size].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-4">
      <Link
        to={`/shop/${item.slug}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted"
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/shop/${item.slug}`}
              className="truncate text-sm font-medium text-neutral-900 hover:text-primary"
            >
              {item.name}
            </Link>
            {variantLabel && <p className="mt-0.5 text-xs text-neutral-400">{variantLabel}</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 rounded-full p-1 text-neutral-400 transition-colors hover:bg-error/10 hover:text-error"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantityStepper
            size="sm"
            quantity={item.quantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
          />
          <p className="price-tag text-sm font-semibold text-neutral-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
