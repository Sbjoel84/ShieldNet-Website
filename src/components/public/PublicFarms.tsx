import { useState, useEffect } from 'react'
import { Wheat, TrendingUp, TrendingDown, Minus, ShieldCheck, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getMarketPrices, addApplication } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import type { MarketPrice } from '@/lib/types'

function TrendIcon({ t }: { t: 'up' | 'down' | 'stable' }) {
  if (t === 'up')   return <TrendingUp className="w-4 h-4 text-green-400" />
  if (t === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />
  return <Minus className="w-4 h-4 text-yellow-400" />
}

const CROPS      = ['Maize', 'Rice', 'Cassava', 'Yam', 'Tomatoes', 'Peppers', 'Sorghum', 'Plantain', 'Groundnut', 'Soybeans', 'Cowpea', 'Other']
const CHALLENGES = ['Crop Disease', 'Pest Infestation', 'Low Yield', 'Soil Degradation', 'Water Management', 'Market Access', 'Financing', 'New Farmer Guidance', 'Other']

const SERVICES = [
  { title: 'AI Crop Diagnosis',   desc: 'Upload a photo of your crop and our AI identifies diseases with 90%+ accuracy within seconds.' },
  { title: 'Market Intelligence', desc: 'Real-time prices from markets across Nigeria so you always sell at the best price.' },
  { title: 'Expert Consultations', desc: 'Connect with certified agronomists for personalised farm management advice.' },
  { title: 'Farm Diary',          desc: 'Track daily farm activities, weather, and inputs digitally — accessible from any device.' },
]

const EMPTY_FORM = { full_name: '', email: '', phone: '', crop_type: '', farm_size_ha: '', challenge: '', message: '' }

export function PublicFarms() {
  const [formOpen, setFormOpen]   = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [done, setDone]           = useState(false)
  const [sending, setSending]     = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [prices, setPrices]       = useState<MarketPrice[]>([])
  const [pricesLoading, setPricesLoading] = useState(true)

  useEffect(() => {
    getMarketPrices()
      .then(list => setPrices(list))
      .catch(() => {})
      .finally(() => setPricesLoading(false))
  }, [])

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function submit() {
    setSending(true)
    setSendError(null)
    try {
      await addApplication({
        type: 'farm_consultation',
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        message: form.message || 'Farm consultation request',
        crop_type: form.crop_type,
        farm_size_ha: form.farm_size_ha ? Number(form.farm_size_ha) : undefined,
        challenge: form.challenge,
        priority: 'medium',
      })
      setDone(true)
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-6 shadow-xl shadow-green-500/20 ring-2 ring-green-500/30 animate-shield-pulse">
            <img src="/ShieldFarm.png" alt="ShieldFarm" className="w-full h-full object-contain bg-white" />
            <span aria-hidden="true" className="logo-shine-overlay pointer-events-none absolute inset-0 animate-logo-shine" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            <Wheat className="w-3.5 h-3.5" />
            Powered by AI
          </div>
          <h1 className="text-4xl font-bold mb-4">ShieldFarm</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            AI-powered agricultural intelligence for Nigerian farmers. Diagnose crop diseases, track market prices, and get expert advice — all in one place.
          </p>
          <Button variant="shield" size="lg" className="h-12 px-8" onClick={() => setFormOpen(true)}>
            Request Farm Consultation
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Services */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">What ShieldFarm Offers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(s => (
              <Card key={s.title}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                    <Wheat className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Prices */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Live Market Prices</h2>
              <p className="text-sm text-muted-foreground mt-1">Updated daily from major markets across Nigeria</p>
            </div>
            <Badge variant="verified" className="text-xs">Live</Badge>
          </div>
          {pricesLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : prices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No market prices available yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {prices.map(mp => (
                <Card key={mp.id} className="hover:border-border/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold">{mp.crop_name}</p>
                      <TrendIcon t={mp.trend} />
                    </div>
                    <p className="text-xl font-bold text-foreground">₦{Number(mp.price_per_kg).toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/kg</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{mp.market}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="blue" className="text-[10px]">{mp.city}</Badge>
                      <span className={`text-[10px] font-medium ${Number(mp.change_percent) > 0 ? 'text-green-400' : Number(mp.change_percent) < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {Number(mp.change_percent) > 0 ? '+' : ''}{mp.change_percent}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{formatDate(mp.updated_at)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-green-500/5 border border-green-500/20 p-10 text-center">
          <Wheat className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Get Expert Farm Guidance</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Whether you're a new farmer or a seasoned pro, our agronomists can help you maximise yields, reduce losses, and access better markets.
          </p>
          <Button variant="shield" size="lg" onClick={() => setFormOpen(true)}>Request Consultation</Button>
        </section>
      </div>

      {/* Consultation Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <button type="button" onClick={() => setFormOpen(false)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors">
              <X className="w-4 h-4" />
            </button>
            {done ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <ShieldCheck className="w-14 h-14 text-green-400" />
                <h3 className="font-semibold text-lg">Consultation Requested!</h3>
                <p className="text-sm text-muted-foreground">Our agronomist team will contact you within 24 hours.</p>
                <Button variant="shield" onClick={() => { setFormOpen(false); setDone(false); setForm(EMPTY_FORM) }}>Done</Button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-5">Farm Consultation Request</h3>
                <div className="space-y-3">
                  <Input placeholder="Full Name *" value={form.full_name} onChange={f('full_name')} />
                  <Input placeholder="Email Address *" type="email" value={form.email} onChange={f('email')} />
                  <Input placeholder="Phone Number *" value={form.phone} onChange={f('phone')} />
                  <div className="grid grid-cols-2 gap-3">
                    <select aria-label="Crop type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.crop_type} onChange={f('crop_type')}>
                      <option value="">Crop Type</option>
                      {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Input placeholder="Farm size (ha)" type="number" value={form.farm_size_ha} onChange={f('farm_size_ha')} />
                  </div>
                  <select aria-label="Main challenge" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.challenge} onChange={f('challenge')}>
                    <option value="">Main Challenge</option>
                    {CHALLENGES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                    placeholder="Describe your situation in detail…"
                    value={form.message}
                    onChange={f('message')}
                  />
                </div>
                {sendError && <p className="text-sm text-destructive mt-2">{sendError}</p>}
                <div className="flex gap-2 mt-5">
                  <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Cancel</Button>
                  <Button variant="shield" className="flex-1" onClick={submit} disabled={!form.full_name || !form.email || !form.phone || sending}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
