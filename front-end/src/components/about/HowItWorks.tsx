import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";

const STEPS = [
  { title: "Browse the catalog", description: "Explore products by category, search, or just scroll — no account needed." },
  { title: "Message us your order", description: "Tap Order on Telegram or WhatsApp — your product, price, and link are already filled in." },
  { title: "We confirm the details", description: "We reply directly to confirm availability, variant, and total." },
  { title: "Delivery, arranged directly", description: "Once confirmed, we coordinate delivery with you personally." },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <SectionTitle eyebrow="How It Works" title="From browsing to your door" align="center" />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              className="text-center"
            >
              <div className="price-tag mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-white shadow-soft">
                {index + 1}
              </div>
              <p className="mt-4 text-base font-medium text-neutral-900">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
