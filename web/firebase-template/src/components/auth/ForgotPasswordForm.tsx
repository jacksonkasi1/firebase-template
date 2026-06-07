// ForgotPasswordForm — IBM Carbon style on shadcn/ui
// ────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/utils/validators";

// ─────────────────────────────────────────────
export function ForgotPasswordForm() {
  const { forgotPassword }    = useAuth();
  const [sent,  setSent]      = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver:      zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setError(null);
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      setError("Could not send reset email. Please check the address and try again.");
    }
  };

  if (sent) {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground tracking-[0.32px] uppercase">
            Authentication
          </p>
          <h1 className="text-[42px] font-light leading-[1.20] text-foreground">
            Check your email
          </h1>
        </div>
        <Alert className="rounded-none border-l-2 border-l-primary border-border bg-muted/50">
          <AlertDescription className="text-sm tracking-[0.16px]">
            A password reset link has been sent to{" "}
            <strong>{form.getValues("email")}</strong>. Check your inbox and spam folder.
          </AlertDescription>
        </Alert>
        <Link
          to="/login"
          className="block text-sm text-primary tracking-[0.16px] ibm-transition hover:text-blue-700 hover:underline"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground tracking-[0.32px] uppercase">
          Authentication
        </p>
        <h1 className="text-[42px] font-light leading-[1.20] text-foreground">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground tracking-[0.16px]">
          Enter your email and we&apos;ll send you a reset link.
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

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 rounded-none bg-primary text-primary-foreground text-sm tracking-[0.16px] font-normal hover:bg-[#0050e6] active:bg-[#002d9c] ibm-transition"
          >
            {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Form>

      <Link
        to="/login"
        className="block text-sm text-primary tracking-[0.16px] border-t border-border pt-6 ibm-transition hover:text-blue-700 hover:underline"
      >
        ← Back to sign in
      </Link>
    </div>
  );
}
