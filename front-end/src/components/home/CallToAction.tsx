import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";

export function CallToAction() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 text-center sm:px-16"
        >
          <h2 className="text-3xl font-medium text-white sm:text-4xl">
            Found something you like?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-neutral-300">
            Reach out directly — most orders are confirmed in minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://t.me/${CONTACT_INFO.telegramHandle}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "lg" })}
            >
              <Send className="h-4 w-4" aria-hidden /> Message on Telegram
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> Message on WhatsApp
            </a>
          </div>

          <Link
            to="/shop"
            className="mt-6 inline-block text-sm font-medium text-neutral-400 hover:text-white"
          >
            or keep browsing the shop →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
