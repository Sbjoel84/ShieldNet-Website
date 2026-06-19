import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  ShieldCheck, Percent, BadgeCheck, Users,
} from 'lucide-react'
import { ShieldLogo } from '@/components/ui/ShieldLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { createAgentProfile, getProfile } from '@/lib/db'
import type { City } from '@/lib/types'

type Step = 'terms' | 'form' | 'saving' | 'success'

interface Form {
  fullName: string
  email: string
  phone: string
  city: City | ''
  agencyName: string
  bio: string
  password: string
  confirmPassword: string
}

const EMPTY: Form = {
  fullName: '', email: '', phone: '', city: '',
  agencyName: '', bio: '', password: '', confirmPassword: '',
}

const COMMISSION_POINTS = [
  {
    icon: Percent,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: '15% Commission on Sales',
    desc: 'ShieldNetCore Technologies retains 15% of the total transaction value when a property listed through our platform is successfully sold. You keep 85%.',
  },
  {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Admin-Approved Listings',
    desc: 'Every property you submit is reviewed by our team before going live. This ensures only verified, legitimate listings appear on the platform.',
  },
  {
    icon: BadgeCheck,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Shield Verified Badge',
    desc: 'Approved listings with valid title documents earn the Shield Verified badge — increasing buyer trust and conversion rates.',
  },
  {
    icon: Users,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    title: 'Reach Thousands of Buyers',
    desc: 'Your listings are visible to verified buyers across Abuja and Lagos — and growing to other Nigerian cities.',
  },
]

export function AgentRegisterPage() {
  const navigate = useNavigate()
  const { signUp, signIn } = useAuth()
  const [step, setStep]       = useState<Step>('terms')
  const [form, setForm]       = useState<Form>(EMPTY)
  const [agreed, setAgreed]   = useState(false)
  const [error, setError]     = useState('')
  const [fieldErr, setFieldErr] = useState('')

  function field(key: keyof Form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  const isValid = !!(
    form.fullName && form.email && form.phone &&
    form.city && form.password && form.confirmPassword
  )

  async function handleSubmit() {
    setError('')
    setFieldErr('')

    if (form.password.length < 8) {
      setFieldErr('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFieldErr('Passwords do not match.')
      return
    }

    setStep('saving')

    const profileData = {
      email:       form.email.trim(),
      full_name:   form.fullName.trim(),
      phone:       form.phone.trim(),
      city:        form.city,
      agency_name: form.agencyName.trim() || undefined,
      bio:         form.bio.trim() || undefined,
    }

    const { uid, error: signUpError } = await signUp(form.email.trim(), form.password)

    if (!uid && signUpError === 'email-in-use') {
      // Firebase Auth account exists (prior partial registration) — sign them in and recover
      const { error: signInError, uid: existingUid } = await signIn(form.email.trim(), form.password)
      if (signInError || !existingUid) {
        setError('An account with this email already exists. Try signing in at /auth with your original password.')
        setStep('form')
        return
      }
      // Check if Firestore profile is missing and re-save it
      const existing = await getProfile(existingUid).catch(() => null)
      if (existing) {
        setStep('success')
        return
      }
      try {
        await createAgentProfile(existingUid, profileData)
        setStep('success')
      } catch {
        setError('Account exists but profile save failed. Contact shieldnetcore@gmail.com.')
        setStep('form')
      }
      return
    }

    if (!uid) {
      setError(signUpError ?? 'Registration failed. Please try again.')
      setStep('form')
      return
    }

    try {
      await createAgentProfile(uid, profileData)
      setStep('success')
    } catch {
      setError('Account created but profile save failed. Please contact support.')
      setStep('form')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <ShieldLogo sizeClass="w-20 h-20" wrapperClassName="rounded-2xl shadow-2xl shadow-black/40 mb-5 ring-2 ring-blue-500/30" />
          <h1 className="text-2xl font-bold">Become a ShieldNet Agent</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            List properties, reach verified buyers, grow your business
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">

          {/* ── STEP 1: Terms & Commission ── */}
          {step === 'terms' && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold">Agent Agreement</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Please read and agree to the following terms before creating your agent account.
                </p>
              </div>

              <div className="space-y-3">
                {COMMISSION_POINTS.map(({ icon: Icon, color, bg, title, desc }) => (
                  <div key={title} className="flex gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commission highlight */}
              <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">85% / 15%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You earn <strong className="text-foreground">85%</strong> of every sale.
                  ShieldNetCore Technologies retains <strong className="text-foreground">15%</strong> as platform fee.
                </p>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-green-500"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I have read and agree to the agent commission terms above and ShieldNetCore Technologies'{' '}
                  <Link to="/terms" className="text-green-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-green-400 hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <Button
                variant="shield"
                className="w-full"
                disabled={!agreed}
                onClick={() => setStep('form')}
              >
                Continue to Registration <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth" className="text-green-400 hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Registration Form ── */}
          {step === 'form' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  aria-label="Go back"
                  onClick={() => setStep('terms')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Agent Registration
                  </h2>
                  <p className="text-xs text-muted-foreground">All fields marked * are required</p>
                </div>
              </div>

              {/* Personal */}
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Personal Details</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="e.g. Emeka Okafor" {...field('fullName')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+234 803 000 0000" {...field('phone')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...field('email')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Select onValueChange={v => setForm(f => ({ ...f, city: v as City }))}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="agencyName">Agency / Company Name</Label>
                  <Input id="agencyName" placeholder="Optional" {...field('agencyName')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Brief Bio</Label>
                <Textarea id="bio" placeholder="Tell buyers a bit about yourself and your experience…" rows={2} {...field('bio')} />
              </div>

              {/* Security */}
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pt-1">Account Security</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" placeholder="Min. 8 characters" {...field('password')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" placeholder="Re-enter password" {...field('confirmPassword')} />
                </div>
              </div>

              {fieldErr && <p className="text-xs text-destructive">{fieldErr}</p>}
              {error && (
                <p className="text-xs text-destructive">
                  {error}{' '}
                  {error.includes('already exists') && (
                    <Link to="/auth" className="underline text-green-400">Sign in instead</Link>
                  )}
                </p>
              )}

              {/* Commission reminder */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/5 border border-green-500/20">
                <Percent className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  By registering you agree to the <span className="text-foreground font-medium">15% platform commission</span> on all completed sales.
                </p>
              </div>

              <Button
                variant="shield"
                className="w-full"
                onClick={handleSubmit}
                disabled={!isValid}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Create Agent Account
              </Button>
            </div>
          )}

          {/* ── Saving ── */}
          {step === 'saving' && (
            <div className="p-10 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
              <p className="text-sm text-muted-foreground">Setting up your agent account…</p>
            </div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
              <div>
                <p className="text-lg font-bold">Welcome to ShieldNet!</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Your agent account is live. Sign in to access your dashboard and start listing properties.
                </p>
              </div>
              <div className="w-full space-y-2 mt-2">
                <Button variant="shield" className="w-full" onClick={() => navigate('/auth')}>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Looking to use ShieldNet services?{' '}
          <Link to="/" className="text-green-400 hover:underline">Visit our homepage</Link>
        </p>
      </div>
    </div>
  )
}
