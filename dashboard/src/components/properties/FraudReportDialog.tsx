import { useState, useEffect } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  propertyId: string
  onClose: () => void
}

const REASONS = ['Fake listing', 'Wrong location', 'Price mismatch', 'Non-existent property', 'Agent impersonation', 'Other']

export function FraudReportDialog({ propertyId: _propertyId, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) return
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [done, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <ShieldCheck className="w-12 h-12 text-green-400" />
            <p className="font-semibold">Report Submitted</p>
            <p className="text-sm text-muted-foreground text-center">Our team will investigate within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold">Report Suspicious Listing</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Reason *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                >
                  <option value="">Select reason…</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Additional details</label>
                <Textarea placeholder="Provide any evidence or details…" rows={3} value={details} onChange={e => setDetails(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => setDone(true)} disabled={!reason}>Submit Report</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
