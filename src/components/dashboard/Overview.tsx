import { useState, useEffect } from 'react'
import { Building2, Wheat, Users, AlertTriangle, TrendingUp, Shield, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getStats, getFarms } from '@/lib/db'
import { formatNaira } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import type { Property, Farm } from '@/lib/types'

const QUICK_ACTIONS = [
  { label: 'List a Property', desc: 'Upload property with title docs', icon: Building2, to: '/dashboard/properties', color: 'from-blue-600 to-blue-800' },
  { label: 'Crop Diagnosis',  desc: 'Upload crop photo for AI analysis', icon: Wheat,     to: '/dashboard/farms',      color: 'from-green-600 to-green-800' },
  { label: 'AI Tools',        desc: 'Fraud detection & market intel',   icon: Shield,    to: '/dashboard/ai-tools',   color: 'from-purple-600 to-purple-800' },
]

interface Stats {
  properties: number
  farms: number
  agents: number
  fraud: number
  pendingQueue: number
  recentProperties: Property[]
}

export function Overview() {
  const { profile, role } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStats(),
      getFarms(),
    ])
      .then(([s, f]) => { setStats(s); setFarms(f) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const STATS = stats ? [
    { label: 'Total Properties', value: String(stats.properties), icon: Building2,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   delta: 'Live data' },
    { label: 'Active Farms',     value: String(stats.farms),      icon: Wheat,          color: 'text-green-400',  bg: 'bg-green-500/10',  delta: 'Live data' },
    { label: 'Verified Agents',  value: String(stats.agents),     icon: Users,          color: 'text-purple-400', bg: 'bg-purple-500/10', delta: 'Registered' },
    { label: 'Fraud Reports',    value: String(stats.fraud),      icon: AlertTriangle,  color: 'text-orange-400', bg: 'bg-orange-500/10', delta: `${stats.pendingQueue} in queue` },
  ] : []

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {greeting}, {profile?.full_name?.split(' ')[0] ?? 'User'} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening on ShieldNet today.
          </p>
        </div>
        {role === 'admin' && stats && (
          <Button variant="shield" onClick={() => navigate('/dashboard/admin')} className="shrink-0">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Review Queue ({stats.pendingQueue})
          </Button>
        )}
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color, bg, delta }) => (
            <Card key={label} className="hover:border-border/80 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                <p className="text-[11px] text-green-400 mt-1">{delta}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ label, desc, icon: Icon, to, color }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${color} p-5 text-left hover:opacity-90 transition-opacity group`}
            >
              <Icon className="w-8 h-8 text-white/80 mb-3" />
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/70 mt-1">{desc}</p>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Properties */}
      {stats && stats.recentProperties.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Listings</h3>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/dashboard/properties')}>
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {stats.recentProperties.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-border/80 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/properties')}>
                {p.photos?.[0] ? (
                  <img src={p.photos[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-green-400">{formatNaira(p.price)}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {p.shield_verified
                      ? <Badge variant="verified" className="text-[10px] py-0 px-1.5">✓ Verified</Badge>
                      : <Badge variant="pending" className="text-[10px] py-0 px-1.5">Pending</Badge>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farm snapshot */}
      {farms.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Farm Snapshot</h3>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/dashboard/farms')}>
              ShieldFarm <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {farms.slice(0, 6).map(farm => (
              <div key={farm.id} className="p-3 rounded-xl bg-card border border-border flex items-center gap-3 cursor-pointer hover:border-green-500/30 transition-colors" onClick={() => navigate('/dashboard/farms')}>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Wheat className="w-5 h-5 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{farm.name}</p>
                  <p className="text-xs text-muted-foreground">{farm.crop_type} · {farm.area_hectares} ha</p>
                  <p className="text-[11px] text-muted-foreground/70">{farm.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && stats?.properties === 0 && farms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <p>No data yet — start by listing a property or adding a farm.</p>
        </div>
      )}
    </div>
  )
}
