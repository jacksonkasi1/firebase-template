// TodoList — IBM Carbon tile list with add-form on top
// ──────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ─── shadcn/ui ───────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

// ─── Internal ────────────────────────────────
import { TodoItem } from "@/components/todos/TodoItem";
import { useTodos } from "@/hooks/useTodos";
import { todoSchema, type TodoInput } from "@/utils/validators";

// ─────────────────────────────────────────────
export function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, editTodo, removeTodo } =
    useTodos();
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const form = useForm<TodoInput>({
    resolver:      zodResolver(todoSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (data: TodoInput) => {
    await addTodo(data);
    form.reset();
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done")   return t.completed;
    return true;
  });

  const doneCount   = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="space-y-0">
      {/* Add task form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-0 border border-border">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Add a new task and press Enter…"
                    className="h-12 flex-1 rounded-none border-0 bg-background px-4 text-sm tracking-[0.16px] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  />
                </FormControl>
                <FormMessage className="px-4 pb-2 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 rounded-none border-l border-border bg-primary px-6 text-sm text-primary-foreground tracking-[0.16px] hover:bg-[#0050e6] ibm-transition"
          >
            {form.formState.isSubmitting ? "Adding…" : "Add task"}
          </Button>
        </form>
      </Form>

      {/* Filter tabs */}
      <div className="flex items-center border-b border-border">
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-3 text-sm tracking-[0.16px] capitalize ibm-transition border-b-2 -mb-px ${
              filter === f
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            {f === "active" && activeCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-none px-1.5 py-0 text-xs">
                {activeCount}
              </Badge>
            )}
            {f === "done" && doneCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-none px-1.5 py-0 text-xs">
                {doneCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="border-x border-border">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground tracking-[0.16px]">Loading tasks…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="border-b border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive tracking-[0.16px]">{error}</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[32px] font-light text-muted-foreground/40">—</p>
            <p className="mt-2 text-sm text-muted-foreground tracking-[0.16px]">
              {filter === "all"
                ? "No tasks yet. Add one above."
                : `No ${filter} tasks.`}
            </p>
          </div>
        )}

        {!loading &&
          filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={removeTodo}
            />
          ))}
      </div>

      {/* Footer summary */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between border border-t-0 border-border bg-muted/30 px-4 py-2">
          <p className="text-xs text-muted-foreground tracking-[0.16px]">
            {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
          </p>
          <p className="text-xs text-muted-foreground tracking-[0.16px]">
            {doneCount} completed
          </p>
        </div>
      )}
    </div>
  );
}
