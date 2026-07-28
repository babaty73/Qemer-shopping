import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Core catalog card — used by FeaturedProducts on Home and by the Shop grid.
 * The whole card links to the product; order actions live on ProductDetails.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.06, ease: "easeOut" }}
    >
      <Link
        to={`/shop/${product.slug}`}
        className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.featured && <Badge variant="featured">Featured</Badge>}
            {!product.inStock && <Badge variant="outOfStock">Out of Stock</Badge>}
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-neutral-900">{product.name}</p>
            <p className="mt-1 text-xs text-neutral-400">{product.category}</p>
          </div>
          <p className="price-tag shrink-0 text-sm font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
