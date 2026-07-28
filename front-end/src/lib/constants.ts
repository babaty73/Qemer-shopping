/**
 * Central business/contact configuration. These are safe defaults for local
 * development — override VITE_TELEGRAM_USERNAME / VITE_WHATSAPP_NUMBER in
 * .env for production (see .env.example).
 */
export const SITE_NAME = "Kemer Market";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const CONTACT_INFO = {
  telegramHandle: import.meta.env.VITE_TELEGRAM_USERNAME ?? "kemermarket",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? "251900000000",
  phoneDisplay: "+251 90 000 0000",
  email: "hello@kemermarket.com",
  addressDisplay: "Bole, Addis Ababa, Ethiopia",
} as const;
