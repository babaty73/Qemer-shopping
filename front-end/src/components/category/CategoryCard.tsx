import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  index?: number;
}

/** Large tappable category tile used in the Home page category rail. */
export function CategoryCard({ name, slug, image, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link
        to={`/shop?category=${slug}`}
        className="group relative block aspect-square overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/0 to-neutral-900/0" />
        <span className="absolute bottom-4 left-4 text-lg font-medium text-white">{name}</span>
      </Link>
    </motion.div>
  );
}
