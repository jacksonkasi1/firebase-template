// AppLayout — Authenticated app shell
// IBM Carbon: 48px top nav, white canvas, hairline borders

// ─── External ────────────────────────────────
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";

// ─── Internal (shadcn/ui) ─────────────────────
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Internal ────────────────────────────────
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────
export function AppLayout() {
  const { user, loading } = useAuthStore();
  const { logout }        = useAuth();
  const location          = useLocation();
  const navigate          = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground tracking-[0.16px]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? "U").toUpperCase();

  const navLinks = [
    { to: "/dashboard", label: "Tasks"   },
    { to: "/profile",   label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* IBM Carbon top nav — 48px height, 1px bottom hairline */}
      <header className="sticky top-0 z-50 h-12 border-b border-border bg-background">
        <div className="flex h-full max-w-[1312px] mx-auto items-center justify-between px-8">
          {/* Logo */}
          <Link to="/dashboard" className="text-sm font-semibold tracking-[0.16px] text-foreground ibm-transition hover:text-primary">
            firebase<span className="text-primary">-template</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-5 py-3 text-sm tracking-[0.16px] ibm-transition border-b-2 ${
                  location.pathname === to
                    ? "border-primary text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-8 w-8 items-center justify-center rounded-none hover:bg-muted ibm-transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Avatar className="h-8 w-8 rounded-none">
                <AvatarFallback className="rounded-none bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="rounded-none w-48 border-border">
              <DropdownMenuLabel className="text-xs text-muted-foreground tracking-[0.16px]">
                {user.displayName ?? user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-none cursor-pointer text-sm tracking-[0.16px]" onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-none text-destructive focus:text-destructive text-sm tracking-[0.16px] cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-[1312px] mx-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
