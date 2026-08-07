import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Core catalog card — used by FeaturedProducts on Home and by the Shop grid.
 * The card body links to the product; the quick-add button sits alongside
 * it (not nested inside the <Link>, to keep the markup valid) and adds the
 * default variant — customers who want a specific color/size still go
 * through Product Details.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  function handleQuickAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[0],
      size: product.sizes[0],
    });
    showToast(`Added ${product.name} to cart`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.06, ease: "easeOut" }}
      className="group relative"
    >
      <Link
        to={`/shop/${product.slug}`}
        className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-xs transition-shadow duration-300 group-hover:shadow-card",
            !product.inStock && "opacity-80"
          )}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="featured" className="shadow-xs">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="outOfStock" className="shadow-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-neutral-900">{product.name}</p>
            <p className="mt-1 text-xs text-neutral-400">{product.category}</p>
          </div>
          <p className="price-tag shrink-0 text-sm font-semibold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {product.inStock && (
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-neutral-700 opacity-0 shadow-soft transition-all duration-200 hover:bg-primary hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group-hover:opacity-100"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
        </button>
      )}
    </motion.div>
  );
}
