import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/hooks/useApi'
import type { MarketPrice, City } from '@/lib/types'

function TrendIcon({ trend, change }: { trend: 'up' | 'down' | 'stable'; change: number }) {
  if (trend === 'up')   return <span className="flex items-center gap-0.5 text-green-400 text-xs font-medium"><TrendingUp className="w-3.5 h-3.5" />+{change}%</span>
  if (trend === 'down') return <span className="flex items-center gap-0.5 text-red-400 text-xs font-medium"><TrendingDown className="w-3.5 h-3.5" />{change}%</span>
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="w-3.5 h-3.5" />{change}%</span>
}

export function MarketPrices() {
  const [city, setCity] = useState<City | 'All'>('All')
  const [allPrices, setAllPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<{ prices: MarketPrice[] }>('/api/market-prices')
      setAllPrices(data.prices)
      setLastUpdated(new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      // keep existing data on refresh failure
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const prices = allPrices.filter(p => city === 'All' || p.city === city)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['All', 'Abuja', 'Lagos'] as const).map(c => (
            <Button key={c} variant={city === c ? 'shield' : 'outline'} size="sm" onClick={() => setCity(c)} className="text-xs">
              {c}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1" />}
          {lastUpdated ? `Updated: ${lastUpdated}` : 'Refresh'}
        </Button>
      </div>

      {loading && allPrices.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : prices.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No market prices available yet.</p>
      ) : (
        <>
          {/* Price cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {prices.map(p => (
              <Card key={p.id} className="hover:border-border/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold">{p.crop_name}</p>
                      <p className="text-xs text-muted-foreground">{p.market}</p>
                    </div>
                    <Badge variant={p.city === 'Abuja' ? 'blue' : 'secondary'} className="text-[10px]">
                      {p.city}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    ₦{Number(p.price_per_kg).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">/kg</span>
                  </p>
                  <div className="mt-2">
                    <TrendIcon trend={p.trend} change={Number(p.change_percent)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary table for desktop */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="text-sm">Price Summary Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Crop</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Market</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">City</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">₦/kg</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {prices.map(p => (
                      <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{p.crop_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.market}</td>
                        <td className="px-4 py-3">
                          <Badge variant={p.city === 'Abuja' ? 'blue' : 'secondary'} className="text-[10px]">{p.city}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">₦{Number(p.price_per_kg).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <TrendIcon trend={p.trend} change={Number(p.change_percent)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
