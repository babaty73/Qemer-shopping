/**
 * Mirrors the backend Product model 1:1.
 * Keep this in sync with backend/src/models/Product.js.
 */
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  featured: boolean;
  inStock: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

/** Shape returned by paginated product list endpoints. */
export interface ProductListResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
}
