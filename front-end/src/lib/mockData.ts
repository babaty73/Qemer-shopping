import type { Product } from "@/types";

/**
 * Temporary local data so the Home/Shop UI has something real to render.
 * Swap these out once the Product API milestone lands — every component
 * that consumes this only needs a Product[]/string[] shape, so the switch
 * to `fetch("/api/products")` is a one-line change, not a rewrite.
 */
export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/kemer-electronics/600/600" },
  { name: "Home & Living", slug: "home-living", image: "https://picsum.photos/seed/kemer-home/600/600" },
  { name: "Fashion", slug: "fashion", image: "https://picsum.photos/seed/kemer-fashion/600/600" },
  { name: "Beauty", slug: "beauty", image: "https://picsum.photos/seed/kemer-beauty/600/600" },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "Wireless Charging Stand",
    slug: "wireless-charging-stand",
    description: "A fast-charging stand with a soft-touch matte finish, angled for hands-free calls.",
    category: "Electronics",
    price: 1450,
    images: ["https://picsum.photos/seed/kemer-p1/800/1000"],
    colors: ["Black", "White"],
    sizes: [],
    featured: true,
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description: "Hand-finished ceramic dripper and carafe for a slower, better morning.",
    category: "Home & Living",
    price: 2200,
    images: ["https://picsum.photos/seed/kemer-p2/800/1000"],
    colors: ["Sand"],
    sizes: [],
    featured: true,
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "Everyday Canvas Tote",
    slug: "everyday-canvas-tote",
    description: "Heavyweight canvas tote with leather straps, built to carry a full day.",
    category: "Fashion",
    price: 980,
    images: ["https://picsum.photos/seed/kemer-p3/800/1000"],
    colors: ["Olive", "Black", "Natural"],
    sizes: ["One Size"],
    featured: true,
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "4",
    name: "Shea & Aloe Body Balm",
    slug: "shea-aloe-body-balm",
    description: "Whipped shea butter with cold-pressed aloe, unscented and fast-absorbing.",
    category: "Beauty",
    price: 620,
    images: ["https://picsum.photos/seed/kemer-p4/800/1000"],
    colors: [],
    sizes: ["150ml"],
    featured: true,
    inStock: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];
