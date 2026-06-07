// AppLayout — Authenticated app shell
// IBM Carbon: 48px top nav, white canvas, hairline borders

// ─── External ────────────────────────────────
import {
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { Loader2 } from "lucide-react"

// ─── Internal (shadcn/ui) ─────────────────────
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ─── Internal ────────────────────────────────
import { useAuthStore } from "@/store/auth.store"
import { useAuth } from "@/hooks/useAuth"

// ─────────────────────────────────────────────
export function AppLayout() {
  const { user, loading } = useAuthStore()
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm tracking-[0.16px] text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] ?? "U").toUpperCase()

  const navLinks = [
    { to: "/dashboard", label: "Tasks" },
    { to: "/profile", label: "Profile" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-background">
      {/* IBM Carbon top nav — 48px height, 1px bottom hairline */}
      <header className="sticky top-0 z-50 h-12 w-full border-b border-border bg-background">
        <div className="mx-auto flex h-full w-full max-w-[1312px] items-center justify-between px-6 md:px-8">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="ibm-transition shrink-0 text-sm font-semibold tracking-[0.16px] text-foreground hover:text-primary"
          >
            firebase<span className="text-primary">-template</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-0 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`ibm-transition border-b-2 px-5 py-3 text-sm tracking-[0.16px] ${
                  location.pathname === to
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex shrink-0 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="ibm-transition flex h-8 w-8 items-center justify-center hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none">
                <Avatar className="h-8 w-8 rounded-none">
                  <AvatarFallback className="rounded-none bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-[100] w-52 rounded-none border-border"
              >
                <DropdownMenuLabel className="text-xs tracking-[0.16px] text-muted-foreground">
                  <div className="truncate">
                    {user.displayName ?? user.email}
                  </div>
                  {user.displayName && (
                    <div className="mt-0.5 truncate text-[10px] opacity-70">
                      {user.email}
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-none text-sm tracking-[0.16px]"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-none text-sm tracking-[0.16px]"
                  onClick={() => navigate("/dashboard")}
                >
                  Tasks
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer rounded-none text-sm tracking-[0.16px] text-destructive focus:text-destructive"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Page content — w-full ensures children never collapse */}
      <main className="mx-auto w-full max-w-[1312px] flex-1 px-6 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
