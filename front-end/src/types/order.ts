export const ORDER_STATUSES = [
  "Pending Verification",
  "Accepted",
  "Preparing",
  "Delivered",
  "Payment Rejected",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
}

export interface Order {
  _id: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  paymentMethod: string;
  paymentScreenshot: {
    url: string;
    publicId: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  page: number;
  totalPages: number;
  totalResults: number;
}
