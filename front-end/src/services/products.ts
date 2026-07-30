import { apiRequest } from "./apiClient";
import type { Product, ProductFilters, ProductListResponse } from "@/types";

interface GetProductsFilters extends ProductFilters {
  featured?: boolean;
  limit?: number;
  /** Excludes a slug from the results — used for "related products" queries. */
  exclude?: string;
}

export function getProducts(filters: GetProductsFilters = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.featured) params.set("featured", "true");
  if (filters.exclude) params.set("exclude", filters.exclude);

  const query = params.toString();
  return apiRequest<ProductListResponse>(`/products${query ? `?${query}` : ""}`);
}

export function getProductBySlug(slug: string): Promise<Product> {
  return apiRequest<Product>(`/products/${slug}`);
}

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  featured: boolean;
  inStock: boolean;
}

export function createProduct(input: ProductInput): Promise<Product> {
  return apiRequest<Product>("/products", { method: "POST", body: JSON.stringify(input), auth: true });
}

export function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(input), auth: true });
}

export function deleteProduct(id: string): Promise<{ deleted: boolean }> {
  return apiRequest(`/products/${id}`, { method: "DELETE", auth: true });
}

export function toggleFeatured(id: string): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/toggle-featured`, { method: "PATCH", auth: true });
}

export function toggleStock(id: string): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/toggle-stock`, { method: "PATCH", auth: true });
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("image", file);
  return apiRequest<UploadResult>("/uploads", { method: "POST", body: formData, auth: true });
}

export function deleteImage(publicId: string): Promise<{ deleted: boolean }> {
  return apiRequest("/uploads", {
    method: "DELETE",
    body: JSON.stringify({ publicId }),
    auth: true,
  });
}
