import { createContext, useContext, useState, ReactNode } from 'react'
import type { Profile, UserRole } from '@/lib/types'

// Backend integration pending — will connect to ShieldNet AI API

interface AuthState {
  profile: Profile | null
  role: UserRole
  loading: boolean
}

interface AuthActions {
  signIn:  (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)

  async function signIn(_email: string, _password: string) {
    // TODO: replace with ShieldNet AI auth API call
    return { error: 'Backend not connected yet.' }
  }

  async function signOut() {
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      profile,
      role: profile?.role ?? 'public',
      loading: false,
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
