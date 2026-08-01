import { Send, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/contact/ContactForm";
import { GoogleMap } from "@/components/contact/GoogleMap";
import { CONTACT_INFO } from "@/lib/constants";

const CHANNELS = [
  {
    icon: Send,
    label: "Telegram",
    value: `@${CONTACT_INFO.telegramHandle}`,
    href: `https://t.me/${CONTACT_INFO.telegramHandle}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT_INFO.phoneDisplay,
    href: `https://wa.me/${CONTACT_INFO.whatsappNumber}`,
  },
  { icon: Phone, label: "Phone", value: CONTACT_INFO.phoneDisplay, href: `tel:${CONTACT_INFO.whatsappNumber}` },
  { icon: Mail, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
];

export default function Contact() {
  return (
    <div className="container py-16">
      <SectionTitle
        eyebrow="Get in Touch"
        title="Contact Kemer Market"
        description="Reach us directly, or send a message below."
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <ul className="space-y-4">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-neutral-700 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <channel.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium text-neutral-900">{channel.label}</span>
                    <span className="price-tag text-neutral-500">{channel.value}</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-neutral-700 shadow-xs">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-medium text-neutral-900">Address</span>
                <span className="text-neutral-500">{CONTACT_INFO.addressDisplay}</span>
              </span>
            </li>
          </ul>

          <div className="mt-8">
            <GoogleMap address={CONTACT_INFO.addressDisplay} />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
