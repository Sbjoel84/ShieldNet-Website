import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Wheat, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { City } from '@/lib/types'

type AccountType = 'agent' | 'farmer'
type Step = 'choose-type' | 'fill-form' | 'otp' | 'saving' | 'success'

interface AgentForm {
  fullName: string
  email: string
  phone: string
  city: City | ''
  agencyName: string
  bio: string
}

interface FarmerForm {
  fullName: string
  email: string
  phone: string
  city: City | ''
  farmName: string
  cropType: string
  farmSizeHa: string
  farmLocation: string
}

const CITY_COORDS: Record<City, { lat: number; lng: number }> = {
  Abuja: { lat: 9.0765, lng: 7.3986 },
  Lagos: { lat: 6.5244, lng: 3.3792 },
}

export function RegisterPage() {
  const { signInWithEmail, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('choose-type')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [agentForm, setAgentForm] = useState<AgentForm>({
    fullName: '', email: '', phone: '', city: '', agencyName: '', bio: '',
  })
  const [farmerForm, setFarmerForm] = useState<FarmerForm>({
    fullName: '', email: '', phone: '', city: '', farmName: '', cropType: '', farmSizeHa: '', farmLocation: '',
  })

  const email = accountType === 'agent' ? agentForm.email : farmerForm.email

  function agentField(key: keyof AgentForm) {
    return {
      value: agentForm[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setAgentForm(f => ({ ...f, [key]: e.target.value })),
    }
  }
  function farmerField(key: keyof FarmerForm) {
    return {
      value: farmerForm[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFarmerForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  function agentFormValid() {
    return agentForm.fullName && agentForm.email && agentForm.phone && agentForm.city
  }
  function farmerFormValid() {
    return farmerForm.fullName && farmerForm.email && farmerForm.phone && farmerForm.city
      && farmerForm.farmName && farmerForm.cropType
  }

  async function handleSendOtp() {
    setError('')
    setLoading(true)
    const { error } = await signInWithEmail(email)
    setLoading(false)
    if (error) { setError(error); return }
    setStep('otp')
  }

  async function handleVerifyAndCreate() {
    setError('')
    setLoading(true)

    const { error: otpError } = await verifyOtp(email, otp)
    if (otpError) { setError(otpError); setLoading(false); return }

    setStep('saving')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Session not found. Please try again.'); setLoading(false); return }

    if (accountType === 'agent') {
      await supabase.from('profiles').update({
        full_name: agentForm.fullName,
        phone: agentForm.phone,
        city: agentForm.city || null,
        role: 'agent',
      }).eq('id', user.id)
    } else {
      await supabase.from('profiles').update({
        full_name: farmerForm.fullName,
        phone: farmerForm.phone,
        city: farmerForm.city || null,
        role: 'farmer',
      }).eq('id', user.id)

      if (farmerForm.farmName) {
        const coords = farmerForm.city ? CITY_COORDS[farmerForm.city as City] : CITY_COORDS.Abuja
        await supabase.from('farms').insert({
          owner_id: user.id,
          owner_name: farmerForm.fullName,
          name: farmerForm.farmName,
          location: farmerForm.farmLocation || farmerForm.city,
          city: farmerForm.city,
          lat: coords.lat,
          lng: coords.lng,
          crop_type: farmerForm.cropType,
          area_hectares: parseFloat(farmerForm.farmSizeHa) || 1,
        })
      }
    }

    setLoading(false)
    setStep('success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-5 ring-2 ring-green-500/30">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-20 h-20 object-contain bg-white" />
          </div>
          <h1 className="text-2xl font-bold">Create Your ShieldNet Account</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Join thousands of Nigerians protected by AI
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">

          {/* ── STEP 1: Choose account type ── */}
          {step === 'choose-type' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold mb-1">What account do you need?</h2>
                <p className="text-xs text-muted-foreground">Choose the account type that fits your needs.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => { setAccountType('agent'); setStep('fill-form') }}
                  className="group flex flex-col items-start gap-3 p-5 rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Property Agent / Owner</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      List and manage properties on ShieldHome. Get Shield Verified for your listings.
                    </p>
                  </div>
                  <span className="text-xs text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                <button
                  onClick={() => { setAccountType('farmer'); setStep('fill-form') }}
                  className="group flex flex-col items-start gap-3 p-5 rounded-xl border border-border hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Wheat className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Farmer</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Manage your farm, get AI crop diagnoses, track diary activities and market prices.
                    </p>
                  </div>
                  <span className="text-xs text-green-400 flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Already have an account?{' '}
                <Link to="/auth" className="text-green-400 hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2a: Property Agent form ── */}
          {step === 'fill-form' && accountType === 'agent' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('choose-type')} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base font-semibold">Property Agent / Owner</h2>
                  <p className="text-xs text-muted-foreground">Fill in your details to get started</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Emeka Okafor" {...agentField('fullName')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+234 800 000 0000" {...agentField('phone')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...agentField('email')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Select onValueChange={v => setAgentForm(f => ({ ...f, city: v as City }))}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="agencyName">Agency / Company Name</Label>
                  <Input id="agencyName" placeholder="Optional" {...agentField('agencyName')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Brief Bio / About You</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell buyers a bit about yourself and your experience..."
                  rows={3}
                  {...agentField('bio')}
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                variant="shield"
                className="w-full"
                onClick={handleSendOtp}
                disabled={!agentFormValid() || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Continue — Send Verification Code
              </Button>
            </div>
          )}

          {/* ── STEP 2b: Farmer form ── */}
          {step === 'fill-form' && accountType === 'farmer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('choose-type')} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base font-semibold">Farmer Account</h2>
                  <p className="text-xs text-muted-foreground">Fill in your details to get started</p>
                </div>
              </div>

              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Personal Details</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Musa Ibrahim" {...farmerField('fullName')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+234 800 000 0000" {...farmerField('phone')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...farmerField('email')} />
                </div>
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Select onValueChange={v => setFarmerForm(f => ({ ...f, city: v as City }))}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-1">Farm Details</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="farmName">Farm Name *</Label>
                  <Input id="farmName" placeholder="Ibrahim Family Farm" {...farmerField('farmName')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cropType">Primary Crop *</Label>
                  <Input id="cropType" placeholder="e.g. Maize, Tomatoes, Rice" {...farmerField('cropType')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input id="farmSize" type="number" min="0.1" step="0.1" placeholder="e.g. 5.0" {...farmerField('farmSizeHa')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmLocation">Farm Location / Address</Label>
                  <Input id="farmLocation" placeholder="e.g. Kubwa, Abuja" {...farmerField('farmLocation')} />
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                variant="shield"
                className="w-full"
                onClick={handleSendOtp}
                disabled={!farmerFormValid() || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Continue — Send Verification Code
              </Button>
            </div>
          )}

          {/* ── STEP 3: OTP verification ── */}
          {step === 'otp' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('fill-form')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Check your inbox</p>
                <p className="text-xs text-muted-foreground">
                  We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && otp.length === 6 && handleVerifyAndCreate()}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button
                variant="shield"
                className="w-full"
                onClick={handleVerifyAndCreate}
                disabled={otp.length < 6 || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Verify & Create Account
              </Button>
              <button
                onClick={handleSendOtp}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center"
              >
                Resend code
              </button>
            </div>
          )}

          {/* ── STEP 4: Saving ── */}
          {step === 'saving' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-10 h-10 animate-spin text-green-400" />
              <p className="text-sm text-muted-foreground">Setting up your account…</p>
            </div>
          )}

          {/* ── STEP 5: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-400" />
              <div>
                <p className="text-base font-semibold">Account Created!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Welcome to ShieldNet.{' '}
                  {accountType === 'farmer'
                    ? 'Your farm profile is ready.'
                    : 'You can now list properties.'}
                </p>
              </div>
              <Button variant="shield" className="w-full mt-2" onClick={() => navigate('/')}>
                Go to Home <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account you agree to ShieldNet's{' '}
          <Link to="/terms" className="text-green-400 hover:underline">Terms</Link> &{' '}
          <Link to="/privacy" className="text-green-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
