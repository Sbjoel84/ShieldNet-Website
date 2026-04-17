import { Bed, Bath, Maximize2, MapPin, ShieldCheck, AlertTriangle, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNaira } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  onReport?: (id: string) => void
  onView?: (property: Property) => void
}

const TYPE_LABELS: Record<string, string> = {
  land: 'Land', house: 'House', apartment: 'Apartment', commercial: 'Commercial',
}

export function PropertyCard({ property: p, onReport, onView }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group hover:border-border/80 transition-all hover:shadow-lg hover:shadow-black/20">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={p.photos[0]}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant={p.status === 'approved' ? 'secondary' : 'pending'} className="text-[10px] backdrop-blur-sm bg-black/40 text-white border-white/20">
            {TYPE_LABELS[p.property_type]}
          </Badge>
          <Badge variant="secondary" className="text-[10px] backdrop-blur-sm bg-black/40 text-white border-white/20">
            {p.city}
          </Badge>
        </div>
        {p.shield_verified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600/90 backdrop-blur-sm shield-glow">
            <ShieldCheck className="w-3 h-3 text-white" />
            <span className="text-[10px] text-white font-semibold">Shield Verified</span>
          </div>
        )}
        {p.fraud_report_count > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-600/90 backdrop-blur-sm">
            <AlertTriangle className="w-3 h-3 text-white" />
            <span className="text-[10px] text-white">{p.fraud_report_count} report{p.fraud_report_count > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold line-clamp-2 leading-snug">{p.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground truncate">{p.address}</p>
          </div>
        </div>

        <p className="text-xl font-bold text-green-400">{formatNaira(p.price)}</p>

        {/* Property details */}
        {(p.bedrooms || p.bathrooms || p.area_sqm) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {p.bedrooms   && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bedrooms} bed</span>}
            {p.bathrooms  && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms} bath</span>}
            {p.area_sqm   && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{p.area_sqm.toLocaleString()} m²</span>}
          </div>
        )}

        {/* Agent */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <p className="text-xs text-muted-foreground">Agent: <span className="text-foreground">{p.agent_name}</span></p>
          <div className="flex gap-1.5">
            {onReport && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-orange-400"
                title="Report fraud"
                onClick={() => onReport(p.id)}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
              </Button>
            )}
            {onView && (
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onView(p)}>
                <Eye className="w-3.5 h-3.5 mr-1" />View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
