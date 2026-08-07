import { motion } from "framer-motion";
import { HowItWorks } from "@/components/about/HowItWorks";
import { CallToAction } from "@/components/home/CallToAction";

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary-light/60 via-neutral-50 to-neutral-50 py-20 sm:py-28">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="price-tag inline-block rounded-full border border-primary/20 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-xs">
              Our Story
            </span>
            <h1 className="mt-6 text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
              A curated shop, run the way a market should feel.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Kemer Market started with a simple idea: browsing should be
              effortless, and ordering shouldn't need another account or
              checkout form. We handpick every product, then let you order
              the way you already message people — on Telegram or WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      <HowItWorks />
      <CallToAction />
    </div>
  );
}
