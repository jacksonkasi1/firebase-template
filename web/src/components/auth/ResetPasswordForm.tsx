// ResetPasswordForm — IBM Carbon style on shadcn/ui
// ──────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

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
import { auth } from "@/lib/firebase"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/utils/validators"

// ─────────────────────────────────────────────
export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Extract oobCode from URL
  const queryParams = new URLSearchParams(window.location.search)
  const oobCode = queryParams.get("oobCode")

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  // Verify the reset code on load
  useEffect(() => {
    if (!oobCode) {
      setError(
        "No reset code found in link. Please request a new password reset email."
      )
      setVerifying(false)
      return
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((emailAddress) => {
        setEmail(emailAddress)
        setVerifying(false)
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : ""
        if (msg.includes("expired-action-code")) {
          setError(
            "This password reset link has expired. Please request a new link."
          )
        } else if (msg.includes("invalid-action-code")) {
          setError(
            "This password reset link is invalid or has already been used."
          )
        } else {
          setError(
            "Failed to verify the password reset link. Please try again."
          )
        }
        setVerifying(false)
      })
  }, [oobCode])

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!oobCode) return
    try {
      setError(null)
      await confirmPasswordReset(auth, oobCode, data.password)
      setSuccess(true)
      // Automatically redirect to login page after 4 seconds
      setTimeout(() => {
        navigate("/login")
      }, 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("weak-password")) {
        setError(
          "The new password is too weak. Please choose a stronger password."
        )
      } else if (msg.includes("expired-action-code")) {
        setError("This reset link has expired. Please request a new link.")
      } else {
        setError("Failed to reset password. Please try again.")
      }
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm tracking-[0.16px] text-muted-foreground">
          Verifying password reset link...
        </p>
      </div>
    )
  }

  if (error && !email) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <p className="text-xs tracking-[0.32px] text-muted-foreground uppercase">
            Authentication
          </p>
          <h1 className="text-[42px] leading-[1.20] font-light text-foreground">
            Link invalid
          </h1>
        </div>
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-destructive">
            {error}
          </AlertDescription>
        </Alert>
        <Link
          to="/forgot-password"
          className="ibm-transition block text-sm tracking-[0.16px] text-primary hover:text-blue-700 hover:underline"
        >
          ← Request a new reset link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <p className="text-xs tracking-[0.32px] text-muted-foreground uppercase">
            Authentication
          </p>
          <h1 className="text-[42px] leading-[1.20] font-light text-foreground">
            Password reset
          </h1>
        </div>
        <Alert className="rounded-none border-l-2 border-border border-l-[#24a148] bg-[#24a148]/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-foreground">
            Your password has been reset successfully. Redirecting you to sign
            in in a few seconds...
          </AlertDescription>
        </Alert>
        <Link
          to="/login"
          className="ibm-transition block text-sm tracking-[0.16px] text-primary hover:text-blue-700 hover:underline"
        >
          Go to sign in now
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs tracking-[0.32px] text-muted-foreground uppercase">
          Authentication
        </p>
        <h1 className="text-[42px] leading-[1.20] font-light text-foreground">
          New password
        </h1>
        <p className="text-sm tracking-[0.16px] text-muted-foreground">
          Create a new password for account <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="ibm-input h-12 w-full rounded-none border-0 border-b border-border bg-muted pr-12 pl-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
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

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="ibm-transition h-12 w-full rounded-none bg-primary text-sm font-normal tracking-[0.16px] text-primary-foreground hover:bg-[#0050e6] active:bg-[#002d9c]"
          >
            {form.formState.isSubmitting
              ? "Resetting password..."
              : "Reset password"}
          </Button>
        </form>
      </Form>

      <Link
        to="/login"
        className="ibm-transition block border-t border-border pt-6 text-sm tracking-[0.16px] text-primary hover:text-blue-700 hover:underline"
      >
        ← Back to sign in
      </Link>
    </div>
  )
}
