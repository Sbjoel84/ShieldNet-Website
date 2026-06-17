import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { Profile, UserRole } from '@/lib/types'

const ADMIN_EMAIL = 'shieldnetcore@gmail.com'

function buildProfile(user: User): Profile {
  return {
    id:           user.uid,
    email:        user.email ?? '',
    full_name:    user.displayName ?? 'ShieldNet Admin',
    role:         (user.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'public') as UserRole,
    shield_score: 100,
    verified:     true,
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
  signIn:  (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setProfile(user ? buildProfile(user) : null)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      setProfile(buildProfile(cred.user))
      return { error: null }
    } catch (err: any) {
      return { error: getFirebaseError(err) }
    }
  }

  async function signOut() {
    await fbSignOut(auth)
    localStorage.removeItem('shieldnet_token')
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      profile,
      role:    profile?.role ?? 'public',
      loading,
      signIn,
      signOut,
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
