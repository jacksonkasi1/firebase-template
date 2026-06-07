// RegisterForm — IBM Carbon style on shadcn/ui
// ─────────────────────────────────────────────

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
import { registerSchema, type RegisterInput } from "@/utils/validators";

// ─────────────────────────────────────────────
export function RegisterForm() {
  const { register }  = useAuth();
  const navigate      = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver:      zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      await register(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
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
          Create account
        </h1>
        <p className="text-sm text-muted-foreground tracking-[0.16px]">
          Start with a free account. No credit card required.
        </p>
      </div>

      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm text-destructive tracking-[0.16px]">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Display Name */}
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
                  Full name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="name"
                    placeholder="Jackson Nkasi"
                    className="ibm-input h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
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
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    className="ibm-input h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
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
                <FormLabel className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="ibm-input h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 rounded-none bg-primary text-primary-foreground text-sm tracking-[0.16px] font-normal hover:bg-[#0050e6] active:bg-[#002d9c] ibm-transition"
          >
            {form.formState.isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-muted-foreground tracking-[0.16px] border-t border-border pt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary ibm-transition hover:text-blue-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
