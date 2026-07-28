import { motion } from "framer-motion";
import { MessageCircleMore, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Vetted products",
    description: "Every item is reviewed for quality before it's listed — no dropship guesswork.",
  },
  {
    icon: MessageCircleMore,
    title: "Order directly, no friction",
    description: "Message us on Telegram or WhatsApp and we'll confirm your order personally.",
  },
  {
    icon: Truck,
    title: "Reliable delivery",
    description: "Straightforward delivery across Addis Ababa, coordinated after you order.",
  },
  {
    icon: Sparkles,
    title: "Fresh drops weekly",
    description: "The catalog is refreshed regularly, so there's always something new to see.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <SectionTitle eyebrow="Why Kemer Market" title="Built around trust, not a checkout" align="center" />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              className="rounded-2xl border border-neutral-100 p-6 text-center shadow-soft"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <reason.icon className="h-6 w-6" aria-hidden />
              </div>
              <p className="mt-4 text-base font-medium text-neutral-900">{reason.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
