// Shared TypeScript types for server
// ─────────────────────────────────────

export interface AuthUser {
  uid:         string;
  email:       string | undefined;
  displayName: string | undefined;
}

export interface Todo {
  id:        string;
  title:     string;
  completed: boolean;
  userId:    string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data:    T;
}

export interface ApiError {
  success: false;
  message: string;
  error?:  string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// Hono context variable type (attached by auth middleware)
export type Variables = {
  user: AuthUser;
};
