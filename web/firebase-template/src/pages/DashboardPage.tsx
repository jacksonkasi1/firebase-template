// DashboardPage — Task manager, IBM Carbon layout
// ──────────────────────────────────────────────────

// ─── Internal ────────────────────────────────
import { TodoList } from "@/components/todos/TodoList";
import { useAuthStore } from "@/store/auth.store";

// ─────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuthStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <p className="text-xs text-muted-foreground tracking-[0.32px] uppercase mb-1">
          {greeting()}
        </p>
        <h1 className="text-[32px] font-light leading-[1.25] text-foreground">
          {user?.displayName ?? "Tasks"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground tracking-[0.16px]">
          Your personal task list. Stay organized, ship faster.
        </p>
      </div>

      {/* Todo list */}
      <TodoList />
    </div>
  );
}
