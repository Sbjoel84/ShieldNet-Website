import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wheat, BarChart3, BookOpen, MapPin, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CropDiagnosis } from './CropDiagnosis'
import { MarketPrices } from './MarketPrices'
import { FarmDiary } from './FarmDiary'
import { apiFetch } from '@/hooks/useApi'
import type { Farm } from '@/lib/types'

export function ShieldFarm() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ farms: Farm[] }>('/api/farms')
      .then(d => setFarms(d.farms))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden ring-1 ring-green-500/30 animate-shield-pulse shrink-0">
            <img src="/ShieldFarm.png" alt="ShieldFarm" className="w-full h-full object-contain bg-white" />
            <span aria-hidden="true" className="logo-shine-overlay pointer-events-none absolute inset-0 animate-logo-shine" />
          </div>
          <h2 className="text-lg font-bold">ShieldFarm</h2>
          <Badge variant="verified" className="text-xs">Beta</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered farm management — crop diagnosis, market prices & diary for Nigerian farmers.
        </p>
      </div>

      {/* Farm overview pills */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />Loading farms…
        </div>
      ) : farms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {farms.map(farm => (
            <div key={farm.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs">
              <MapPin className="w-3 h-3 text-green-400" />
              <span className="font-medium text-green-300">{farm.name}</span>
              <span className="text-green-500/60">·</span>
              <span className="text-green-400/70">{farm.crop_type}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No farms registered yet.</p>
      )}

      {/* Tabs */}
      <Tabs defaultValue="diagnosis" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="diagnosis" className="text-xs">
            <Wheat className="w-3.5 h-3.5 mr-1.5" />Crop Diagnosis
          </TabsTrigger>
          <TabsTrigger value="prices" className="text-xs">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />Market Prices
          </TabsTrigger>
          <TabsTrigger value="diary" className="text-xs">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />Farm Diary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis">
          <CropDiagnosis farms={farms} />
        </TabsContent>
        <TabsContent value="prices">
          <MarketPrices />
        </TabsContent>
        <TabsContent value="diary">
          <FarmDiary farms={farms} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
