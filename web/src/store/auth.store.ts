// Zustand auth store
// ───────────────────
// Holds authenticated user + Firebase ID token
// Used by axios interceptors and route guards

import { create } from "zustand"
import { persist } from "zustand/middleware"

// ─── Types ───────────────────────────────────
import type { AuthState } from "@/types"

// ─── Store ───────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      idToken: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setIdToken: (idToken) => set({ idToken }),

      clearAuth: () => set({ user: null, idToken: null, loading: false }),
    }),
    {
      name: "firebase-auth",
      // Only persist user info, not the loading state
      partialize: (state) => ({
        user: state.user,
        idToken: state.idToken,
      }),
    }
  )
)
