/**
 * A single line in the cart. `id` is a composite of productId + variant so
 * the same product in two different colors/sizes is tracked as two
 * separate lines — matching how most ecommerce carts behave.
 */
export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
}

export function buildCartItemId(productId: string, color?: string, size?: string): string {
  return [productId, color ?? "", size ?? ""].join("::");
}
