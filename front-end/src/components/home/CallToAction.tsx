import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";
import { useProductRequest } from "@/context/ProductRequestContext";

export function CallToAction() {
  const { openRequestForm } = useProductRequest();
  return (
    
    <section className="py-20 sm:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-900 px-8 py-16 text-center sm:px-16"
        >
          <h2 className="text-3xl font-medium text-white sm:text-4xl">
            Can't find what you want?
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
              <button
                type="button"
                onClick={() => openRequestForm()}
                className={buttonVariants({ size: "lg" })}
              >
                Request Form
              </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
