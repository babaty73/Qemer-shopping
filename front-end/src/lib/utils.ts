import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving conflicting Tailwind utilities correctly. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Ethiopian Birr, e.g. formatPrice(1250) -> "ETB 1,250". */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("ETB", "ETB ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a canonical product URL for sharing in order messages. */
export function getProductUrl(slug: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/shop/${slug}`;
}

interface OrderMessageInput {
  name: string;
  price: number;
  slug: string;
}

function buildOrderMessage({ name, price, slug }: OrderMessageInput): string {
  return [
    "Hi Kemer Market, I'd like to order:",
    `Product: ${name}`,
    `Price: ${formatPrice(price)}`,
    `Link: ${getProductUrl(slug)}`,
  ].join("\n");
}

/** Deep link that opens a prefilled order message with the Kemer Market Telegram account. */
export function getTelegramOrderLink(product: OrderMessageInput): string {
  const username = import.meta.env.VITE_TELEGRAM_USERNAME ?? "kemermarket";
  const text = encodeURIComponent(buildOrderMessage(product));
  return `https://t.me/${username}?text=${text}`;
}

/** Deep link that opens a prefilled order message with the Kemer Market WhatsApp number. */
export function getWhatsAppOrderLink(product: OrderMessageInput): string {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? "251900000000";
  const text = encodeURIComponent(buildOrderMessage(product));
  return `https://wa.me/${phone}?text=${text}`;
}

/** Convert "Green" -> "green", used for mapping color names to swatch tokens. */
export function slugifyToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
