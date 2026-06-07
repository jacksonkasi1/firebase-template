// Auth hook — wraps Firebase Auth SDK
// ─────────────────────────────────────
// Listens to auth state changes and syncs with Zustand store

// ─── External ────────────────────────────────
import { useCallback } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth"

// ─── Internal ────────────────────────────────
import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/store/auth.store"
import type { RegisterInput, LoginInput } from "@/utils/validators"

// ─────────────────────────────────────────────
export function useAuth() {
  const { user, loading, setUser, setLoading, setIdToken, clearAuth } =
    useAuthStore()

  // Map FirebaseUser → our User shape
  const mapUser = (firebaseUser: FirebaseUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  })

  // Initialize auth listener (called once in App.tsx)
  const initAuthListener = useCallback(() => {
    setLoading(true)
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setUser(mapUser(firebaseUser))
        setIdToken(token)
      } else {
        clearAuth()
      }
      setLoading(false)
    })
  }, [setLoading, setUser, setIdToken, clearAuth])

  const register = async ({ displayName, email, password }: RegisterInput) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    await updateProfile(credential.user, { displayName })
    const token = await credential.user.getIdToken()
    setUser(mapUser(credential.user))
    setIdToken(token)
    return credential.user
  }

  const login = async ({ email, password }: LoginInput) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const token = await credential.user.getIdToken()
    setUser(mapUser(credential.user))
    setIdToken(token)
    return credential.user
  }

  const logout = async () => {
    await signOut(auth)
    clearAuth()
  }

  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    const token = await credential.user.getIdToken()
    setUser(mapUser(credential.user))
    setIdToken(token)
    return credential.user
  }

  return {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    initAuthListener,
  }
}
