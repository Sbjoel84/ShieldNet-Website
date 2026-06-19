import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getProfile } from '@/lib/db'
import type { Profile, UserRole } from '@/lib/types'

const ADMIN_EMAIL = 'shieldnetcore@gmail.com'

async function resolveProfile(user: User): Promise<Profile> {
  // Admin is hardcoded — no Firestore lookup needed
  if (user.email?.toLowerCase() === ADMIN_EMAIL) {
    return {
      id:           user.uid,
      email:        user.email ?? '',
      full_name:    'ShieldNetCore Admin',
      role:         'admin',
      shield_score: 100,
      verified:     true,
      created_at:   user.metadata.creationTime ?? new Date().toISOString(),
    }
  }
  // All other users — read role from Firestore profile
  const stored = await getProfile(user.uid)
  if (stored) return stored
  // Fallback for users with no Firestore doc
  return {
    id:           user.uid,
    email:        user.email ?? '',
    full_name:    user.displayName ?? 'User',
    role:         'public',
    shield_score: 0,
    verified:     false,
    created_at:   user.metadata.creationTime ?? new Date().toISOString(),
  }
}

function getFirebaseError(err: any): string {
  const code: string = err?.code ?? ''
  if (
    code.includes('user-not-found') ||
    code.includes('wrong-password') ||
    code.includes('invalid-credential') ||
    code.includes('invalid-email')
  ) return 'Invalid email or password.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.'
  if (code.includes('user-disabled'))     return 'This account has been disabled.'
  if (code.includes('network-request-failed')) return 'Network error. Check your connection.'
  return 'Sign in failed. Please try again.'
}

interface AuthState {
  profile: Profile | null
  role:    UserRole
  loading: boolean
}

interface AuthActions {
  signIn:  (email: string, password: string) => Promise<{ uid: string | null; error: string | null }>
  signOut: () => Promise<void>
  signUp:  (email: string, password: string) => Promise<{ uid: string | null; error: string | null }>
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      try {
        if (user) {
          const p = await resolveProfile(user)
          setProfile(p)
        } else {
          setProfile(null)
        }
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const p = await resolveProfile(cred.user)
      setProfile(p)
      return { uid: cred.user.uid, error: null }
    } catch (err: any) {
      return { uid: null, error: getFirebaseError(err) }
    }
  }

  async function signOut() {
    await fbSignOut(auth)
    localStorage.removeItem('shieldnet_token')
    setProfile(null)
  }

  async function signUp(email: string, password: string) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // Force token refresh so Firestore security rules see the new auth immediately
      await cred.user.getIdToken(true)
      return { uid: cred.user.uid, error: null }
    } catch (err: any) {
      const code: string = err?.code ?? ''
      if (code.includes('email-already-in-use')) return { uid: null, error: 'email-in-use' }
      return { uid: null, error: 'Registration failed. Please try again.' }
    }
  }

  return (
    <AuthContext.Provider value={{
      profile,
      role:    profile?.role ?? 'public',
      loading,
      signIn,
      signOut,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
