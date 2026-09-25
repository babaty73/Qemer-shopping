/**
 * Storefront category taxonomy. This is the one piece of "mock" data that
 * stays — categories are a fixed, admin-independent list rather than a
 * database collection (see backend/src/lib/categories.js, which mirrors
 * this exact list). Product data itself now comes entirely from the API; https://picsum.photos/seed/kemer-electronics/600/600
 * see src/services/products.ts. https://www.redeweb.com/wp-content/uploads/2023/10/aparatos-electronicos.jpg
 */
export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", image: "https://www.redeweb.com/wp-content/uploads/2023/10/aparatos-electronicos.jpg" },
  { name: "Home & Living", slug: "home-living", image: "https://picsum.photos/seed/kemer-home/600/600" },
  { name: "Fashion", slug: "fashion", image: "https://assets.vogue.com/photos/60d4f0ee31f3da1aa8f2b388/master/w_1280,c_limit/Paris%20Mens%20SS22%20day%203%20by%20STYLEDUMONDE%20Street%20Style%20Fashion%20Photography_95A5612FullRes.jpg" },
  { name: "Beauty", slug: "beauty", image: "https://wardabeauty.ae/cdn/shop/collections/beauty-tools-image.png?v=1771931890&width=1500" },
];

export function categorySlugForName(name: string): string | undefined {
  return CATEGORIES.find((c) => c.name === name)?.slug;
}
