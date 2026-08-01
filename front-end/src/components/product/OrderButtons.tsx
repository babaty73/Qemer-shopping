import { Send, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { buttonVariants } from "@/components/ui/Button";
import { getTelegramOrderLink, getWhatsAppOrderLink } from "@/lib/utils";

interface OrderButtonsProps {
  product: Product;
  /** e.g. "Color: Black, Size: M" — passed through into the prefilled message. */
  variantLabel?: string;
}

/**
 * The site's core conversion action: opens Telegram/WhatsApp with a
 * message already filled in with the product name, price, variant, and link.
 */
export function OrderButtons({ product, variantLabel }: OrderButtonsProps) {
  if (!product.inStock) {
    return (
      <div className="rounded-2xl border border-dashed border-border-strong bg-surface-muted px-5 py-4 text-sm text-neutral-500">
        Currently out of stock — check back soon, or message us to ask about restock timing.
      </div>
    );
  }

  const linkInput = { name: product.name, price: product.price, slug: product.slug, variant: variantLabel };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={getTelegramOrderLink(linkInput)}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ size: "lg", className: "flex-1" })}
      >
        <Send className="h-4 w-4" aria-hidden /> Order on Telegram
      </a>
      <a
        href={getWhatsAppOrderLink(linkInput)}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: "secondary", size: "lg", className: "flex-1" })}
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> Order on WhatsApp
      </a>
    </div>
  );
}
