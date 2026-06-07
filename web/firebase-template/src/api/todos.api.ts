// Todo API — CRUD operations via HonoJS server
// ──────────────────────────────────────────────

// ─── External ────────────────────────────────
import type { AxiosResponse } from "axios";

// ─── Internal ────────────────────────────────
import apiClient from "@/api/index";
import type { Todo, ApiResponse, CreateTodoInput, UpdateTodoInput } from "@/types";

// ─── API calls ───────────────────────────────
export const getTodos = (): Promise<AxiosResponse<ApiResponse<Todo[]>>> =>
  apiClient.get("/todos");

export const createTodo = (
  data: CreateTodoInput
): Promise<AxiosResponse<ApiResponse<Todo>>> =>
  apiClient.post("/todos", data);

export const updateTodo = (
  id:   string,
  data: UpdateTodoInput
): Promise<AxiosResponse<ApiResponse<Todo>>> =>
  apiClient.patch(`/todos/${id}`, data);

export const deleteTodo = (
  id: string
): Promise<AxiosResponse<ApiResponse<void>>> =>
  apiClient.delete(`/todos/${id}`);
