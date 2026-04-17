import { useState, useEffect } from 'react'
import { LayoutGrid, Map, Plus, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyCard } from './PropertyCard'
import { PropertyForm } from './PropertyForm'
import { PropertyMap } from './PropertyMap'
import { PropertyDetailDialog } from './PropertyDetailDialog'
import { FraudReportDialog } from './FraudReportDialog'
import { SEED_PROPERTIES } from '@/data/seedData'
import type { Property, City, PropertyType } from '@/lib/types'
import { useAuth } from '@/hooks/useAuth'

type ViewMode = 'grid' | 'map'

export function Properties() {
  const { role } = useAuth()
  const [view, setView] = useState<ViewMode>('grid')
  const [city, setCity] = useState<City | 'All'>('All')
  const [type, setType] = useState<PropertyType | 'All'>('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<string | null>(null)
  const [viewTarget, setViewTarget] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES)
  const [submitted, setSubmitted] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    if (!submitted) return
    const timer = setTimeout(() => setSubmitted(false), 4000)
    return () => clearTimeout(timer)
  }, [submitted])

  const filtered = properties.filter(p => {
    if (city !== 'All' && p.city !== city) return false
    if (type !== 'All' && p.property_type !== type) return false
    if (verifiedOnly && !p.shield_verified) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.address.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleSubmit(data: Record<string, unknown>) {
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: data.title as string,
      description: (data.description as string) || '',
      price: Number(data.price) || 0,
      property_type: data.property_type as PropertyType,
      city: data.city as City,
      address: data.address as string,
      lat: 9.05, lng: 7.49,
      photos: ['https://images.unsplash.com/photo-1582407947304-fd86f28f5c47?w=800&auto=format'],
      status: 'pending',
      shield_verified: false,
      fraud_report_count: 0,
      agent_id: 'current-user',
      agent_name: 'You',
      bedrooms: Number(data.bedrooms) || undefined,
      bathrooms: Number(data.bathrooms) || undefined,
      area_sqm: Number(data.area_sqm) || undefined,
      created_at: new Date().toISOString(),
    }
    setProperties(prev => [newProp, ...prev])
    setFormOpen(false)
    setSubmitted(true)
  }

  function openView(p: Property) {
    setViewTarget(p)
    setPhotoIndex(0)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            ShieldNet Properties
          </h2>
          <p className="text-sm text-muted-foreground">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        {(role === 'agent' || role === 'admin') && (
          <Button variant="shield" onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />List Property
          </Button>
        )}
      </div>

      {submitted && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">Property submitted for admin review. You'll be notified once verified.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Search properties…" value={search} onChange={e => setSearch(e.target.value)} className="h-9 w-48 text-sm" />
        <Select value={city} onValueChange={v => setCity(v as City | 'All')}>
          <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            <SelectItem value="Abuja">Abuja</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={v => setType(v as PropertyType | 'All')}>
          <SelectTrigger className="h-9 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={verifiedOnly ? 'shield' : 'outline'} size="sm" className="h-9 text-xs" onClick={() => setVerifiedOnly(v => !v)}>
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />Verified Only
        </Button>
        <div className="ml-auto flex bg-muted rounded-lg p-1 gap-0.5">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setView('grid')}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
          <Button variant={view === 'map' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setView('map')}>
            <Map className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {(city !== 'All' || type !== 'All' || verifiedOnly || search) && (
        <div className="flex flex-wrap gap-1.5">
          {city !== 'All' && <Badge variant="blue" className="text-xs gap-1">{city} <button onClick={() => setCity('All')}><X className="w-3 h-3" /></button></Badge>}
          {type !== 'All' && <Badge variant="secondary" className="text-xs gap-1 capitalize">{type} <button onClick={() => setType('All')}><X className="w-3 h-3" /></button></Badge>}
          {verifiedOnly && <Badge variant="verified" className="text-xs gap-1">Verified only <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button></Badge>}
          {search && <Badge variant="outline" className="text-xs gap-1">"{search}" <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button></Badge>}
        </div>
      )}

      {view === 'grid' && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} onReport={id => setReportTarget(id)} onView={openView} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SlidersHorizontal className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No properties match your filters.</p>
            <Button variant="outline" size="sm" onClick={() => { setCity('All'); setType('All'); setVerifiedOnly(false); setSearch('') }}>Clear filters</Button>
          </div>
        )
      )}

      {view === 'map' && (
        <div className="h-[calc(100vh-280px)] min-h-[400px] rounded-xl overflow-hidden border border-border">
          <PropertyMap properties={filtered} />
        </div>
      )}

      {viewTarget && (
        <PropertyDetailDialog
          property={viewTarget}
          photoIndex={photoIndex}
          onPhotoChange={setPhotoIndex}
          onReport={() => { setViewTarget(null); setReportTarget(viewTarget.id) }}
          onClose={() => setViewTarget(null)}
        />
      )}

      {reportTarget && <FraudReportDialog propertyId={reportTarget} onClose={() => setReportTarget(null)} />}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <PropertyForm onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />
      </Dialog>
    </div>
  )
}
