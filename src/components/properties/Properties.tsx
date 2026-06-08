import { useState, useEffect } from 'react'
import { LayoutGrid, Map, Plus, ShieldCheck, SlidersHorizontal, X, Loader2 } from 'lucide-react'
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
import { apiFetch } from '@/hooks/useApi'
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
  const [editTarget, setEditTarget] = useState<Property | null>(null)
  const [reportTarget, setReportTarget] = useState<string | null>(null)
  const [viewTarget, setViewTarget] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  async function loadProperties() {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (city !== 'All') params.set('city', city)
      if (type !== 'All') params.set('type', type)
      if (verifiedOnly)   params.set('verified', 'true')
      if (search)         params.set('search', search)
      const data = await apiFetch<{ properties: Property[] }>(`/api/properties?${params}`)
      setProperties(data.properties)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load properties.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProperties()
  }, [city, type, verifiedOnly, search])

  useEffect(() => {
    if (!submitted) return
    const timer = setTimeout(() => setSubmitted(false), 4000)
    return () => clearTimeout(timer)
  }, [submitted])

  const filtered = properties

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      const result = await apiFetch<{ property: Property }>('/api/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      setProperties(prev => [result.property, ...prev])
      setFormOpen(false)
      setSubmitted(true)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit property.')
    }
  }

  async function handleEdit(data: Record<string, unknown>) {
    if (!editTarget) return
    try {
      const result = await apiFetch<{ property: Property }>(`/api/properties/${editTarget.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      setProperties(prev => prev.map(p => p.id === editTarget.id ? result.property : p))
      setEditTarget(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update property.')
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/properties/${id}`, { method: 'DELETE' })
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete property.')
    }
  }

  async function handleMarkSold(id: string) {
    try {
      const result = await apiFetch<{ property: Property }>(`/api/properties/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'sold' }),
      })
      setProperties(prev => prev.map(p => p.id === id ? result.property : p))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update status.')
    }
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

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={loadProperties}>Retry</Button>
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
          {city !== 'All' && <Badge variant="blue" className="text-xs gap-1">{city} <button type="button" title="Remove city filter" onClick={() => setCity('All')}><X className="w-3 h-3" /></button></Badge>}
          {type !== 'All' && <Badge variant="secondary" className="text-xs gap-1 capitalize">{type} <button type="button" title="Remove type filter" onClick={() => setType('All')}><X className="w-3 h-3" /></button></Badge>}
          {verifiedOnly && <Badge variant="verified" className="text-xs gap-1">Verified only <button type="button" title="Remove verified filter" onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button></Badge>}
          {search && <Badge variant="outline" className="text-xs gap-1">"{search}" <button type="button" title="Clear search" onClick={() => setSearch('')}><X className="w-3 h-3" /></button></Badge>}
        </div>
      )}

      {view === 'grid' && (
        loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                onReport={id => setReportTarget(id)}
                onView={openView}
                onEdit={role === 'admin' ? p => setEditTarget(p) : undefined}
                onDelete={role === 'admin' ? handleDelete : undefined}
                onMarkSold={role === 'admin' ? handleMarkSold : undefined}
              />
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

      <Dialog open={!!editTarget} onOpenChange={open => { if (!open) setEditTarget(null) }}>
        {editTarget && (
          <PropertyForm
            onClose={() => setEditTarget(null)}
            onSubmit={handleEdit}
            editProperty={editTarget}
          />
        )}
      </Dialog>
    </div>
  )
}
