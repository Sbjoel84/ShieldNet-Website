import { useState, useRef, useEffect } from 'react'
import { Upload, Leaf, CheckCircle2, Clock, Loader2, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiFetch } from '@/hooks/useApi'
import { formatDate } from '@/lib/utils'
import type { CropDiagnosis as Diag, Farm } from '@/lib/types'

const MOCK_RESULT = {
  crop_type: 'Unknown crop',
  diagnosis: 'Powdery Mildew (Erysiphales)',
  confidence: 83,
  severity: 'medium' as const,
  recommendation: 'Apply sulfur-based fungicide at 2 kg/ha. Ensure adequate plant spacing and avoid overhead irrigation. Monitor weekly.',
}

function SeverityBadge({ severity }: { severity: Diag['severity'] }) {
  const map = { low: 'verified', medium: 'pending', high: 'rejected' } as const
  return <Badge variant={map[severity]}>{severity.toUpperCase()}</Badge>
}

interface Props { farms: Farm[] }

export function CropDiagnosis({ farms }: Props) {
  const [dragging, setDragging]     = useState(false)
  const [preview, setPreview]       = useState<string | null>(null)
  const [analyzing, setAnalyzing]   = useState(false)
  const [result, setResult]         = useState<typeof MOCK_RESULT | null>(null)
  const [history, setHistory]       = useState<Diag[]>([])
  const [histLoading, setHistLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiFetch<{ diagnoses: Diag[] }>('/api/diagnoses')
      .then(d => setHistory(d.diagnoses))
      .catch(() => {})
      .finally(() => setHistLoading(false))
  }, [])

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setResult(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  async function runAnalysis() {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2500))
    setResult(MOCK_RESULT)
    setAnalyzing(false)

    try {
      const farmId = farms[0]?.id ?? null
      const saved = await apiFetch<{ diagnosis: Diag }>('/api/diagnoses', {
        method: 'POST',
        body: JSON.stringify({ ...MOCK_RESULT, farm_id: farmId, image_url: preview }),
      })
      setHistory(prev => [saved.diagnosis, ...prev])
    } catch {
      // don't block UI if save fails
    }
  }

  function reset() { setPreview(null); setResult(null) }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="w-4 h-4 text-green-400" />
            AI Crop Disease Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!preview ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                dragging ? 'border-green-500 bg-green-500/5' : 'border-border hover:border-green-500/50 hover:bg-accent'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Drop crop photo here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB · Clear, well-lit photos give best results</p>
              </div>
              <input ref={inputRef} type="file" accept="image/*" aria-label="Upload crop photo" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Crop" className="w-full max-h-64 object-cover" />
                <button type="button" onClick={reset} className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/80">
                  Remove
                </button>
              </div>
              {!result && (
                <Button variant="shield" className="w-full" onClick={runAnalysis} disabled={analyzing}>
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing with ShieldNet AI…</>
                  ) : (
                    <><Leaf className="w-4 h-4 mr-2" />Run Diagnosis</>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* AI Result */}
          {result && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-4 animate-fade-in">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground">Diagnosis</p>
                  <p className="text-lg font-bold mt-0.5">{result.diagnosis}</p>
                  <p className="text-xs text-muted-foreground">{result.crop_type}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={result.severity} />
                  <Badge variant="blue">{result.confidence}% confidence</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-foreground/90">{result.recommendation}</p>
              </div>
              <p className="text-[11px] text-muted-foreground/60">
                ⚠️ AI diagnosis is indicative only. Always confirm with a certified agronomist.
              </p>
              <Button variant="outline" size="sm" onClick={reset}>Diagnose another crop</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past Diagnoses</h3>
        {histLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No diagnoses yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map(d => (
              <Card key={d.id} className="hover:border-border/80 transition-colors">
                <CardContent className="p-4 flex gap-4">
                  {d.image_url ? (
                    <img src={d.image_url} alt={d.crop_type} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-medium">{d.diagnosis}</p>
                      <div className="flex gap-1">
                        <SeverityBadge severity={d.severity} />
                        {d.status === 'reviewed'
                          ? <Badge variant="verified" className="text-[10px]"><CheckCircle2 className="w-3 h-3 mr-0.5" />Reviewed</Badge>
                          : <Badge variant="pending" className="text-[10px]"><Clock className="w-3 h-3 mr-0.5" />Pending</Badge>
                        }
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.crop_type} · {d.confidence}% confidence</p>
                    <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{d.recommendation}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{formatDate(d.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
