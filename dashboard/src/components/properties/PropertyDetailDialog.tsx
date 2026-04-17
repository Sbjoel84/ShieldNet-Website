import { AlertTriangle, Bed, Bath, Maximize2, MapPin, FileText, User, Calendar, Phone, ShieldCheck, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNaira, formatDate } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface Props {
  property: Property
  photoIndex: number
  onPhotoChange: (i: number) => void
  onReport: () => void
  onClose: () => void
}

export function PropertyDetailDialog({ property: p, photoIndex, onPhotoChange, onReport, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative aspect-video bg-muted overflow-hidden rounded-t-2xl">
          <img src={p.photos[photoIndex] ?? p.photos[0]} alt={p.title} className="w-full h-full object-cover" />
          {p.shield_verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/90 backdrop-blur-sm shield-glow">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white font-semibold">Shield Verified</span>
            </div>
          )}
          {p.photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {p.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPhotoChange(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === photoIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold leading-snug">{p.title}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">{p.address}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400 shrink-0">{formatNaira(p.price)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="blue" className="text-xs">{p.city}</Badge>
            <Badge variant="secondary" className="text-xs capitalize">{p.property_type}</Badge>
            <Badge variant={p.status === 'approved' ? 'verified' : 'pending'} className="text-xs capitalize">{p.status}</Badge>
            {p.fraud_report_count > 0 && (
              <Badge variant="flagged" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />{p.fraud_report_count} fraud report{p.fraud_report_count > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {(p.bedrooms || p.bathrooms || p.area_sqm) && (
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/40 border border-border">
              {p.bedrooms  && <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.bedrooms}</strong> Bedrooms</span></div>}
              {p.bathrooms && <div className="flex items-center gap-2"><Bath className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.bathrooms}</strong> Bathrooms</span></div>}
              {p.area_sqm  && <div className="flex items-center gap-2"><Maximize2 className="w-4 h-4 text-muted-foreground" /><span className="text-sm"><strong>{p.area_sqm.toLocaleString()}</strong> m²</span></div>}
            </div>
          )}

          {p.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description</p>
              <p className="text-sm text-foreground/85 leading-relaxed">{p.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="w-9 h-9 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Listed by</p>
                <p className="text-sm font-medium">{p.agent_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Listed on</p>
                <p className="text-sm font-medium">{formatDate(p.created_at)}</p>
              </div>
            </div>
          </div>

          {p.title_doc_url && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-green-500/20 bg-green-500/5">
              <FileText className="w-5 h-5 text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Title Document Available</p>
                <p className="text-xs text-muted-foreground">C of O / Survey / Deed of Assignment</p>
              </div>
              <Badge variant="verified" className="text-xs shrink-0">Uploaded</Badge>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="shield" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />Contact Agent
            </Button>
            <Button variant="outline" className="text-orange-400 border-orange-500/30 hover:bg-orange-500/10" onClick={onReport}>
              <AlertTriangle className="w-4 h-4 mr-2" />Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
