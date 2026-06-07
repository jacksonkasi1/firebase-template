// AuthLayout — Wraps all authentication pages
// IBM Carbon: white canvas, single-column centered, hairline dividers

// ─── External ────────────────────────────────
import { Navigate, Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"

// ─── Internal ────────────────────────────────
import { useAuthStore } from "@/store/auth.store"

// ─────────────────────────────────────────────
export function AuthLayout() {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div
        style={{ width: "100vw", minHeight: "100vh" }}
        className="flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm tracking-[0.16px] text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div
      style={{ width: "100vw", minHeight: "100vh" }}
      className="flex flex-col bg-background"
    >
      {/* IBM Carbon top rail */}
      <header
        style={{ width: "100%" }}
        className="flex h-12 items-center border-b border-border bg-background px-6 md:px-8"
      >
        <span className="text-sm font-semibold tracking-[0.16px] text-foreground">
          firebase<span className="text-primary">-template</span>
        </span>
      </header>

      {/* Auth content — inline style guarantees full-width regardless of Tailwind layer order */}
      <main
        style={{ width: "100%", flex: 1 }}
        className="flex items-center justify-center px-6 py-12"
      >
        <div style={{ width: "100%", maxWidth: "448px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
