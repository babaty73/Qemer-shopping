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
  deliveryAddress: string;
}

function buildRequestApprovalMessage(request: RequestApprovalMessageInput): string {
  return [
    "Product request approved — ready to relay to the customer:",
    `Product: ${request.productName}`,
    `Color: ${request.color}`,
    `Size: ${request.size}`,
    `Quantity: ${request.quantity}`,
    `Customer email: ${request.email}`,
    `Delivery address: ${request.deliveryAddress}`,
  ].join("\n");
}

/**
 * Deep link that opens Telegram with a prefilled note after an admin
 * approves a product request — no automated email is sent; the admin
 * reviews this message in Telegram and sends it themselves.
 */
export function getRequestApprovalTelegramLink(request: RequestApprovalMessageInput): string {
  const username = import.meta.env.VITE_TELEGRAM_USERNAME ?? "kemermarket";
  const text = encodeURIComponent(buildRequestApprovalMessage(request));
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
  };
  items: OrderAcceptedMessageItem[];
  totalPrice: number;
  status: string;
}

function buildOrderAcceptedMessage(order: OrderAcceptedMessageInput): string {
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
 * This opens a chat with the BUSINESS'S OWN configured Telegram handle
 * (VITE_TELEGRAM_USERNAME) — the same target every other Telegram link in
 * this app uses (getTelegramOrderLink, getTelegramContactLink,
 * getRequestApprovalTelegramLink). There is no field anywhere for a
 * customer's own Telegram handle: the Order schema's `customer` object
 * only has fullName/phone/email/address (checked back-end/src/models/Order.js
 * and the checkout form), and neither collects a Telegram identifier. A
 * link that opens the *customer's* own Telegram account isn't possible
 * with the data this app currently collects — Telegram deep links can
 * only target a known @username. If customer-targeted messaging is
 * actually needed, that requires collecting a Telegram handle at
 * checkout, which is a schema/form change, not something this function
 * alone can provide.
 */
export function getOrderAcceptedTelegramLink(order: OrderAcceptedMessageInput): string {
  const username = import.meta.env.VITE_TELEGRAM_USERNAME ?? "kemermarket";
  const text = encodeURIComponent(buildOrderAcceptedMessage(order));
  return `https://t.me/${username}?text=${text}`;
}
