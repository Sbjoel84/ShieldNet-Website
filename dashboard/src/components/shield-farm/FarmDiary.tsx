import { useState } from 'react'
import { Plus, Sun, Cloud, Droplets, BookOpen } from 'lucide-react'
import { todayISO } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { SEED_DIARY, SEED_FARMS } from '@/data/seedData'
import { formatDate } from '@/lib/utils'
import type { FarmDiaryEntry } from '@/lib/types'

const ACTIVITIES = ['Planting', 'Weeding', 'Fertilizer Application', 'Irrigation', 'Pest Scouting', 'Harvesting', 'Soil Testing', 'Other']

function WeatherIcon({ weather }: { weather?: string }) {
  if (!weather) return null
  const lower = weather.toLowerCase()
  if (lower.includes('sunny') || lower.includes('hot')) return <Sun className="w-3.5 h-3.5 text-yellow-400" />
  if (lower.includes('rain') || lower.includes('drip')) return <Droplets className="w-3.5 h-3.5 text-blue-400" />
  return <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
}

const EMPTY_FORM = { farm_id: 'farm-001', activity: '', notes: '', weather: '' }

export function FarmDiary() {
  const [entries, setEntries] = useState<FarmDiaryEntry[]>(SEED_DIARY)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM, date: todayISO() })

  function addEntry() {
    const entry: FarmDiaryEntry = {
      id: `d-${Date.now()}`,
      ...form,
      created_at: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setOpen(false)
    setForm({ ...EMPTY_FORM, date: todayISO() })
  }

  const farmName = (id: string) => SEED_FARMS.find(f => f.id === id)?.name ?? id

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold">{entries.length} diary entries</h3>
        </div>
        <Button variant="shield" size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Entry
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map(entry => (
          <Card key={entry.id} className="hover:border-border/80 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold">{entry.activity}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{farmName(entry.farm_id)}</span>
                  </div>
                  <p className="text-sm text-foreground/80">{entry.notes}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">{formatDate(entry.date)}</p>
                  {entry.weather && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <WeatherIcon weather={entry.weather} />
                      <span className="text-[11px] text-muted-foreground">{entry.weather}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Diary Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Farm</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.farm_id}
                  onChange={e => setForm(f => ({ ...f, farm_id: e.target.value }))}
                >
                  {SEED_FARMS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Activity</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.activity}
                onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}
              >
                <option value="">Select activity…</option>
                {ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="What did you do today?" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Weather (optional)</Label>
              <Input placeholder="e.g. Sunny, 32°C" value={form.weather} onChange={e => setForm(f => ({ ...f, weather: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="shield" onClick={addEntry} disabled={!form.activity || !form.notes}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
