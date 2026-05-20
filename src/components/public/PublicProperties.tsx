import { useState } from 'react'
import { ShieldCheck, AlertTriangle, Bed, Bath, Maximize2, MapPin, Search, SlidersHorizontal, X, Phone, FileText, User, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SEED_PROPERTIES, SEED_APPLICATIONS } from '@/data/seedData'
import { formatNaira, formatDate } from '@/lib/utils'
import type { Property, City, PropertyType, Application } from '@/lib/types'

function PropertyDetailModal({ p, onClose, onInquire }: { p: Property; onClose: () => void; onInquire: () => void }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="relative aspect-video bg-muted overflow-hidden rounded-t-2xl">
          <img src={p.photos[photoIdx] ?? p.photos[0]} alt={p.title} className="w-full h-full object-cover" />
          {p.shield_verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/90 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white font-semibold">Shield Verified</span>
            </div>
          )}
          {p.photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {p.photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === photoIdx ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold">{p.title}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{p.address}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatNaira(p.price)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="blue" className="text-xs">{p.city}</Badge>
            <Badge variant="secondary" className="text-xs capitalize">{p.property_type}</Badge>
            {p.fraud_report_count > 0 && (
              <Badge variant="flagged" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />{p.fraud_report_count} report{p.fraud_report_count > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {(p.bedrooms || p.bathrooms || p.area_sqm) && (
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/40 border border-border">
              {p.bedrooms  && <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.bedrooms}</strong> Beds</span></div>}
              {p.bathrooms && <div className="flex items-center gap-2"><Bath className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.bathrooms}</strong> Baths</span></div>}
              {p.area_sqm  && <div className="flex items-center gap-2"><Maximize2 className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.area_sqm.toLocaleString()}</strong> m²</span></div>}
            </div>
          )}
          {p.description && <p className="text-sm text-foreground/85 leading-relaxed">{p.description}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border">
              <User className="w-4 h-4 text-green-400 shrink-0" />
              <div><p className="text-[10px] text-muted-foreground">Agent</p><p className="text-sm font-medium">{p.agent_name}</p></div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <div><p className="text-[10px] text-muted-foreground">Listed</p><p className="text-sm font-medium">{formatDate(p.created_at)}</p></div>
            </div>
          </div>
          {p.title_doc_url && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-green-500/20 bg-green-500/5">
              <FileText className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-sm font-medium flex-1">Title Document Available</p>
              <Badge variant="verified" className="text-xs">Uploaded</Badge>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="shield" className="flex-1" onClick={onInquire}>
              <Phone className="w-4 h-4 mr-2" />Send Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InquiryForm({ property, onClose, onSubmit }: { property: Property; onClose: () => void; onSubmit: (a: Application) => void }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', interest_type: 'buy' as 'buy' | 'rent' | 'invest', budget: '', message: '' })
  const [done, setDone] = useState(false)

  function submit() {
    const app: Application = {
      id: `app-${Date.now()}`,
      type: 'property_inquiry',
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      status: 'new',
      priority: 'medium',
      created_at: new Date().toISOString(),
      property_id: property.id,
      property_title: property.title,
      interest_type: form.interest_type,
      budget: form.budget ? Number(form.budget) : undefined,
    }
    onSubmit(app)
    setDone(true)
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors">
          <X className="w-4 h-4" />
        </button>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <ShieldCheck className="w-14 h-14 text-green-400" />
            <h3 className="font-semibold text-lg">Inquiry Sent!</h3>
            <p className="text-sm text-muted-foreground">Our team will contact you within 24 hours to arrange a viewing.</p>
            <Button variant="shield" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-1">Property Inquiry</h3>
            <p className="text-sm text-muted-foreground mb-5">{property.title}</p>
            <div className="space-y-3">
              <Input placeholder="Full Name *" value={form.full_name} onChange={f('full_name')} />
              <Input placeholder="Email Address *" type="email" value={form.email} onChange={f('email')} />
              <Input placeholder="Phone Number *" value={form.phone} onChange={f('phone')} />
              <div className="grid grid-cols-2 gap-3">
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.interest_type} onChange={f('interest_type')}>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="invest">Invest</option>
                </select>
                <Input placeholder="Budget (₦)" type="number" value={form.budget} onChange={f('budget')} />
              </div>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Your message or questions…"
                value={form.message}
                onChange={f('message')}
              />
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="shield" className="flex-1" onClick={submit} disabled={!form.full_name || !form.email || !form.phone}>Submit Inquiry</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const APPROVED = SEED_PROPERTIES.filter(p => p.status === 'approved')

export function PublicProperties() {
  const [city, setCity] = useState<City | 'All'>('All')
  const [type, setType] = useState<PropertyType | 'All'>('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Property | null>(null)
  const [inquiring, setInquiring] = useState<Property | null>(null)
  const [applications, setApplications] = useState(SEED_APPLICATIONS)

  const filtered = APPROVED.filter(p => {
    if (city !== 'All' && p.city !== city) return false
    if (type !== 'All' && p.property_type !== type) return false
    if (verifiedOnly && !p.shield_verified) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.address.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleInquiry(app: Application) {
    setApplications(prev => [app, ...prev])
    setSelected(null)
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-blue-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI-Verified Listings
          </div>
          <h1 className="text-4xl font-bold mb-4">ShieldHome</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Browse verified real estate listings across Abuja and Lagos. Every property is AI-scanned, fraud-scored, and Shield Verified before you buy, rent, or invest.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search properties…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Select value={city} onValueChange={v => setCity(v as City | 'All')}>
          <SelectTrigger className="h-10 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            <SelectItem value="Abuja">Abuja</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={v => setType(v as PropertyType | 'All')}>
          <SelectTrigger className="h-10 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={verifiedOnly ? 'shield' : 'outline'} size="sm" className="h-10 text-xs" onClick={() => setVerifiedOnly(v => !v)}>
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />Verified Only
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <div key={p.id} className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => setSelected(p)}>
              <div className="relative aspect-video overflow-hidden">
                <img src={p.photos[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.shield_verified && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600/90 text-white text-[10px] font-semibold">
                    <ShieldCheck className="w-3 h-3" />Verified
                  </div>
                )}
                {p.fraud_report_count > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-[10px] font-semibold">
                    <AlertTriangle className="w-3 h-3" />{p.fraud_report_count}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm leading-snug truncate mb-1">{p.title}</p>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">{p.address}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-green-400">{formatNaira(p.price)}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {p.bedrooms && <span>{p.bedrooms}bd</span>}
                    {p.bathrooms && <span>{p.bathrooms}ba</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <SlidersHorizontal className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No properties match your filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setCity('All'); setType('All'); setVerifiedOnly(false); setSearch('') }}>Clear filters</Button>
        </div>
      )}

      {selected && !inquiring && (
        <PropertyDetailModal
          p={selected}
          onClose={() => setSelected(null)}
          onInquire={() => setInquiring(selected)}
        />
      )}

      {inquiring && (
        <InquiryForm
          property={inquiring}
          onClose={() => setInquiring(null)}
          onSubmit={handleInquiry}
        />
      )}
      </div>
    </div>
  )
}
