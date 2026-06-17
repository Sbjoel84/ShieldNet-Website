import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Profile, UserRole } from '@/lib/types'

const API       = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'shieldnet_token'

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
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => setProfile(data?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  async function signIn(email: string, password: string) {
    const attempt = async () => {
      const res = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error ?? 'Sign in failed.' }
      localStorage.setItem(TOKEN_KEY, data.token)
      setProfile(data.profile)
      return { error: null }
    }

    try {
      return await attempt()
    } catch {
      // Retry once after 6s — handles Render free-tier cold starts
      try {
        await new Promise(r => setTimeout(r, 6000))
        return await attempt()
      } catch {
        return { error: 'Could not connect to server. Please try again.' }
      }
    }
  }

  async function signOut() {
    localStorage.removeItem(TOKEN_KEY)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      profile,
      role: profile?.role ?? 'public',
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
