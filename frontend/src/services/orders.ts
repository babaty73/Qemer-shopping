import { apiRequest } from "./apiClient";
import type { CartItem, Order, OrderListResponse, OrderStatus } from "@/types";

export interface CheckoutInput {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  notes?: string;
  screenshot: File;
  items: CartItem[];
}

export interface OrderConfirmation {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

/** Submits the checkout form as multipart/form-data — text fields, a JSON
 *  `items` payload, and the payment screenshot file, all in one request. */
export function createOrder(input: CheckoutInput): Promise<OrderConfirmation> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  formData.append("phone", input.phone);
  formData.append("email", input.email);
  formData.append("address", input.address);
  formData.append("paymentMethod", input.paymentMethod);
  if (input.notes) formData.append("notes", input.notes);

  formData.append(
    "items",
    JSON.stringify(
      input.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }))
    )
  );

  formData.append("paymentScreenshot", input.screenshot);

  return apiRequest<OrderConfirmation>("/orders", { method: "POST", body: formData });
}

interface AdminOrderFilters {
  status?: OrderStatus;
  archived?: boolean;
  page?: number;
  limit?: number;
}

/** GET /api/orders — admin only. Defaults to non-archived orders. */
export function getOrders(filters: AdminOrderFilters = {}): Promise<OrderListResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.archived) params.set("archived", "true");
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return apiRequest<OrderListResponse>(`/orders${query ? `?${query}` : ""}`, { auth: true });
}

export function getOrderById(id: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}`, { auth: true });
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    auth: true,
  });
}

export function setOrderArchived(id: string, archived: boolean): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}/archive`, {
    method: "PATCH",
    body: JSON.stringify({ archived }),
    auth: true,
  });
}
