import { Link } from "react-router-dom";
import { MessageCircle, Send, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { CONTACT_INFO, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useProductRequest } from "@/context/ProductRequestContext";

/**
 * Site-wide footer: business identity, quick nav, and direct order channels.
 * Telegram/WhatsApp here link to the general business accounts (no product
 * context) — product-specific prefilled links live on ProductDetails.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { openRequestForm } = useProductRequest();

  return (
    <footer className="border-t border-border bg-neutral-50">
      <div className="container grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-neutral-900">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
            Curated products, browsed online, ordered directly — no checkout
            friction, just a message away.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-900">Explore</p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-neutral-500 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => openRequestForm()}
                className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary"
              >
                <Sparkles className="h-4 w-4" aria-hidden /> Request a Product
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-900">Order With Us</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={`https://t.me/${CONTACT_INFO.telegramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary"
              >
                <Send className="h-4 w-4" aria-hidden /> Telegram
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-900">Contact</p>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-2 text-sm text-neutral-500">
              <Phone className="h-4 w-4 shrink-0" aria-hidden /> {CONTACT_INFO.phoneDisplay}
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-500">
              <Mail className="h-4 w-4 shrink-0" aria-hidden /> {CONTACT_INFO.email}
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-500">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden /> {CONTACT_INFO.addressDisplay}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container text-center text-xs text-neutral-400">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
