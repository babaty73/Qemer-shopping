import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { QuantityStepper } from "./QuantityStepper";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
}

/** Quantity stepper + Add to Cart action, used on the Product Details page. */
export function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    showToast(`Added ${quantity} × ${product.name} to cart`);
    setQuantity(1);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper quantity={quantity} onChange={(q) => setQuantity(Math.max(1, q))} />
      <button type="button" onClick={handleAdd} className={cn(buttonVariants({ size: "lg" }), "flex-1 sm:flex-none")}>
        <ShoppingBag className="h-4 w-4" aria-hidden /> Add to Cart
      </button>
    </div>
  );
}
