import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent heading block used to open every major homepage/shop section.
 * Reveals with a short fade/rise on scroll-into-view.
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="price-tag mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-medium text-neutral-900 sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base text-neutral-500">{description}</p>
      )}
    </motion.div>
  );
}
