import { apiRequest, setStoredToken } from "./apiClient";

export interface AdminSummary {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  token: string;
  admin: AdminSummary;
}

export async function login(identifier: string, password: string): Promise<AdminSummary> {
  const data = await apiRequest<LoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  setStoredToken(data.token);
  return data.admin;
}

export function logout(): void {
  setStoredToken(null);
}

export function getMe(): Promise<{ admin: AdminSummary }> {
  return apiRequest("/admin/me", { auth: true });
}
