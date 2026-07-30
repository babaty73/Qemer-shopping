/**
 * Storefront category taxonomy. This is the one piece of "mock" data that
 * stays — categories are a fixed, admin-independent list rather than a
 * database collection (see backend/src/lib/categories.js, which mirrors
 * this exact list). Product data itself now comes entirely from the API;
 * see src/services/products.ts.
 */
export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/kemer-electronics/600/600" },
  { name: "Home & Living", slug: "home-living", image: "https://picsum.photos/seed/kemer-home/600/600" },
  { name: "Fashion", slug: "fashion", image: "https://picsum.photos/seed/kemer-fashion/600/600" },
  { name: "Beauty", slug: "beauty", image: "https://picsum.photos/seed/kemer-beauty/600/600" },
];

export function categorySlugForName(name: string): string | undefined {
  return CATEGORIES.find((c) => c.name === name)?.slug;
}
