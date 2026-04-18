import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Building2, Wheat, ArrowRight, CheckCircle2, Users, BarChart3, Star, Heart, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'

type ServiceItem = {
  to: string; color: string; bg: string; border: string; title: string; desc: string; cta: string; soon?: boolean
} & ({ logo: string; icon?: never } | { icon: LucideIcon; logo?: never })

const STATS = [
  { value: '2,400+', label: 'Verified Listings' },
  { value: '1,200+', label: 'Active Farmers' },
  { value: '98%',    label: 'Fraud Detection Rate' },
  { value: '₦120B+', label: 'Transactions Protected' },
]

const SERVICES: ServiceItem[] = [
  {
    to: '/ai-tools',
    logo: '/shieldnet-ai-logo.jpg',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'ShieldNet AI',
    desc: 'The core intelligence engine powering all Shield products — real-time safety & threat detection, fraud scoring, identity verification, and risk intelligence for individuals and enterprises.',
    cta: 'Explore ShieldNet AI',
  },
  {
    to: '/farms',
    icon: Wheat,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    title: 'ShieldFarm',
    desc: 'AI-powered app for smallholder farmers — on-device pest & disease detection, real-time market prices, weather forecasts, and farm diary. Works offline-first.',
    cta: 'Explore ShieldFarm',
  },
  {
    to: '/properties',
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'ShieldHome',
    desc: 'AI anti-fraud tool for property titles & listings. Every listing is scanned, scored, and Shield Verified before you buy, rent, or invest. Never get defrauded again.',
    cta: 'Explore ShieldHome',
  },
  {
    to: '#',
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    title: 'ShieldHer',
    desc: 'Personal protection app built for women — real-time threat alerts, emergency SOS, safe-route navigation, and community safety reporting. Safety in your pocket.',
    cta: 'Coming Soon',
    soon: true,
  },
]

const STEPS = [
  { n: '01', title: 'Create Your Account', desc: 'Sign up as a buyer, farmer, or agent in minutes. No paperwork required.' },
  { n: '02', title: 'Browse or List',       desc: 'Explore verified properties and farms, or list your own for the Shield Verified badge.' },
  { n: '03', title: 'AI Verification',      desc: 'Our AI scans documents and property data to detect fraud before you commit.' },
  { n: '04', title: 'Transact with Shield', desc: 'Close deals knowing every listing has been vetted by ShieldNet intelligence.' },
]

const TEAM = [
  {
    name: 'Raheem Victor',
    role: 'CEO & Co-Founder',
    img: '/raheem.jpg',
    bio: 'Visionary entrepreneur and technologist leading ShieldNet\'s mission to make every Nigerian transaction safe.',
  },
  {
    name: 'Joel Yahaya',
    role: 'Chief Commercial Executive Officer (CCEO)',
    img: '/joel.png',
    bio: 'Drives ShieldNet\'s commercial strategy, partnerships, and growth across Nigeria\'s real estate and agricultural sectors.',
  },
]

const TESTIMONIALS = [
  { name: 'Chidinma E.', role: 'Real Estate Agent, Lagos',   text: 'ShieldNet\'s verification saved my client from a ₦85M fraudulent land deal. Indispensable.',    stars: 5 },
  { name: 'Musa I.',     role: 'Farmer, Abuja',              text: 'The AI crop diagnosis caught armyworm early. I saved 60% of my maize crop this season.',           stars: 5 },
  { name: 'Tunde B.',    role: 'Property Investor, Lagos',   text: 'I\'ve purchased 3 properties through ShieldNet. Zero issues — every listing was exactly as described.', stars: 5 },
]

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nigeria's #1 AI-Powered Protection Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl mx-auto">
            One Platform.<br />
            <span className="text-green-400">Four Shields of Protection.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            ShieldNet Core Technologies (Abuja) is building a unified AI platform under the "Shield" brand — delivering real-time protection across property, agriculture, and personal safety.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/properties')}>
              Explore ShieldHome <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/auth')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform overview */}
      <section className="py-14 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-5">
            <Cpu className="w-3.5 h-3.5" />
            Unified AI Platform
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Our core engine — <span className="text-foreground font-semibold">ShieldNet AI</span> — powers four vertical products delivering real-time protection across multiple high-impact sectors in Nigeria and beyond.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Four Shields. One Platform.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Every product runs on ShieldNet AI — built for Nigerian buyers, farmers, women, and enterprises.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(s => (
            <Link
              key={s.title}
              to={s.soon ? '#' : s.to}
              onClick={s.soon ? e => e.preventDefault() : undefined}
              className={`group relative p-6 rounded-2xl border ${s.border} ${s.bg} ${s.soon ? 'cursor-default opacity-80' : 'hover:scale-[1.02] transition-transform'}`}
            >
              {s.soon && (
                <Badge className="absolute top-3 right-3 text-[10px] bg-rose-500/20 text-rose-300 border-rose-500/30">
                  Coming Soon
                </Badge>
              )}
              <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center mb-4 overflow-hidden">
                {'logo' in s && s.logo
                  ? <img src={s.logo} alt={s.title} className="w-full h-full object-cover rounded-xl" />
                  : 'icon' in s && s.icon && <s.icon className={`w-6 h-6 ${s.color}`} />
                }
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
              <span className={`text-sm font-medium ${s.color} flex items-center gap-1 ${!s.soon && 'group-hover:gap-2'} transition-all`}>
                {s.cta} {!s.soon && <ArrowRight className="w-4 h-4" />}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How ShieldNet Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From sign-up to protected transaction in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-green-400">{s.n}</span>
                </div>
                <h4 className="font-semibold">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Trusted by Thousands</h2>
          <p className="text-muted-foreground">Real stories from our users across Nigeria.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Meet Our Team</h2>
            <p className="text-muted-foreground">The people building Nigeria's most trusted protection platform.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map(m => (
              <div key={m.name} className="flex flex-col items-center text-center max-w-xs">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-green-500/20 mb-4">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-lg">{m.name}</h4>
                <p className="text-sm text-green-400 mb-2">{m.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features checklist */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Choose ShieldNet?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We combine cutting-edge AI with deep local expertise to deliver the most comprehensive protection platform in Nigeria.
            </p>
            <ul className="space-y-3">
              {[
                'AI-powered fraud detection on every listing',
                'Real-time crop disease diagnosis with 90%+ accuracy',
                'Shield Verified badge — the mark of trust',
                'Live market prices for 20+ crops',
                'Admin-reviewed approvals for all listings',
                'Bank-level data security and privacy',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: 'Verified Listings',   value: '2,400+', color: 'text-green-400', bg: 'bg-green-500/10'  },
              { icon: Users,       label: 'Active Users',        value: '18,000+', color: 'text-blue-400',  bg: 'bg-blue-500/10'   },
              { icon: Wheat,       label: 'Farms Monitored',     value: '1,200+', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: BarChart3,   label: 'AI Scans This Month', value: '4,700+', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map(s => (
              <div key={s.label} className={`p-5 rounded-2xl ${s.bg} border border-border`}>
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-green-500/5 to-transparent border-t border-green-500/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShieldCheck className="w-14 h-14 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transact with Confidence?</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Join thousands of Nigerians who use ShieldNet to buy, sell, farm, and invest — protected by AI at every step.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/auth')}>
              Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/contact')}>
              Talk to Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
