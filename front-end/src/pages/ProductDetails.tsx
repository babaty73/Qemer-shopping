import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { SizeSelector } from "@/components/product/SizeSelector";
import { OrderButtons } from "@/components/product/OrderButtons";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { ALL_PRODUCTS } from "@/lib/mockData";
import { cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

function buildVariantLabel(color?: string, size?: string): string | undefined {
  const parts = [color && `Color: ${color}`, size && `Size: ${size}`].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => ALL_PRODUCTS.find((p) => p.slug === slug), [slug]);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);

  // Reset the selection whenever the visitor navigates to a different product.
  useEffect(() => {
    setSelectedColor(product?.colors[0]);
    setSelectedSize(product?.sizes[0]);
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="container flex flex-col items-center py-32 text-center">
        <p className="text-lg font-medium text-neutral-900">Product not found</p>
        <p className="mt-2 text-sm text-neutral-500">It may have sold out or been removed.</p>
        <Link to="/shop" className={cn(buttonVariants(), "mt-6")}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <Link
        to="/shop"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ImageGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-medium text-neutral-900 sm:text-4xl">{product.name}</h1>
          <p className="price-tag mt-4 text-2xl font-semibold text-emerald-600">
            {formatPrice(product.price)}
          </p>

          {!product.inStock && (
            <Badge variant="outOfStock" className="mt-4">
              Out of Stock
            </Badge>
          )}

          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
            {product.description}
          </p>

          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-neutral-900">
                Color{selectedColor ? `: ${selectedColor}` : ""}
              </p>
              <ColorSwatches colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-neutral-900">
                Size{selectedSize ? `: ${selectedSize}` : ""}
              </p>
              <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
            </div>
          )}

          <div className="mt-10">
            <OrderButtons product={product} variantLabel={buildVariantLabel(selectedColor, selectedSize)} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <SectionTitle eyebrow="You Might Also Like" title="Related products" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
