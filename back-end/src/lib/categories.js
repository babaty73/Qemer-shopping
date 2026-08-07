/**
 * Fixed storefront taxonomy, mirrored from frontend/src/lib/mockData.ts
 * (CATEGORIES). Used to resolve a category *slug* from the Shop page filter
 * into the *display name* stored on Product.category. Keep both lists in
 * sync — a proper Category collection is a natural future milestone once
 * the catalog needs to grow beyond this fixed set.
 */
export const CATEGORIES = [
  { name: "Electronics", slug: "electronics" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Fashion", slug: "fashion" },
  { name: "Beauty", slug: "beauty" },
];

export function categoryNameForSlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
}
