import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Wheat, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { City } from '@/lib/types'

const API       = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'shieldnet_token'

type AccountType = 'agent' | 'farmer'
type Step = 'choose-type' | 'fill-form' | 'saving' | 'success'

interface AgentForm {
  fullName: string; email: string; phone: string
  city: City | ''; agencyName: string; bio: string; password: string
}
interface FarmerForm {
  fullName: string; email: string; phone: string
  city: City | ''; farmName: string; cropType: string
  farmSizeHa: string; farmLocation: string; password: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep]               = useState<Step>('choose-type')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  const [agentForm, setAgentForm] = useState<AgentForm>({
    fullName: '', email: '', phone: '', city: '', agencyName: '', bio: '', password: '',
  })
  const [farmerForm, setFarmerForm] = useState<FarmerForm>({
    fullName: '', email: '', phone: '', city: '', farmName: '',
    cropType: '', farmSizeHa: '', farmLocation: '', password: '',
  })

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

  const agentValid  = () => !!(agentForm.fullName && agentForm.email && agentForm.phone && agentForm.city && agentForm.password)
  const farmerValid = () => !!(farmerForm.fullName && farmerForm.email && farmerForm.phone && farmerForm.city && farmerForm.farmName && farmerForm.cropType && farmerForm.password)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    setStep('saving')

    const form = accountType === 'agent' ? agentForm : farmerForm

    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:     form.email.trim(),
          password:  form.password,
          full_name: form.fullName.trim(),
          phone:     form.phone.trim(),
          role:      accountType === 'agent' ? 'agent' : 'farmer',
          city:      form.city || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.')
        setStep('fill-form')
        setLoading(false)
        return
      }
      localStorage.setItem(TOKEN_KEY, data.token)
      setLoading(false)
      setStep('success')
    } catch {
      setError('Could not connect to server. Please try again.')
      setStep('fill-form')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-5 ring-2 ring-green-500/30">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-20 h-20 object-contain bg-white" />
          </div>
          <h1 className="text-2xl font-bold">Create Your ShieldNet Account</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">Join thousands of Nigerians protected by AI</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">

          {/* ── STEP 1: Choose type ── */}
          {step === 'choose-type' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold mb-1">What account do you need?</h2>
                <p className="text-xs text-muted-foreground">Choose the account type that fits your needs.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
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
                  type="button"
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

          {/* ── STEP 2a: Agent form ── */}
          {step === 'fill-form' && accountType === 'agent' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button type="button" aria-label="Go back" onClick={() => setStep('choose-type')} className="text-muted-foreground hover:text-foreground">
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
                <Textarea id="bio" placeholder="Tell buyers a bit about yourself..." rows={3} {...agentField('bio')} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Min. 8 characters" {...agentField('password')} />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button variant="shield" className="w-full" onClick={handleSubmit} disabled={!agentValid() || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Create Account
              </Button>
            </div>
          )}

          {/* ── STEP 2b: Farmer form ── */}
          {step === 'fill-form' && accountType === 'farmer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button type="button" aria-label="Go back" onClick={() => setStep('choose-type')} className="text-muted-foreground hover:text-foreground">
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
                  <Input id="cropType" placeholder="e.g. Maize, Tomatoes" {...farmerField('cropType')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input id="farmSize" type="number" min="0.1" step="0.1" placeholder="e.g. 5.0" {...farmerField('farmSizeHa')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmLocation">Farm Location</Label>
                  <Input id="farmLocation" placeholder="e.g. Kubwa, Abuja" {...farmerField('farmLocation')} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Min. 8 characters" {...farmerField('password')} />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button variant="shield" className="w-full" onClick={handleSubmit} disabled={!farmerValid() || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Create Account
              </Button>
            </div>
          )}

          {/* ── Saving ── */}
          {step === 'saving' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-10 h-10 animate-spin text-green-400" />
              <p className="text-sm text-muted-foreground">Setting up your account…</p>
            </div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-400" />
              <div>
                <p className="text-base font-semibold">Account Created!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Welcome to ShieldNet.{' '}
                  {accountType === 'farmer' ? 'Your farm profile is ready.' : 'You can now list properties.'}
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
