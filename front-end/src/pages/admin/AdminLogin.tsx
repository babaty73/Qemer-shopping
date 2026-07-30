import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LocationState {
  from?: { pathname: string };
}

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? "/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-100 bg-white p-8 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-medium text-neutral-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Kemer Market dashboard access.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900">
              Username or email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
