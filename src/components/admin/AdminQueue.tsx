import { useState, useEffect } from 'react'
import { ShieldCheck, AlertTriangle, Building2, Leaf, Check, X, Clock, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, KeyRound, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/hooks/useApi'
import { formatDate, formatNaira } from '@/lib/utils'
import type { AdminQueueItem, Application, ApplicationStatus } from '@/lib/types'

const API       = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'shieldnet_token'

interface UserRow {
  id: string; email: string; full_name: string; phone?: string; role: string; city?: string; created_at: string
}

function PasswordResetPanel() {
  const [users, setUsers]         = useState<UserRow[]>([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [resetting, setResetting] = useState<string | null>(null)
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const [feedback, setFeedback]   = useState<Record<string, { ok: boolean; msg: string }>>({})

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function resetPassword(userId: string) {
    const pw = passwords[userId]?.trim()
    if (!pw || pw.length < 6) {
      setFeedback(f => ({ ...f, [userId]: { ok: false, msg: 'Password must be at least 6 characters.' } }))
      return
    }
    setResetting(userId)
    const token = localStorage.getItem(TOKEN_KEY)
    try {
      const res  = await fetch(`${API}/api/admin/users/${userId}/password`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ new_password: pw }),
      })
      const data = await res.json()
      setFeedback(f => ({ ...f, [userId]: res.ok
        ? { ok: true,  msg: `Password reset for ${data.user?.email}.` }
        : { ok: false, msg: data.error ?? 'Failed.' }
      }))
      if (res.ok) setPasswords(p => ({ ...p, [userId]: '' }))
    } catch {
      setFeedback(f => ({ ...f, [userId]: { ok: false, msg: 'Could not connect to server.' } }))
    } finally {
      setResetting(null)
    }
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
  )

  return (
    <div className="space-y-4 mt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or email…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No users found.</p>
      )}
      <div className="space-y-3">
        {filtered.map(u => (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={u.role === 'admin' ? 'verified' : 'outline'} className="text-[10px] capitalize">{u.role}</Badge>
                    {u.city && <span className="text-[10px] text-muted-foreground">{u.city}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  <Input
                    type="password"
                    placeholder="New password"
                    className="h-8 text-xs w-40"
                    value={passwords[u.id] ?? ''}
                    onChange={e => setPasswords(p => ({ ...p, [u.id]: e.target.value }))}
                  />
                  <Button variant="shield" size="sm" className="h-8 text-xs shrink-0" onClick={() => resetPassword(u.id)} disabled={resetting === u.id}>
                    {resetting === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                    <span className="ml-1">Reset</span>
                  </Button>
                </div>
              </div>
              {feedback[u.id] && (
                <p className={`text-xs mt-2 ${feedback[u.id].ok ? 'text-green-400' : 'text-destructive'}`}>
                  {feedback[u.id].msg}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

type QueueStatus = AdminQueueItem['status']

const TYPE_MAP: Record<AdminQueueItem['type'], { label: string; icon: React.ReactNode }> = {
  property_approval: { label: 'Property Approval', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
  ai_scan_review:    { label: 'AI Scan Review',    icon: <Leaf className="w-4 h-4 text-green-400" /> },
  fraud_report:      { label: 'Fraud Report',      icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
}

const APP_TYPE_MAP: Record<Application['type'], { label: string; color: string }> = {
  property_inquiry:  { label: 'Property Inquiry',  color: 'text-blue-400'   },
  farm_consultation: { label: 'Farm Consultation', color: 'text-green-400'  },
  general_contact:   { label: 'General Contact',   color: 'text-purple-400' },
}

const APP_STATUS_FLOW: ApplicationStatus[] = ['new', 'contacted', 'processing', 'completed']

const APP_STATUS_VARIANT: Record<ApplicationStatus, string> = {
  new:        'pending',
  contacted:  'blue',
  processing: 'pending',
  completed:  'verified',
  rejected:   'rejected',
}

const PRIORITY_VARIANT = { high: 'rejected', medium: 'pending', low: 'verified' } as const

const STAT_DEFS = [
  { label: 'Pending Review', status: 'pending',  color: 'text-yellow-400' },
  { label: 'Approved',       status: 'approved', color: 'text-green-400'  },
  { label: 'Rejected',       status: 'rejected', color: 'text-red-400'    },
] as const

function PriorityBadge({ p }: { p: AdminQueueItem['priority'] }) {
  return <Badge variant={PRIORITY_VARIANT[p]} className="text-[10px] capitalize">{p}</Badge>
}

interface QueueCardProps {
  item: AdminQueueItem
  onUpdate: (id: string, status: QueueStatus) => void
}

function QueueCard({ item, onUpdate }: QueueCardProps) {
  const { label, icon } = TYPE_MAP[item.type]

  return (
    <Card className="hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <PriorityBadge p={item.priority} />
                {item.status !== 'pending' && (
                  <Badge variant={item.status === 'approved' ? 'verified' : 'rejected'} className="text-[10px] capitalize">
                    {item.status === 'approved' ? <Check className="w-3 h-3 mr-0.5" /> : <X className="w-3 h-3 mr-0.5" />}
                    {item.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">Submitted by: {item.submitted_by}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />{formatDate(item.created_at)}
              </p>
            </div>
          </div>

          {item.status === 'pending' && (
            <div className="flex gap-2 items-center ml-auto shrink-0">
              <Button
                variant="outline" size="sm"
                className="h-8 text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                onClick={() => onUpdate(item.id, 'rejected')}
              >
                <X className="w-3.5 h-3.5 mr-1" />Reject
              </Button>
              <Button variant="shield" size="sm" className="h-8 text-xs" onClick={() => onUpdate(item.id, 'approved')}>
                <Check className="w-3.5 h-3.5 mr-1" />Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ApplicationCardProps {
  app: Application
  onUpdate: (id: string, status: ApplicationStatus, notes?: string) => void
}

function ApplicationCard({ app, onUpdate }: ApplicationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes]       = useState(app.admin_notes ?? '')
  const { label, color }        = APP_TYPE_MAP[app.type]

  const nextStatus = APP_STATUS_FLOW[APP_STATUS_FLOW.indexOf(app.status as ApplicationStatus) + 1] as ApplicationStatus | undefined

  return (
    <Card className="hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className={`text-xs font-medium ${color}`}>{label}</p>
              <Badge variant={APP_STATUS_VARIANT[app.status] as Parameters<typeof Badge>[0]['variant']} className="text-[10px] capitalize">{app.status}</Badge>
              <Badge variant={PRIORITY_VARIANT[app.priority]} className="text-[10px] capitalize">{app.priority}</Badge>
            </div>
            <p className="text-sm font-semibold">{app.full_name}</p>
            {app.property_title && <p className="text-xs text-muted-foreground">Re: {app.property_title}</p>}
            {app.subject         && <p className="text-xs text-muted-foreground">Subject: {app.subject}</p>}
            {app.crop_type       && <p className="text-xs text-muted-foreground">Crop: {app.crop_type}{app.farm_size_ha ? ` · ${app.farm_size_ha} ha` : ''}</p>}
            <p className="text-[11px] text-muted-foreground/60 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />{formatDate(app.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href={`mailto:${app.email}`} title={app.email}>
              <Button variant="outline" size="icon" className="h-8 w-8"><Mail className="w-3.5 h-3.5" /></Button>
            </a>
            <a href={`tel:${app.phone}`} title={app.phone}>
              <Button variant="outline" size="icon" className="h-8 w-8"><Phone className="w-3.5 h-3.5" /></Button>
            </a>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(v => !v)}>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="p-3 rounded-lg bg-muted/40 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="text-sm leading-relaxed">{app.message}</p>
            </div>
            {app.challenge && (
              <div className="p-3 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground mb-1">Challenge</p>
                <p className="text-sm">{app.challenge}</p>
              </div>
            )}
            {app.interest_type && (
              <div className="flex gap-4 text-sm">
                <div><span className="text-xs text-muted-foreground">Interest: </span><span className="capitalize">{app.interest_type}</span></div>
                {app.budget && <div><span className="text-xs text-muted-foreground">Budget: </span><span className="text-green-400">{formatNaira(app.budget)}</span></div>}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />Admin Notes
              </label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[64px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Add internal notes…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {app.status !== 'rejected' && app.status !== 'completed' && nextStatus && (
                <Button variant="shield" size="sm" className="text-xs h-8" onClick={() => onUpdate(app.id, nextStatus, notes)}>
                  <Check className="w-3.5 h-3.5 mr-1" />Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </Button>
              )}
              {app.status !== 'rejected' && app.status !== 'completed' && (
                <Button variant="outline" size="sm" className="text-xs h-8 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => onUpdate(app.id, 'rejected', notes)}>
                  <X className="w-3.5 h-3.5 mr-1" />Reject
                </Button>
              )}
              {notes !== (app.admin_notes ?? '') && (
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onUpdate(app.id, app.status as ApplicationStatus, notes)}>
                  Save Notes
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminQueue() {
  const [items, setItems]               = useState<AdminQueueItem[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<{ items: AdminQueueItem[] }>('/api/admin/queue'),
      apiFetch<{ applications: Application[] }>('/api/applications'),
    ])
      .then(([q, a]) => { setItems(q.items); setApplications(a.applications) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: QueueStatus) {
    try {
      const data = await apiFetch<{ item: AdminQueueItem }>(`/api/admin/queue/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setItems(prev => prev.map(item => item.id === id ? data.item : item))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update.')
    }
  }

  async function updateApplication(id: string, status: ApplicationStatus, notes?: string) {
    try {
      const data = await apiFetch<{ application: Application }>(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, admin_notes: notes }),
      })
      setApplications(prev => prev.map(a => a.id === id ? data.application : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update.')
    }
  }

  const pending  = items.filter(i => i.status === 'pending')
  const resolved = items.filter(i => i.status !== 'pending')
  const newApps  = applications.filter(a => a.status === 'new' || a.status === 'contacted' || a.status === 'processing')
  const doneApps = applications.filter(a => a.status === 'completed' || a.status === 'rejected')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          Admin Queue
        </h2>
        <p className="text-sm text-muted-foreground">Review listings, AI scans, fraud reports, and customer applications.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {STAT_DEFS.map(s => (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{items.filter(i => i.status === s.status).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending" className="text-xs">
                Queue
                {pending.length > 0 && <Badge variant="pending" className="ml-2 text-[10px] px-1.5">{pending.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">Resolved ({resolved.length})</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs">
                Applications
                {newApps.length > 0 && <Badge variant="pending" className="ml-2 text-[10px] px-1.5">{newApps.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="done-apps" className="text-xs">Done ({doneApps.length})</TabsTrigger>
              <TabsTrigger value="reset-password" className="text-xs">
                <KeyRound className="w-3 h-3 mr-1" />Reset Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Check className="w-10 h-10 text-green-400/40" />
                  <p className="text-muted-foreground text-sm">Queue is clear — all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {pending.map(item => <QueueCard key={item.id} item={item} onUpdate={updateStatus} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resolved">
              <div className="space-y-3 mt-4">
                {resolved.length === 0
                  ? <p className="text-sm text-muted-foreground py-6 text-center">No resolved items yet.</p>
                  : resolved.map(item => <QueueCard key={item.id} item={item} onUpdate={updateStatus} />)
                }
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <div className="space-y-3 mt-4">
                {newApps.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <Check className="w-10 h-10 text-green-400/40" />
                    <p className="text-muted-foreground text-sm">No active applications.</p>
                  </div>
                ) : (
                  newApps.map(app => <ApplicationCard key={app.id} app={app} onUpdate={updateApplication} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="done-apps">
              <div className="space-y-3 mt-4">
                {doneApps.length === 0
                  ? <p className="text-sm text-muted-foreground py-6 text-center">No completed applications yet.</p>
                  : doneApps.map(app => <ApplicationCard key={app.id} app={app} onUpdate={updateApplication} />)
                }
              </div>
            </TabsContent>

            <TabsContent value="reset-password">
              <PasswordResetPanel />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
