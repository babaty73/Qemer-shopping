import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving conflicting Tailwind utilities correctly. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Telegram's own username rules: 5-32 characters, must start with a letter,
// the rest letters/digits/underscores. Applied after stripping an optional
// leading "@" so both "@customer123" and "customer123" validate the same
// way. Mirrors back-end/src/utils/telegramUsername.js — kept as a small,
// separately-maintained duplicate rather than a shared package, the same
// tradeoff already made for the category list (see lib/mockData.ts).
const TELEGRAM_USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

/** Strips an optional leading "@" and surrounding whitespace — "@customer123" and "customer123" both -> "customer123". */
export function normalizeTelegramUsername(value: string): string {
  return value.trim().replace(/^@/, "");
}

/** True if `value`, once normalized, matches Telegram's username format. */
export function isValidTelegramUsername(value: string): boolean {
  return TELEGRAM_USERNAME_PATTERN.test(normalizeTelegramUsername(value));
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
  /** e.g. "Color: Black, Size: M" — appended as its own line when provided. */
  variant?: string;
}

function buildOrderMessage({ name, price, slug, variant }: OrderMessageInput): string {
  const lines = [
    "Hi Kemer Market, I'd like to order:",
    `Product: ${name}`,
  ];
  if (variant) lines.push(variant);
  lines.push(`Price: ${formatPrice(price)}`, `Link: ${getProductUrl(slug)}`);
  return lines.join("\n");
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

interface ContactMessageInput {
  name: string;
  email?: string;
  message: string;
}

function buildContactMessage({ name, email, message }: ContactMessageInput): string {
  const lines = [`Hi Kemer Market, my name is ${name}.`];
  if (email) lines.push(`Email: ${email}`);
  lines.push("", message);
  return lines.join("\n");
}

/** Deep link that opens Telegram with the contact form's message prefilled. */
export function getTelegramContactLink(input: ContactMessageInput): string {
  const username = import.meta.env.VITE_TELEGRAM_USERNAME ?? "kemermarket";
  const text = encodeURIComponent(buildContactMessage(input));
  return `https://t.me/${username}?text=${text}`;
}

/** Deep link that opens WhatsApp with the contact form's message prefilled. */
export function getWhatsAppContactLink(input: ContactMessageInput): string {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? "251900000000";
  const text = encodeURIComponent(buildContactMessage(input));
  return `https://wa.me/${phone}?text=${text}`;
}

interface RequestApprovalMessageInput {
  productName: string;
  color: string;
  size: string;
  quantity: number;
  email: string;
  telegramUsername?: string;
  deliveryAddress: string;
}

function buildRequestApprovalMessage(request: RequestApprovalMessageInput, telegramUsername: string): string {
  return [
    "Product request approved — ready to relay to the customer:",
    `Product: ${request.productName}`,
    `Color: ${request.color}`,
    `Size: ${request.size}`,
    `Quantity: ${request.quantity}`,
    `Customer email: ${request.email}`,
    `Telegram: @${telegramUsername}`,
    `Delivery address: ${request.deliveryAddress}`,
  ].join("\n");
}

/**
 * Deep link that opens Telegram with a prefilled note after an admin
 * approves a product request — no automated email is sent; the admin
 * reviews this message in Telegram and sends it themselves.
 *
 * Targets the CUSTOMER's own Telegram username (collected on the request
 * form, stored on `request.telegramUsername`), not the business's
 * configured handle — see getOrderAcceptedTelegramLink's comment for why
 * this direction is different from getTelegramContactLink/
 * getTelegramOrderLink above. Returns null if the request has no usable
 * Telegram username (requests created before this field existed); the
 * caller must handle that rather than falling back to the business's own
 * Telegram account.
 */
export function getRequestApprovalTelegramLink(request: RequestApprovalMessageInput): string | null {
  const username = request.telegramUsername ? normalizeTelegramUsername(request.telegramUsername) : "";
  if (!isValidTelegramUsername(username)) return null;

  const text = encodeURIComponent(buildRequestApprovalMessage(request, username));
  return `https://t.me/${username}?text=${text}`;
}

interface OrderAcceptedMessageItem {
  name: string;
  price: number;
  color?: string;
  size?: string;
  quantity: number;
}

interface OrderAcceptedMessageInput {
  _id: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    telegramUsername?: string;
  };
  items: OrderAcceptedMessageItem[];
  totalPrice: number;
  status: string;
}

function buildOrderAcceptedMessage(order: OrderAcceptedMessageInput, telegramUsername: string): string {
  const itemLines = order.items.map((item) => {
    const variant = [item.color, item.size].filter(Boolean).join(", ");
    return `- ${item.name}${variant ? ` (${variant})` : ""} x${item.quantity} — ${formatPrice(
      item.price * item.quantity
    )}`;
  });

  return [
    "Order Accepted — Payment Confirmed",
    `Order #: ${order._id.slice(-8).toUpperCase()}`,
    `Customer: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Telegram: @${telegramUsername}`,
    `Delivery address: ${order.customer.address}`,
    "",
    "Items:",
    ...itemLines,
    "",
    `Total: ${formatPrice(order.totalPrice)}`,
    `Status: ${order.status}`,
  ].join("\n");
}

/**
 * Deep link that opens Telegram with a prefilled note after an admin
 * accepts an order (payment confirmed) — no automated message is sent;
 * the admin reviews this in Telegram and sends it themselves.
 *
 * This targets the CUSTOMER's own Telegram username (collected at
 * checkout and stored on `order.customer.telegramUsername`), NOT the
 * business's configured handle — unlike getTelegramOrderLink/
 * getTelegramContactLink above, which intentionally open a chat with the
 * business account because the customer is the one reaching out in those
 * flows. Here the direction is reversed: the admin is reaching out to a
 * specific customer, so the link must target that customer's own account.
 *
 * Returns null if the order has no usable Telegram username — this is
 * expected for orders created before this field existed, and the caller
 * must handle it (show the admin a clear message) rather than silently
 * falling back to the business's own Telegram account, which would send
 * the note to the store's own chat instead of the customer.
 */
export function getOrderAcceptedTelegramLink(order: OrderAcceptedMessageInput): string | null {
  const username = order.customer.telegramUsername
    ? normalizeTelegramUsername(order.customer.telegramUsername)
    : "";
  if (!isValidTelegramUsername(username)) return null;

  const text = encodeURIComponent(buildOrderAcceptedMessage(order, username));
  return `https://t.me/${username}?text=${text}`;
}
