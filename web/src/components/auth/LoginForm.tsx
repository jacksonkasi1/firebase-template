// LoginForm — IBM Carbon style on shadcn/ui
// ──────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"

// ─── shadcn/ui components ─────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── Internal ────────────────────────────────
import { useAuth } from "@/hooks/useAuth"
import { loginSchema, type LoginInput } from "@/utils/validators"

// ─── Google SVG icon (inline, no dependency) ─
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

// ─────────────────────────────────────────────
export function LoginForm() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null)
      await login(data)
      navigate("/dashboard")
    } catch {
      setError("Invalid email or password. Please try again.")
    }
  }

  const handleGoogle = async () => {
    try {
      setError(null)
      setGoogleLoading(true)
      await loginWithGoogle()
      navigate("/dashboard")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (
        !msg.includes("popup-closed-by-user") &&
        !msg.includes("cancelled-popup-request")
      ) {
        setError("Google sign-in failed. Please try again.")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs tracking-[0.32px] text-muted-foreground uppercase">
          Authentication
        </p>
        <h1 className="text-[42px] leading-[1.20] font-light text-foreground">
          Sign in
        </h1>
        <p className="text-sm tracking-[0.16px] text-muted-foreground">
          Use your email and password, or continue with Google.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Google sign-in */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={googleLoading || form.formState.isSubmitting}
        className="ibm-transition flex h-12 w-full items-center justify-center gap-3 rounded-none border border-border bg-background text-sm font-normal tracking-[0.16px] text-foreground hover:bg-muted"
      >
        <GoogleIcon />
        {googleLoading ? "Signing in…" : "Continue with Google"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-[0.32px] text-muted-foreground uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email / Password form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-6 space-y-1">
                <FormLabel className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="ibm-input h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-2 space-y-1">
                <FormLabel className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="ibm-input h-12 w-full rounded-none border-0 border-b border-border bg-muted pr-12 pl-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {/* Forgot password link */}
          <div className="mb-8 flex justify-end">
            <Link
              to="/forgot-password"
              className="ibm-transition text-xs tracking-[0.16px] text-primary hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || googleLoading}
            className="ibm-transition h-12 w-full rounded-none bg-primary text-sm font-normal tracking-[0.16px] text-primary-foreground hover:bg-[#0050e6] active:bg-[#002d9c]"
          >
            {form.formState.isSubmitting ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="border-t border-border pt-6 text-sm tracking-[0.16px] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="ibm-transition text-primary hover:text-blue-700 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
