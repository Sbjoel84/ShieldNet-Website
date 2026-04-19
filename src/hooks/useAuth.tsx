import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@/lib/supabase'
import type { Profile, UserRole } from '@/lib/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: UserRole
  loading: boolean
}

interface AuthActions {
  signInWithEmail: (email: string) => Promise<{ error: string | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data as Profile | null)
    setLoading(false)
  }

  async function signInWithEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    return { error: error?.message ?? null }
  }

  async function verifyOtp(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return { error: error?.message ?? null }
  }

  async function signInWithPhone(phone: string) {
    const { error } = await supabase.auth.signInWithOtp({ phone })
    return { error: error?.message ?? null }
  }

  async function verifyPhoneOtp(phone: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile,
      role: profile?.role ?? 'public',
      loading,
      signInWithEmail, verifyOtp, signInWithPhone, verifyPhoneOtp, signOut,
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
