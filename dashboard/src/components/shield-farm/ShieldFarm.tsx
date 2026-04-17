import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wheat, BarChart3, BookOpen, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CropDiagnosis } from './CropDiagnosis'
import { MarketPrices } from './MarketPrices'
import { FarmDiary } from './FarmDiary'
import { SEED_FARMS } from '@/data/seedData'

export function ShieldFarm() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wheat className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold">ShieldFarm</h2>
          <Badge variant="verified" className="text-xs">Beta</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered farm management — crop diagnosis, market prices & diary for Nigerian farmers.
        </p>
      </div>

      {/* Farm overview pills */}
      <div className="flex flex-wrap gap-2">
        {SEED_FARMS.map(farm => (
          <div key={farm.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs">
            <MapPin className="w-3 h-3 text-green-400" />
            <span className="font-medium text-green-300">{farm.name}</span>
            <span className="text-green-500/60">·</span>
            <span className="text-green-400/70">{farm.crop_type}</span>
          </div>
        ))}
      </div>

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
          <CropDiagnosis />
        </TabsContent>
        <TabsContent value="prices">
          <MarketPrices />
        </TabsContent>
        <TabsContent value="diary">
          <FarmDiary />
        </TabsContent>
      </Tabs>
    </div>
  )
}
