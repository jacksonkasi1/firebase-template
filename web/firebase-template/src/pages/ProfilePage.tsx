// ProfilePage — User profile on shadcn/ui Card + IBM Carbon
// ────────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react";
import { updateProfile } from "firebase/auth";

// ─── shadcn/ui ───────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ─── Internal ────────────────────────────────
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";

// ─────────────────────────────────────────────
export function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [editing,     setEditing]     = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving,      setSaving]      = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? "U").toUpperCase();

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...user!, displayName });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <p className="text-xs text-muted-foreground tracking-[0.32px] uppercase mb-1">
          Account
        </p>
        <h1 className="text-[32px] font-light leading-[1.25] text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground tracking-[0.16px]">
          Manage your personal information.
        </p>
      </div>

      {success && (
        <Alert className="rounded-none border-l-2 border-l-[#24a148] border-border bg-[#24a148]/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-[#24a148]">
            Profile updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm text-destructive tracking-[0.16px]">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Avatar + info card */}
      <div className="border border-border">
        <div className="flex items-center gap-6 p-6 border-b border-border">
          <Avatar className="h-16 w-16 rounded-none">
            <AvatarFallback className="rounded-none bg-primary text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-normal text-foreground tracking-[0]">
              {user?.displayName ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground tracking-[0.16px]">
              {user?.email}
            </p>
            <Badge
              variant="secondary"
              className="mt-2 rounded-none text-xs tracking-[0.16px] border-border"
            >
              Firebase Auth
            </Badge>
          </div>
        </div>

        {/* Editable fields */}
        <div className="p-6 space-y-6">
          {/* Display Name */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
              Display name
            </Label>
            {editing ? (
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
                className="h-12 rounded-none border-0 border-b border-border bg-muted px-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <p className="h-12 flex items-center px-0 text-sm text-foreground tracking-[0.16px] border-b border-border">
                {user?.displayName ?? "—"}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground tracking-[0.32px] uppercase font-normal">
              Email address
            </Label>
            <p className="h-12 flex items-center px-0 text-sm text-muted-foreground tracking-[0.16px] border-b border-border">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground tracking-[0.16px]">
              Email cannot be changed here. Use Firebase Console.
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Actions */}
          {editing ? (
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-10 rounded-none bg-primary px-6 text-sm text-primary-foreground tracking-[0.16px] hover:bg-[#0050e6] ibm-transition"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setEditing(false); setDisplayName(user?.displayName ?? ""); }}
                className="h-10 rounded-none px-6 text-sm tracking-[0.16px]"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="h-10 rounded-none border-border px-6 text-sm tracking-[0.16px] hover:bg-muted ibm-transition"
            >
              Edit profile
            </Button>
          )}
        </div>
      </div>

      {/* Account info */}
      <div className="border border-border">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground tracking-[0.32px] uppercase">
            Account information
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground tracking-[0.16px]">User ID</p>
            <p className="text-xs font-mono text-foreground bg-muted px-2 py-1 max-w-[200px] truncate">
              {user?.uid}
            </p>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground tracking-[0.16px]">Auth provider</p>
            <Badge variant="secondary" className="rounded-none text-xs border-border">
              Email / Password
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
