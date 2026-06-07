// AuthLayout — Wraps all authentication pages
// IBM Carbon: white canvas, single-column centered, hairline dividers

// ─── External ────────────────────────────────
import { Navigate, Outlet } from "react-router-dom";

// ─── Internal ────────────────────────────────
import { useAuthStore } from "@/store/auth.store";

// ─────────────────────────────────────────────
export function AuthLayout() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground tracking-[0.16px]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* IBM Carbon top rail */}
      <header className="h-12 border-b border-border bg-background flex items-center px-8">
        <span className="text-sm font-semibold tracking-[0.16px] text-foreground">
          firebase<span className="text-primary">-template</span>
        </span>
      </header>

      {/* Auth content */}
      <main className="flex min-h-[calc(100vh-48px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
