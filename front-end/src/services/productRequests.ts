import { apiRequest } from "./apiClient";
import type { ProductRequest, ProductRequestListResponse, RequestStatus } from "@/types";

export interface CreateProductRequestInput {
  productName: string;
  color: string;
  size: string;
  quantity: number;
  email: string;
  deliveryAddress: string;
  notes?: string;
  image?: File;
}

/** POST /api/product-requests — public, no payment involved. */
export function createProductRequest(input: CreateProductRequestInput): Promise<ProductRequest> {
  const formData = new FormData();
  formData.append("productName", input.productName);
  formData.append("color", input.color);
  formData.append("size", input.size);
  formData.append("quantity", String(input.quantity));
  formData.append("email", input.email);
  formData.append("deliveryAddress", input.deliveryAddress);
  if (input.notes) formData.append("notes", input.notes);
  if (input.image) formData.append("image", input.image);

  return apiRequest<ProductRequest>("/product-requests", { method: "POST", body: formData });
}

interface AdminRequestFilters {
  status?: RequestStatus;
  archived?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export function getProductRequests(filters: AdminRequestFilters = {}): Promise<ProductRequestListResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.archived) params.set("archived", "true");
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return apiRequest<ProductRequestListResponse>(`/product-requests${query ? `?${query}` : ""}`, { auth: true });
}

export function getProductRequestById(id: string): Promise<ProductRequest> {
  return apiRequest<ProductRequest>(`/product-requests/${id}`, { auth: true });
}

export function updateProductRequestStatus(id: string, status: RequestStatus): Promise<ProductRequest> {
  return apiRequest<ProductRequest>(`/product-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    auth: true,
  });
}
