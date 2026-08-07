export const REQUEST_STATUSES = ["Pending Review", "Approved", "Declined"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface ProductRequest {
  _id: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  email: string;
  deliveryAddress: string;
  image?: {
    url: string;
    publicId: string;
  };
  notes?: string;
  status: RequestStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequestListResponse {
  requests: ProductRequest[];
  page: number;
  totalPages: number;
  totalResults: number;
}
