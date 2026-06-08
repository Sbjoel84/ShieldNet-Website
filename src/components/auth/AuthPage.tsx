import { useState } from 'react'
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { ShieldLogo } from '@/components/ui/ShieldLogo'

export function AuthPage() {
  const { signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSignIn() {
    if (!email || !password) return
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <ShieldLogo sizeClass="w-32 h-32" wrapperClassName="rounded-2xl shadow-2xl shadow-black/40 mb-5 ring-2 ring-green-500/30" />
          <h1 className="text-2xl font-bold text-foreground">ShieldNet Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Admin access — authorised personnel only
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <h2 className="text-base font-semibold">Sign in to continue</h2>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@shieldnet.ng"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button
            type="button"
            variant="shield"
            className="w-full"
            onClick={handleSignIn}
            disabled={!email || !password || loading}
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
              : <ArrowRight className="w-4 h-4 mr-2" />}
            Sign In
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in you agree to ShieldNet's{' '}
          <a href="/terms" className="text-green-400 hover:underline">Terms</a> &{' '}
          <a href="/privacy" className="text-green-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
