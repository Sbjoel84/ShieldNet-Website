import { useNavigate } from 'react-router-dom'
import { Bot, Leaf, ShieldCheck, BarChart3, AlertTriangle, ArrowRight, Zap, Cpu, Radio, Battery, Users, CheckCircle2, Crown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TOOLS = [
  {
    icon: ShieldCheck,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'Real-Time Threat Intelligence',
    desc: 'Continuously monitors activity patterns across the ShieldNet network to detect emerging threats, suspicious behaviour, and coordinated fraud attempts before they cause harm.',
    features: ['Live activity monitoring', 'Anomaly detection', 'Pattern recognition', 'Instant admin alerts'],
    badge: '98% Detection Rate',
  },
  {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    title: 'Fraud Detection Engine',
    desc: 'Our AI cross-references listings, documents, satellite imagery, and market data to flag fraudulent properties and bad actors before you commit to any transaction.',
    features: ['Document verification', 'Satellite cross-checking', 'Agent trust scoring', 'Multi-source validation'],
    badge: 'Fraud Rate: <2%',
  },
  {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Identity Verification',
    desc: 'BVN-linked identity checks, NIN verification, and liveness detection ensure every agent, buyer, and farmer on ShieldNet is who they claim to be.',
    features: ['BVN / NIN checks', 'Liveness detection', 'Document OCR', 'Instant verification'],
    badge: 'KYC Compliant',
  },
  {
    icon: BarChart3,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    title: 'Shield Score Engine',
    desc: 'Every user earns a Shield Score (0–100) based on transaction history, verification status, peer reviews, and community trust — the mark of a trustworthy participant.',
    features: ['Dynamic scoring', 'Behaviour-based updates', 'Green/Yellow/Red tiers', 'Public trust badge'],
    badge: '18,000+ Scored',
  },
  {
    icon: Leaf,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    title: 'AI Crop Diagnosis',
    desc: 'Computer vision model identifies crop diseases, pests, and nutrient deficiencies from a single photo — with 90%+ accuracy and instant treatment recommendations.',
    features: ['Real-time image analysis', '50+ crop types', 'Severity rating', 'Treatment protocols'],
    badge: 'Accuracy: 90%+',
  },
  {
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: 'AI Property Valuation',
    desc: 'Get an AI-generated market value estimate for any Abuja or Lagos property in seconds — powered by location data, comparables, and demand signals.',
    features: ['Sub-second valuations', 'Location heat maps', 'Comparable analysis', 'Confidence intervals'],
    badge: 'Coming Soon',
  },
]

const ROADMAP_IMPROVEMENTS = [
  {
    label: 'A',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    category: 'AI & Detection Enhancements',
    icon: Cpu,
    items: [
      { title: 'Advanced AI Sound Detection', desc: 'Improve accuracy for local African environments (okada horns, market noise) and significantly reduce false positives.' },
      { title: 'Disaster Prediction Engine', desc: 'Integrate weather and traffic APIs to predict and warn users about floods, accidents, or congestion in high-risk areas.' },
      { title: 'AI Threat Prediction (Premium)', desc: 'Personalized safety warnings based on user location patterns and historical incident data.' },
    ],
  },
  {
    label: 'B',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    category: 'Emergency Response Features',
    icon: Radio,
    items: [
      { title: 'Live Video Streaming', desc: 'Optional real-time video streaming during SOS alerts to give responders visual context.' },
      { title: 'Government API Integration', desc: 'Direct alert routing to verified responders through partnerships with NPF, NEMA, and related agencies.' },
      { title: 'Global Emergency Routing', desc: 'Automatic switching of emergency numbers for users traveling outside Africa.' },
    ],
  },
  {
    label: 'C',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    category: 'Community & User Experience',
    icon: Users,
    items: [
      { title: 'Community Alert Maps', desc: 'Anonymous heat maps showing recent incidents to help users avoid danger zones.' },
      { title: 'Multi-Language Support', desc: 'Voice commands and alerts in Yoruba, Igbo, Hausa, Swahili, and other regional languages.' },
      { title: 'Child Mode', desc: 'Simplified interface for children with automatic parent/guardian alerts.' },
    ],
  },
  {
    label: 'D',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    category: 'Performance & Hardware Integration',
    icon: Battery,
    items: [
      { title: 'Battery Optimization 2.0', desc: 'Reduce background battery usage to under 2% per hour.' },
      { title: 'Wearables Integration', desc: 'Connect to smartwatches and fitness trackers for heart-rate-based panic detection.' },
    ],
  },
]

const ECOSYSTEM_PHASES = [
  {
    phase: 'Phase 1',
    label: 'Flagship',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    timeline: 'Launched',
    products: [
      { name: 'ShieldNet AI', desc: 'Core personal safety app featuring SOS alerts, AI auto-detection, and offline emergency support.', status: 'Live' },
    ],
  },
  {
    phase: 'Phase 2',
    label: 'Quick Wins',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    timeline: 'Q1 2026',
    products: [
      { name: 'ShieldHer', desc: 'Disguised safety app for women and girls — fake calculator interface, voice-activated SOS, safe-space maps.', status: 'In Progress' },
      { name: 'ShieldRide', desc: 'Safety solution for okada riders and ride-hailing drivers — trip sharing, crash detection, verified drivers.', status: 'Planned' },
    ],
  },
  {
    phase: 'Phase 3',
    label: 'Institutions & Communities',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    timeline: 'Q2 2026',
    products: [
      { name: 'ShieldCampus', desc: 'University and school security platform with silent alarms, anonymous reporting, and mass alerts.', status: 'Planned' },
      { name: 'ShieldWatch', desc: 'Neighborhood safety platform with digital patrols, incident reporting, and crime heat maps.', status: 'Planned' },
    ],
  },
  {
    phase: 'Phase 4',
    label: 'Emergency Services',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    timeline: 'Q3 2026',
    products: [
      { name: 'ShieldRespond', desc: 'Professional dashboard for first responders featuring AI triage, live alerts, and resource mapping.', status: 'Planned' },
    ],
  },
]

const PREMIUM_EXISTING = [
  'Unlimited Trusted Contacts (beyond 5)',
  'Custom Branding for Enterprises',
  'Admin dashboards for schools, companies, and organizations',
  'Priority Responder Integration — direct access to verified police units or private security firms',
  'Incident Analytics & Reports — post-incident insights and safety trends for organizations',
  'Ad-Free Experience',
]

const PREMIUM_NEW = [
  { title: 'Extended Audio & Video Storage', desc: '7-day storage (free tier: 24 hours)' },
  { title: 'Family Group Plans', desc: 'One subscription shared across up to 5 family members' },
  { title: 'Offline Maps Download', desc: 'Pre-loaded high-risk zones for zero-data navigation' },
  { title: 'VIP Support', desc: '24/7 live chat assistance and faster feature rollouts' },
  { title: 'Smart Home Integration', desc: 'Connect home cameras for automatic alerts when users are away' },
]

export function PublicAITools() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-red-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-red-500/30 shadow-lg mx-auto mb-6">
            <img src="/shieldnet-ai-logo.jpg" alt="ShieldNet AI" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
            <Bot className="w-3.5 h-3.5" />
            AI-Powered Security Platform
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-white">Shield</span><span className="text-red-500">Net</span> <span className="text-white">AI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Nigeria's most advanced AI security platform — delivering real-time threat intelligence, fraud detection, identity verification, and risk scoring for individuals and enterprises.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8" disabled>
              Not Available Yet
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8" onClick={() => navigate('/contact')}>
              Request Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map(t => (
            <Card key={t.title} className={`border ${t.border} hover:scale-[1.01] transition-transform`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center`}>
                    <t.icon className={`w-6 h-6 ${t.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{t.badge}</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                <ul className="space-y-1.5">
                  {t.features.map(f => (
                    <li key={f} className={`text-xs flex items-center gap-2 ${t.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full bg-current shrink-0`} />
                      <span className="text-foreground/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-card border border-border p-10 text-center">
          <Bot className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Start Using ShieldNet AI Today</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            All AI tools are available free with your ShieldNet account. No API keys, no setup — just sign up and go.
          </p>
          <Button variant="shield" size="lg" disabled>
            Registration Not Available Yet
          </Button>
        </div>
      </div>

      {/* ── ROADMAP ─────────────────────────────────────────────────────── */}

      {/* Future Improvements */}
      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              Product Roadmap — v1.1 and Beyond
            </div>
            <h2 className="text-3xl font-bold mb-3">Future Improvements for ShieldNet AI</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Planned post-launch enhancements aimed at improving accuracy, usability, and scalability.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {ROADMAP_IMPROVEMENTS.map(group => (
              <div key={group.label} className={`p-6 rounded-2xl border ${group.border} ${group.bg}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">
                    <group.icon className={`w-5 h-5 ${group.color}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${group.color} uppercase tracking-widest`}>{group.label}</span>
                    <h3 className="font-semibold text-sm">{group.category}</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {group.items.map(item => (
                    <div key={item.title}>
                      <p className="text-sm font-medium mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ecosystem Rollout */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <Globe className="w-3.5 h-3.5" />
              ShieldNet Ecosystem
            </div>
            <h2 className="text-3xl font-bold mb-3">Product Rollout Plan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All products share a unified AI backend to improve learning, prediction accuracy, and response efficiency.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ECOSYSTEM_PHASES.map(phase => (
              <div key={phase.phase} className={`p-5 rounded-2xl border ${phase.border} ${phase.bg} flex flex-col gap-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${phase.color} mb-0.5`}>{phase.phase}</p>
                    <p className="text-sm font-semibold">{phase.label}</p>
                  </div>
                  <Badge className={`text-[10px] ${phase.badgeColor} shrink-0`}>{phase.timeline}</Badge>
                </div>
                <div className="space-y-3">
                  {phase.products.map(p => (
                    <div key={p.name} className="border-t border-border/40 pt-3 first:border-0 first:pt-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <span className={`text-[10px] font-medium ${p.status === 'Live' ? 'text-green-400' : p.status === 'In Progress' ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium mb-4">
              <Crown className="w-3.5 h-3.5" />
              Monetization Model
            </div>
            <h2 className="text-3xl font-bold mb-3">Premium Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Core safety features remain <span className="text-green-400 font-medium">free forever</span>. Premium unlocks advanced capabilities at ₦1,000–₦2,000/month or enterprise licensing.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Existing */}
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="font-semibold">Existing Premium Features</h3>
              </div>
              <ul className="space-y-3">
                {PREMIUM_EXISTING.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* New Additions */}
            <div className="p-6 rounded-2xl bg-background border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold">New Premium Additions</h3>
                  <p className="text-xs text-muted-foreground">Coming with v1.1</p>
                </div>
              </div>
              <div className="space-y-4">
                {PREMIUM_NEW.map(f => (
                  <div key={f.title} className="flex items-start gap-2.5">
                    <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
