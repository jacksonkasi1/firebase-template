// App.tsx — Root router with Firebase auth listener
// ────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// ─── Layout ───────────────────────────────────
import { AuthLayout } from "@/components/layout/AuthLayout"
import { AppLayout } from "@/components/layout/AppLayout"

// ─── Pages ───────────────────────────────────
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProfilePage } from "@/pages/ProfilePage"

// ─── Hooks ───────────────────────────────────
import { useAuth } from "@/hooks/useAuth"

// ─────────────────────────────────────────────
function AppRoutes() {
  const { initAuthListener } = useAuth()

  // Bootstrap Firebase auth listener once
  useEffect(() => {
    const unsubscribe = initAuthListener()
    return () => unsubscribe()
  }, [initAuthListener])

  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
