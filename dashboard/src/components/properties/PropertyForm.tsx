import { useState } from 'react'
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

const STEPS = ['Basic Info', 'Details', 'Photos & Docs']

interface PropertyFormProps {
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => void
}

export function PropertyForm({ onClose, onSubmit }: PropertyFormProps) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', property_type: 'house', city: 'Abuja', address: '',
    price: '', bedrooms: '', bathrooms: '', area_sqm: '',
    photos: [] as string[], has_title_doc: false,
  })

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    onSubmit(form)
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>List a Property</DialogTitle>
      </DialogHeader>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
              i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-600/20 border-2 border-green-500 text-green-400' : 'bg-muted text-muted-foreground'
            }`}>
              {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="space-y-4 min-h-[260px]">
        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <>
            <div className="space-y-1.5">
              <Label>Property Title *</Label>
              <Input placeholder="e.g. 4-Bedroom Duplex in Maitama" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>City *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.city} onChange={e => set('city', e.target.value)}>
                  <option value="Abuja">Abuja</option>
                  <option value="Lagos">Lagos</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Full Address *</Label>
              <Input placeholder="Street, District, City" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (₦) *</Label>
              <Input type="number" placeholder="e.g. 45000000" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
          </>
        )}

        {/* Step 1 — Details */}
        {step === 1 && (
          <>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Describe the property, key features, nearby amenities…" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Bedrooms</Label>
                <Input type="number" placeholder="4" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Bathrooms</Label>
                <Input type="number" placeholder="3" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Area (m²)</Label>
                <Input type="number" placeholder="250" value={form.area_sqm} onChange={e => set('area_sqm', e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* Step 2 — Photos & Docs */}
        {step === 2 && (
          <>
            <div className="rounded-xl border-2 border-dashed border-border p-8 flex flex-col items-center gap-3 hover:border-green-500/50 hover:bg-green-500/5 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Upload Property Photos</p>
                <p className="text-xs text-muted-foreground mt-1">Up to 10 photos · JPG, PNG (max 5MB each)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <input
                type="checkbox"
                id="has-title"
                checked={form.has_title_doc}
                onChange={e => set('has_title_doc', e.target.checked)}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="has-title" className="text-sm cursor-pointer">
                I have a <strong>Title Document</strong> (C of O, Survey, Deed of Assignment)
              </label>
            </div>
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <p className="text-xs text-yellow-400">
                ⚠️ Properties are submitted for admin review. You'll be notified once approved and assigned a Shield Score.
              </p>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        {step > 0 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>}
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        {step < STEPS.length - 1 ? (
          <Button variant="shield" onClick={() => setStep(s => s + 1)} disabled={step === 0 && (!form.title || !form.address || !form.price)}>
            Next
          </Button>
        ) : (
          <Button variant="shield" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</> : 'Submit Listing'}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  )
}
