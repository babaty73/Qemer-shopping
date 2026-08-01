import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { SizeSelector } from "@/components/product/SizeSelector";
import { OrderButtons } from "@/components/product/OrderButtons";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { ProductDetailsSkeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/Button";
import { getProductBySlug, getProducts } from "@/services/products";
import { cn, formatPrice } from "@/lib/utils";
import { categorySlugForName } from "@/lib/mockData";
import type { Product } from "@/types";

function buildVariantLabel(color?: string, size?: string): string | undefined {
  const parts = [color && `Color: ${color}`, size && `Size: ${size}`].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

  // undefined = still loading, null = confirmed not found
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setProduct(undefined);
    setRelated([]);

    getProductBySlug(slug)
      .then((fetched) => {
        if (!active) return;
        setProduct(fetched);
        setSelectedColor(fetched.colors[0]);
        setSelectedSize(fetched.sizes[0]);

        const categorySlug = categorySlugForName(fetched.category);
        return getProducts({ category: categorySlug, exclude: fetched.slug, limit: 4 });
      })
      .then((res) => {
        if (active && res) setRelated(res.products);
      })
      .catch(() => {
        if (active) setProduct(null);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (product === undefined) {
    return <ProductDetailsSkeleton />;
  }

  if (product === null) {
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
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
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
          <p className="price-tag mt-4 text-2xl font-semibold text-primary">
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
