// LoginForm — IBM Carbon style on shadcn/ui
// ──────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ─── shadcn/ui components ─────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ─── Internal ────────────────────────────────
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/utils/validators";

// ─────────────────────────────────────────────
export function LoginForm() {
  const { login }     = useAuth();
  const navigate      = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver:      zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      await login(data);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground tracking-[0.32px] uppercase">
          Authentication
        </p>
        <h1 className="text-[42px] font-light leading-[1.20] text-foreground">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground tracking-[0.16px]">
          Use your email and password to continue.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm text-destructive tracking-[0.16px]">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1 mb-6">
                <FormLabel className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
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
              <FormItem className="space-y-1 mb-2">
                <FormLabel className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="ibm-input h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {/* Forgot password link */}
          <div className="flex justify-end mb-8">
            <Link
              to="/forgot-password"
              className="text-xs text-primary tracking-[0.16px] ibm-transition hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 rounded-none bg-primary text-primary-foreground text-sm tracking-[0.16px] font-normal hover:bg-[#0050e6] active:bg-[#002d9c] ibm-transition"
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-sm text-muted-foreground tracking-[0.16px] border-t border-border pt-6">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary ibm-transition hover:text-blue-700 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
