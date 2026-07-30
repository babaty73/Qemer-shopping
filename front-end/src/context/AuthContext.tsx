import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredToken } from "@/services/apiClient";
import * as authService from "@/services/auth";
import type { AdminSummary } from "@/services/auth";

interface AuthContextValue {
  admin: AdminSummary | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Restores the admin session from a stored JWT on load, exposes login/logout. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => authService.logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(identifier: string, password: string) {
    const loggedInAdmin = await authService.login(identifier, password);
    setAdmin(loggedInAdmin);
  }

  function logout() {
    authService.logout();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
