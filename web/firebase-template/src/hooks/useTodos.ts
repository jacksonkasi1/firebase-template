// useTodos hook — Firestore CRUD via server API
// ──────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState, useEffect, useCallback } from "react";

// ─── Internal ────────────────────────────────
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/api/todos.api";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@/types";

// ─────────────────────────────────────────────
export function useTodos() {
  const [todos,   setTodos]   = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data: CreateTodoInput) => {
    const res = await createTodo(data);
    setTodos((prev) => [res.data.data, ...prev]);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const update: UpdateTodoInput = { completed: !completed };
    const res = await updateTodo(id, update);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? res.data.data : t))
    );
  };

  const editTodo = async (id: string, title: string) => {
    const res = await updateTodo(id, { title });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? res.data.data : t))
    );
  };

  const removeTodo = async (id: string) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    refetch: fetchTodos,
  };
}
