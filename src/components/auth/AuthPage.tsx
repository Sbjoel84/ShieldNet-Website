import { useState } from 'react'
import { Mail, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

type Step = 'method' | 'input' | 'otp' | 'success'
type Method = 'email' | 'phone'

export function AuthPage() {
  const { signInWithEmail, verifyOtp, signInWithPhone, verifyPhoneOtp } = useAuth()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method>('email')
  const [value, setValue] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp() {
    setError('')
    setLoading(true)
    const fn = method === 'email' ? signInWithEmail : signInWithPhone
    const { error } = await fn(value)
    setLoading(false)
    if (error) { setError(error); return }
    setStep('otp')
  }

  async function handleVerifyOtp() {
    setError('')
    setLoading(true)
    const fn = method === 'email' ? verifyOtp : verifyPhoneOtp
    const { error } = await fn(value, otp)
    setLoading(false)
    if (error) { setError(error); return }
    setStep('success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-5 ring-2 ring-green-500/30 animate-shield-pulse">
            <img
              src="/logo-alt.svg"
              alt="ShieldNet Core Technologies"
              className="w-32 h-32 object-contain bg-white"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ShieldNet Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Secure access to Nigeria's trusted property &amp; agri-tech platform
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          {step === 'method' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold">Sign in to continue</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMethod('email'); setStep('input') }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-green-500/50 hover:bg-green-500/5 transition-colors group"
                >
                  <Mail className="w-6 h-6 text-muted-foreground group-hover:text-green-400 transition-colors" />
                  <span className="text-sm font-medium">Email OTP</span>
                </button>
                <button
                  onClick={() => { setMethod('phone'); setStep('input') }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors group"
                >
                  <Phone className="w-6 h-6 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm font-medium">Phone OTP</span>
                </button>
              </div>

              {/* Demo notice */}
              <div className="mt-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                <p className="text-xs text-green-400 text-center">
                  <strong>Demo mode:</strong> Click any option to enter as Admin
                </p>
              </div>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-4">
              <button onClick={() => setStep('method')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                ← Back
              </button>
              <div className="space-y-2">
                <Label htmlFor="contact">
                  {method === 'email' ? 'Email address' : 'Phone number'}
                </Label>
                <Input
                  id="contact"
                  type={method === 'email' ? 'email' : 'tel'}
                  placeholder={method === 'email' ? 'you@example.com' : '+234 800 000 0000'}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button variant="shield" className="w-full" onClick={handleSendOtp} disabled={!value || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Send OTP
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to <strong className="text-foreground">{value}</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button variant="shield" className="w-full" onClick={handleVerifyOtp} disabled={otp.length < 6 || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Verify & Sign In
              </Button>
              <button onClick={() => setStep('input')} className="w-full text-xs text-muted-foreground hover:text-foreground text-center">
                Resend code
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
              <p className="text-sm font-medium">Verified! Redirecting…</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in you agree to ShieldNet's{' '}
          <a href="/terms.html" className="text-green-400 hover:underline">Terms</a> &{' '}
          <a href="/privacy.html" className="text-green-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
