import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { apiFetch } from '@/hooks/useApi'

const SUBJECTS = [
  'Property Inquiry', 'Farm Consultation', 'Partnership Proposal', 'Bulk Listing Arrangement',
  'Technical Support', 'Media / Press', 'Career Opportunities', 'Other',
]

const CONTACT_INFO = [
  { icon: MapPin, label: 'Offices', value: 'Abuja (HQ) & Lagos, Nigeria' },
  { icon: Mail,   label: 'Email',   value: 'info@shieldnet.ng',  href: 'mailto:info@shieldnet.ng' },
  { icon: Phone,  label: 'Phone',   value: '+234 800 000 0000',  href: 'tel:+2348000000000' },
  { icon: Clock,  label: 'Hours',   value: 'Mon–Fri, 8am–6pm WAT' },
]

const EMPTY = { full_name: '', email: '', phone: '', subject: '', message: '' }

export function ContactPage() {
  const [form, setForm]       = useState(EMPTY)
  const [done, setDone]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function submit() {
    setSending(true)
    setError(null)
    try {
      await apiFetch('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ ...form, type: 'general_contact' }),
      })
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-lg mx-auto mb-6">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-full h-full object-contain bg-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Have a question, partnership idea, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-6">Get in Touch</h2>
            {CONTACT_INFO.map(c => (
              <Card key={c.label}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium hover:text-green-400 transition-colors">{c.value}</a>
                    ) : (
                      <p className="text-sm font-medium">{c.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <ShieldCheck className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-sm font-medium mb-1">Admin Agents Available</p>
              <p className="text-xs text-muted-foreground">All contact submissions are reviewed by our team within 24 hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {done ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <ShieldCheck className="w-16 h-16 text-green-400" />
                <h2 className="text-2xl font-bold">Message Sent!</h2>
                <p className="text-muted-foreground max-w-sm">Thanks for reaching out. Our team will respond within 24 hours.</p>
                <Button variant="shield" onClick={() => { setDone(false); setForm(EMPTY) }}>
                  Send Another
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-lg font-semibold mb-6">Send a Message</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input placeholder="John Doe" value={form.full_name} onChange={f('full_name')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email *</label>
                        <Input placeholder="you@example.com" type="email" value={form.email} onChange={f('email')} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Phone</label>
                        <Input placeholder="+234 800 000 0000" value={form.phone} onChange={f('phone')} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Subject</label>
                        <select
                          aria-label="Select subject"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          value={form.subject}
                          onChange={f('subject')}
                        >
                          <option value="">Select a subject…</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Message *</label>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={f('message')}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button
                      variant="shield"
                      className="w-full h-11"
                      onClick={submit}
                      disabled={!form.full_name || !form.email || !form.message || sending}
                    >
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending…</> : 'Send Message'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
