import { Building2, Wheat, Users, AlertTriangle, TrendingUp, Shield, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { SEED_PROPERTIES, SEED_FARMS } from '@/data/seedData'
import { formatNaira, formatDate } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { label: 'Total Properties', value: '8', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', delta: '+2 this month' },
  { label: 'Active Farms',     value: '5', icon: Wheat,     color: 'text-green-400', bg: 'bg-green-500/10', delta: '+1 this month' },
  { label: 'Verified Agents',  value: '5', icon: Users,     color: 'text-purple-400', bg: 'bg-purple-500/10', delta: '2 pending' },
  { label: 'Fraud Reports',    value: '3', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', delta: '1 open' },
]

const QUICK_ACTIONS = [
  { label: 'List a Property', desc: 'Upload property with title docs', icon: Building2, to: '/dashboard/properties', color: 'from-blue-600 to-blue-800' },
  { label: 'Crop Diagnosis',  desc: 'Upload crop photo for AI analysis', icon: Wheat,     to: '/dashboard/farms',      color: 'from-green-600 to-green-800' },
  { label: 'AI Tools',        desc: 'Fraud detection & market intel',   icon: Shield,    to: '/dashboard/ai-tools',   color: 'from-purple-600 to-purple-800' },
]

export function Overview() {
  const { profile, role } = useAuth()
  const navigate = useNavigate()
  const recentProperties = SEED_PROPERTIES.slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

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
        {role === 'admin' && (
          <Button variant="shield" onClick={() => navigate('/dashboard/admin')} className="shrink-0">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Review Queue (3)
          </Button>
        )}
      </div>

      {/* Stats */}
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
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Listings</h3>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/dashboard/properties')}>
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="space-y-2">
          {recentProperties.map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-border/80 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/properties')}>
              <img
                src={p.photos[0]}
                alt={p.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
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

      {/* Farm snapshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Farm Snapshot</h3>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/dashboard/farms')}>
            ShieldFarm <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SEED_FARMS.map(farm => (
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
    </div>
  )
}
