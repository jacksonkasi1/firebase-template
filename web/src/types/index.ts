// Auth & Todo type definitions
// ─────────────────────────────

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface AuthState {
  user: User | null
  loading: boolean
  idToken: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setIdToken: (token: string | null) => void
  clearAuth: () => void
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
}

export interface UpdateTodoInput {
  title?: string
  completed?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  message: string
  success: boolean
}
