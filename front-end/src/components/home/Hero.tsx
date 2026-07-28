import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

/**
 * Signature moment: the price-tag/mono treatment applied to a single large
 * word, echoing the shop's product cards before the visitor has seen one.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-50">
      <div className="container grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="price-tag inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Addis Ababa · New Stock Weekly
          </span>

          <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-neutral-900 sm:text-5xl lg:text-6xl">
            Shop the catalog.
            <br />
            Order in one tap.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-500 sm:text-lg">
            Kemer Market brings curated products online — browse freely, then
            place your order straight through Telegram or WhatsApp. No
            accounts, no checkout forms.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/shop" className={buttonVariants({ size: "lg" })}>
              Browse the Shop <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Our Story
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-lifted">
            <img
              src="https://picsum.photos/seed/kemer-hero/900/1100"
              alt="A curated selection of Kemer Market products"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="price-tag absolute -bottom-6 -left-6 hidden rounded-2xl bg-white px-5 py-4 shadow-lifted sm:block">
            <p className="text-xs uppercase tracking-wide text-neutral-400">From</p>
            <p className="text-xl font-semibold text-emerald-600">ETB 620</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
