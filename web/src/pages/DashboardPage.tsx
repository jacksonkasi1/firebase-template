// DashboardPage — Task manager, IBM Carbon layout
// ──────────────────────────────────────────────────

// ─── Internal ────────────────────────────────
import { TodoList } from "@/components/todos/TodoList"
import { useAuthStore } from "@/store/auth.store"

// ─────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuthStore()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="w-full space-y-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <p className="mb-1 text-xs tracking-[0.32px] text-muted-foreground uppercase">
          {greeting()}
        </p>
        <h1 className="text-[32px] leading-[1.25] font-light text-foreground">
          {user?.displayName ?? "Tasks"}
        </h1>
        <p className="mt-1 text-sm tracking-[0.16px] text-muted-foreground">
          Your personal task list. Stay organized, ship faster.
        </p>
      </div>

      {/* Todo list */}
      <TodoList />
    </div>
  )
}
