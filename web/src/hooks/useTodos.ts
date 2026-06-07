// useTodos hook — Firestore CRUD via server API
// ──────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState, useEffect, useCallback } from "react"

// ─── Internal ────────────────────────────────
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/api/todos.api"
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@/types"

// ─────────────────────────────────────────────
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object") {
      const anyErr = err as any
      const backendError =
        anyErr.response?.data?.error ?? anyErr.response?.data?.message
      if (backendError) return backendError
      return anyErr.message ?? "An unexpected error occurred"
    }
    return err instanceof Error ? err.message : "An unexpected error occurred"
  }

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getTodos()
      setTodos(res.data.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (data: CreateTodoInput) => {
    try {
      setError(null)
      const res = await createTodo(data)
      setTodos((prev) => [res.data.data, ...prev])
    } catch (err) {
      setError(`Failed to add task: ${getErrorMessage(err)}`)
      throw err
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      setError(null)
      const update: UpdateTodoInput = { completed: !completed }
      const res = await updateTodo(id, update)
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data.data : t)))
    } catch (err) {
      setError(`Failed to update task: ${getErrorMessage(err)}`)
      throw err
    }
  }

  const editTodo = async (id: string, title: string) => {
    try {
      setError(null)
      const res = await updateTodo(id, { title })
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data.data : t)))
    } catch (err) {
      setError(`Failed to edit task: ${getErrorMessage(err)}`)
      throw err
    }
  }

  const removeTodo = async (id: string) => {
    try {
      setError(null)
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(`Failed to delete task: ${getErrorMessage(err)}`)
      throw err
    }
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    refetch: fetchTodos,
  }
}
