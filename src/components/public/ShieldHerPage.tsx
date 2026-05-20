import { useNavigate } from 'react-router-dom'
import { Heart, ShieldCheck, AlertTriangle, Users, Lock, Globe, CheckCircle2, ArrowRight, Eye, Zap, Radio, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const PROBLEMS = [
  'Gender-based violence and harassment',
  'Unsafe transportation and public environments',
  'Delayed emergency response',
  'Fear, stigma, and silence around abuse reporting',
  'Lack of discreet and trusted safety tools',
  'Difficulty preserving evidence securely',
  'Technology-facilitated abuse and exploitation',
  'Limited access to survivor-informed emergency systems',
]

const DIFFERENTIATORS = [
  {
    icon: Cpu,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'Prevention Intelligence & Early Threat Detection',
    desc: 'ShieldHer is designed to identify unsafe patterns and warning indicators before a victim falls into danger — transforming it from a reactive panic tool into a proactive safety support system.',
    points: [
      'Suspicious route deviation alerts',
      'Prolonged inactivity detection',
      'Missed safe-arrival triggers',
      'Emergency escalation timers',
      'Intelligent check-in workflows',
    ],
  },
  {
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    title: 'Survivor-Centered & Trauma-Informed Design',
    desc: 'Built intentionally around emotional safety, dignity, consent, discretion, and safeguarding — prioritizing discreet emergency activation, survivor-friendly communication, and minimizing retraumatization risks.',
    points: [
      'Discreet emergency activation',
      'Controlled evidence handling',
      'Safe reporting structures',
      'Survivor-friendly communication',
      'Consent-based sharing only',
    ],
  },
  {
    icon: Globe,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    title: 'African Context & Accessibility',
    desc: 'Unlike global safety apps, ShieldHer is optimized for African realities — unstable internet access, inconsistent emergency systems, and localized safety challenges.',
    points: [
      'Offline emergency fallback systems',
      'Low-data optimization',
      'SMS backup support',
      'Lightweight accessibility',
      'Regionally relevant workflows',
    ],
  },
  {
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Trusted Safety Ecosystem',
    desc: 'More than an SOS app — a complete safety ecosystem with trusted support circles, emergency coordination, journey monitoring, and survivor support resources.',
    points: [
      'Trusted support circles',
      'Emergency coordination',
      'Journey monitoring',
      'Institutional partnerships',
      'Future wearable integrations',
    ],
  },
]

const FEATURE_GROUPS = [
  {
    icon: Radio,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    title: 'Emergency Protection',
    features: [
      'One-tap SOS emergency activation',
      'Silent emergency alerts',
      'Real-time location sharing',
      'Journey monitoring & safe-arrival confirmation',
      'Emergency escalation workflows',
      'Trusted support network activation',
      'Offline emergency backup support',
    ],
  },
  {
    icon: Eye,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Prevention & Risk Awareness',
    features: [
      'Threat detection before escalation',
      'Journey anomaly monitoring',
      'Missed check-in detection',
      'Safe-route awareness systems',
      'Intelligent emergency timing workflows',
      'Future AI-assisted risk indicators',
    ],
  },
  {
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'Survivor Support',
    features: [
      'Secure incident reporting',
      'Ethical evidence preservation',
      'Access to emergency resources and helplines',
      'Community support pathways',
      'Safety education resources',
    ],
  },
]

const PRIVACY_PILLARS = [
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    desc: 'End-to-end encryption for sensitive records, consent-based sharing only, and user-controlled access permissions with minimal internal visibility.',
  },
  {
    icon: ShieldCheck,
    title: 'Restricted Backend Access',
    desc: 'Strict role-based access control ensures sensitive content is highly restricted, monitored, and never casually accessible to any internal team member.',
  },
  {
    icon: Globe,
    title: 'User-Controlled Cloud Backup',
    desc: 'Sensitive records sync primarily to the user\'s own secure cloud account — users maintain full ownership of their information.',
  },
  {
    icon: Eye,
    title: 'Ethical AI & Technology Use',
    desc: 'AI systems are approached cautiously with safeguarding and ethical oversight guiding every implementation decision.',
  },
]

const FUTURE_VISION = [
  "School safety systems",
  "Campus protection programs",
  "NGO & advocacy integrations",
  "Community safety partnerships",
  "Smart wearable emergency devices",
  "Transportation safety integrations",
  "Institutional safety infrastructure",
]

export function ShieldHerPage() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-500/10 to-transparent border-b border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 shadow-lg mx-auto mb-6">
            <img src="/ShieldHer.png" alt="ShieldHer" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
            <Heart className="w-3.5 h-3.5" />
            Women Safety Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="text-purple-700">Shield</span><span className="text-pink-500">Her</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            Building a Safer Future for Women Through Technology, Prevention Intelligence, Trust & Emergency Support.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm px-3 py-1">Available as APK</Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-sm px-3 py-1">Survivor-Centered</Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-3 py-1">African-Optimized</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-24">

        {/* The Problem */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Problem
            </div>
            <h2 className="text-3xl font-bold mb-3">The Safety Gap Women Face Every Day</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Girls and women continue to face daily safety challenges that existing tools fail to address — highlighting a major gap in accessible, trusted, survivor-centered safety infrastructure.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROBLEMS.map(p => (
              <div key={p} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              Many women already rely on survival behaviors — sharing live locations, pretending to be on calls, avoiding certain routes, staying hyper-alert in public, or remaining silent due to fear.
            </p>
          </div>
        </section>

        {/* What Makes ShieldHer Different */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              The Solution
            </div>
            <h2 className="text-3xl font-bold mb-3">What Makes ShieldHer Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlike traditional safety apps that only respond after danger occurs, ShieldHer is designed to identify and respond to risk patterns before situations escalate into harm.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map(d => (
              <div key={d.title} className={`p-6 rounded-2xl border ${d.border} ${d.bg}`}>
                <div className="w-11 h-11 rounded-xl bg-background/50 flex items-center justify-center mb-4">
                  <d.icon className={`w-5 h-5 ${d.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                <ul className="space-y-1.5">
                  {d.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${d.color} shrink-0`} />
                      <span className="text-muted-foreground">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Core Features */}
        <section className="bg-card border-y border-border -mx-4 sm:-mx-6 px-4 sm:px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Core Platform Features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Every feature is designed with safety, dignity, and accessibility at its core.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURE_GROUPS.map(g => (
                <Card key={g.title}>
                  <CardContent className="p-6">
                    <div className={`w-11 h-11 rounded-xl ${g.bg} flex items-center justify-center mb-4`}>
                      <g.icon className={`w-5 h-5 ${g.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-4">{g.title}</h3>
                    <ul className="space-y-2.5">
                      {g.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${g.color} shrink-0 mt-0.5`} />
                          <span className="text-muted-foreground leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy & Safeguarding */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
              <Lock className="w-3.5 h-3.5" />
              Privacy & Ethics
            </div>
            <h2 className="text-3xl font-bold mb-3">Data Privacy, Safeguarding & Ethical Design</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Because ShieldHer may involve vulnerable and trauma-sensitive situations, safeguarding is not an afterthought — it is a foundational design principle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRIVACY_PILLARS.map(p => (
              <div key={p.title} className="p-5 rounded-2xl bg-card border border-border flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Vision */}
        <section className="bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl border border-purple-500/20 p-10 sm:p-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-5">
                <Globe className="w-3.5 h-3.5" />
                Future Vision
              </div>
              <h2 className="text-3xl font-bold mb-4">Africa's Trusted Women Safety Infrastructure</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Long-term, ShieldHer aims to evolve into Africa's most trusted survivor-centered emergency support ecosystem — a prevention-focused safety intelligence platform connecting women, communities, and emergency support systems.
              </p>
              <Button variant="shield" size="lg" className="h-12 px-8" onClick={() => navigate('/contact')}>
                Partner With Us <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FUTURE_VISION.map(v => (
                <div key={v} className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-snug">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership */}
        <section className="text-center max-w-3xl mx-auto">
          <ShieldCheck className="w-14 h-14 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Building Together</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We believe women safety technology should not be built by technical teams alone. ShieldHer is actively seeking collaboration with organizations, advocates, and communities that understand the realities women and girls face every day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8" onClick={() => navigate('/contact')}>
              Get Involved <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8" onClick={() => navigate('/about')}>
              About ShieldNet
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
