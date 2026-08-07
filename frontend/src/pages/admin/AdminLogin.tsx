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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-light/50 via-background to-background px-4">
      <div className="surface-card w-full max-w-sm p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-medium text-neutral-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Kemer Market dashboard access.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label">
              Username or email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="field-input"
            />
          </div>

          {error && <p className="field-error">{error}</p>}

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
