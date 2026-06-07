// ProfilePage — User profile on shadcn/ui Card + IBM Carbon
// ────────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { useState } from "react"
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth"
import { Eye, EyeOff } from "lucide-react"

// ─── shadcn/ui ───────────────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── Internal ────────────────────────────────
import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/store/auth.store"

// ─────────────────────────────────────────────
export function ProfilePage() {
  const { user, setUser } = useAuthStore()

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName ?? "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Security (password management) states
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [secUpdating, setSecUpdating] = useState(false)
  const [secSuccess, setSecSuccess] = useState<string | null>(null)
  const [secError, setSecError] = useState<string | null>(null)

  const hasPassword = auth.currentUser?.providerData.some(
    (p) => p.providerId === "password"
  )

  const handleUpdatePassword = async () => {
    if (!auth.currentUser) return
    if (newPassword.length < 6) {
      setSecError("Password must be at least 6 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      setSecError("Passwords do not match.")
      return
    }

    setSecUpdating(true)
    setSecError(null)
    setSecSuccess(null)

    try {
      if (hasPassword) {
        await updatePassword(auth.currentUser, newPassword)
        setSecSuccess("Password updated successfully.")
      } else {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email!,
          newPassword
        )
        await linkWithCredential(auth.currentUser, credential)
        setSecSuccess(
          "Password set successfully. You can now sign in with either your Google account or your email and password."
        )
      }
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("requires-recent-login")) {
        setSecError(
          "This operation is sensitive and requires recent authentication. Please sign out and sign in again before attempting this."
        )
      } else {
        setSecError("Failed to update password. Please try again.")
      }
    } finally {
      setSecUpdating(false)
    }
  }

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] ?? "U").toUpperCase()

  const handleSave = async () => {
    if (!auth.currentUser) return
    setSaving(true)
    setError(null)
    try {
      await updateProfile(auth.currentUser, { displayName })
      setUser({ ...user!, displayName })
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <p className="mb-1 text-xs tracking-[0.32px] text-muted-foreground uppercase">
          Account
        </p>
        <h1 className="text-[32px] leading-[1.25] font-light text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm tracking-[0.16px] text-muted-foreground">
          Manage your personal information.
        </p>
      </div>

      {success && (
        <Alert className="rounded-none border-l-2 border-border border-l-[#24a148] bg-[#24a148]/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-[#24a148]">
            Profile updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="rounded-none border-destructive bg-destructive/5">
          <AlertDescription className="text-sm tracking-[0.16px] text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Avatar + info card */}
      <div className="w-full border border-border">
        <div className="flex items-center gap-6 border-b border-border p-6">
          <Avatar className="h-16 w-16 rounded-none">
            <AvatarFallback className="rounded-none bg-primary text-xl font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-normal tracking-[0] text-foreground">
              {user?.displayName ?? "—"}
            </p>
            <p className="text-sm tracking-[0.16px] text-muted-foreground">
              {user?.email}
            </p>
            <Badge
              variant="secondary"
              className="mt-2 rounded-none border-border text-xs tracking-[0.16px]"
            >
              Firebase Auth
            </Badge>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-6 p-6">
          {/* Display Name */}
          <div className="space-y-1">
            <Label className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
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
              <p className="flex h-12 items-center border-b border-border px-0 text-sm tracking-[0.16px] text-foreground">
                {user?.displayName ?? "—"}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1">
            <Label className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
              Email address
            </Label>
            <p className="flex h-12 items-center border-b border-border px-0 text-sm tracking-[0.16px] text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs tracking-[0.16px] text-muted-foreground">
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
                className="ibm-transition h-10 rounded-none bg-primary px-6 text-sm tracking-[0.16px] text-primary-foreground hover:bg-[#0050e6]"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(false)
                  setDisplayName(user?.displayName ?? "")
                }}
                className="h-10 rounded-none px-6 text-sm tracking-[0.16px]"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="ibm-transition h-10 rounded-none border-border px-6 text-sm tracking-[0.16px] hover:bg-muted"
            >
              Edit profile
            </Button>
          )}
        </div>
      </div>

      {/* Security settings */}
      <div className="w-full border border-border">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <p className="text-xs font-semibold tracking-[0.32px] text-muted-foreground uppercase">
            Security
          </p>
        </div>
        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-lg font-light text-foreground">
              {hasPassword ? "Change your password" : "Set up a password"}
            </h3>
            <p className="mt-1 text-sm tracking-[0.16px] text-muted-foreground">
              {hasPassword
                ? "Change the password used to sign in to your account."
                : "Create a password to enable signing in with email and password alongside Google."}
            </p>
          </div>

          <div className="max-w-md space-y-4">
            {/* New Password */}
            <div className="space-y-1">
              <Label className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                New password
              </Label>
              <div className="relative w-full">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 w-full rounded-none border-0 border-b border-border bg-muted pr-12 pl-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <Label className="text-xs font-normal tracking-[0.32px] text-muted-foreground uppercase">
                Confirm new password
              </Label>
              <div className="relative w-full">
                <Input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full rounded-none border-0 border-b border-border bg-muted pr-12 pl-4 text-sm tracking-[0.16px] focus:border-b-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                >
                  {showConfirmPass ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {secError && (
              <Alert className="rounded-none border-destructive bg-destructive/5 px-4 py-3">
                <AlertDescription className="text-xs tracking-[0.16px] text-destructive">
                  {secError}
                </AlertDescription>
              </Alert>
            )}

            {secSuccess && (
              <Alert className="rounded-none border-l-2 border-border border-l-[#24a148] bg-[#24a148]/5 px-4 py-3">
                <AlertDescription className="text-xs tracking-[0.16px] text-[#24a148]">
                  {secSuccess}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleUpdatePassword}
              disabled={secUpdating}
              className="ibm-transition h-10 rounded-none bg-primary px-6 text-sm tracking-[0.16px] text-primary-foreground hover:bg-[#0050e6]"
            >
              {secUpdating
                ? "Updating..."
                : hasPassword
                  ? "Update password"
                  : "Set password"}
            </Button>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="w-full border border-border">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <p className="text-xs font-semibold tracking-[0.32px] text-muted-foreground uppercase">
            Account information
          </p>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-[0.16px] text-muted-foreground">
              User ID
            </p>
            <p className="max-w-[200px] truncate bg-muted px-2 py-1 font-mono text-xs text-foreground">
              {user?.uid}
            </p>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-[0.16px] text-muted-foreground">
              Auth provider
            </p>
            <Badge
              variant="secondary"
              className="rounded-none border-border text-xs"
            >
              {auth.currentUser?.providerData?.[0]?.providerId === "google.com"
                ? "Google"
                : "Email / Password"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
