const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
const TOKEN_STORAGE_KEY = "kemer-market-admin-token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  /** Attach the stored admin JWT as a Bearer token. */
  auth?: boolean;
}

/** Thin fetch wrapper: resolves the API base URL, attaches auth, and normalizes error handling. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string>) };

  const isFormData = rest.body instanceof FormData;
  if (!isFormData && rest.body && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // Response body wasn't JSON — fall back to the generic message above.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
