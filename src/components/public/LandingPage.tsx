import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck, Wheat, ArrowRight, CheckCircle2, Users, BarChart3, Star, Cpu,
  Globe2, Database, Code2, Palette, Bot, Search, Rocket, Layers,
} from 'lucide-react'
import { ShieldLogo } from '@/components/ui/ShieldLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'

type ShieldProduct = {
  to: string; color: string; bg: string; border: string; title: string; desc: string; cta: string; soon?: boolean
} & ({ logo: string; icon?: never } | { icon: LucideIcon; logo?: never })

const STATS = [
  { value: '2,400+', label: 'Verified Listings' },
  { value: '1,200+', label: 'Active Farmers' },
  { value: '98%',    label: 'Fraud Detection Rate' },
  { value: '₦120B+', label: 'Transactions Protected' },
]

const SHIELD_PRODUCTS: ShieldProduct[] = [
  {
    to: '/ai-tools',
    logo: '/shieldnet-ai-logo.jpg',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    title: 'ShieldNet AI',
    desc: 'Core intelligence system powering all Shield products — real-time safety & threat detection, fraud scoring, identity verification, and risk intelligence.',
    cta: 'Explore ShieldNet AI',
  },
  {
    to: '/shieldher',
    logo: '/ShieldHer.png',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: 'ShieldHer',
    desc: "Women's safety app with SOS, real-time threat alerts, safe-route navigation, and community safety reporting.",
    cta: 'Explore ShieldHer',
  },
  {
    to: '/farms',
    logo: '/ShieldFarm.png',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    title: 'ShieldFarm',
    desc: 'AI farming assistant for pest & disease detection, real-time market prices, weather forecasts, and farm diary. Offline-first.',
    cta: 'Explore ShieldFarm',
  },
  {
    to: '/properties',
    logo: '/ShieldHome.png',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'ShieldHome',
    desc: 'Real estate fraud detection and verification system — every listing scanned, scored, and Shield Verified before you buy or invest.',
    cta: 'Explore ShieldHome',
  },
]

const CLIENT_SERVICES = [
  { icon: Code2,    color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Software Development', desc: 'Custom platforms tailored to your business needs — from MVPs to enterprise systems.' },
  { icon: Globe2,   color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   title: 'Web Development',       desc: 'Modern, fast, scalable websites and dashboards built to perform.' },
  { icon: Database, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  title: 'Database Systems',      desc: 'Secure and structured data infrastructure for enterprises.' },
  { icon: Bot,      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'AI Integration',        desc: 'We embed AI into your business workflows and operations.' },
  { icon: Palette,  color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   title: 'Branding & Design',     desc: 'Professional UI/UX, logos, and digital identity systems.' },
]

const HOW_WE_WORK = [
  { n: '01', icon: Search,  title: 'Discovery',        desc: 'We understand your business, goals, and the problem you need to solve.' },
  { n: '02', icon: Palette, title: 'Design',           desc: 'We create system architecture, UI layouts, and user flow.' },
  { n: '03', icon: Code2,   title: 'Build',            desc: 'We develop your software, AI systems, or digital platforms.' },
  { n: '04', icon: Rocket,  title: 'Deploy & Support', desc: 'We launch and maintain your solution — from go-live to scale.' },
]

const TESTIMONIALS = [
  { name: 'Corporate Client',    role: 'Lagos, Nigeria',  text: 'ShieldNet built our internal system and improved operational efficiency by over 60%.', stars: 5 },
  { name: 'Real Estate Partner', role: 'Abuja, Nigeria',  text: 'Their fraud detection system saved us from a major property scam. Absolutely indispensable.', stars: 5 },
  { name: 'SME Business Owner',  role: 'Nigeria',         text: 'We use their software infrastructure for daily operations. Reliable, fast, and always supported.', stars: 5 },
]

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-start">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 text-center w-full">
          <div className="flex justify-center mb-6">
            <ShieldLogo sizeClass="w-64 h-64" wrapperClassName="rounded-3xl shadow-2xl shadow-black/50 ring-2 ring-green-500/40" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nigeria's AI-Powered Technology & Software Solutions Company
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 max-w-4xl mx-auto">
            We Build. We Protect.<br />
            <span className="text-green-400">We Power Growth.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-3 leading-relaxed">
            ShieldNet Core Technologies (Abuja) is a full-service technology company delivering custom software solutions, AI systems, and digital platforms for businesses, individuals, and high-impact sectors.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            We also build proprietary AI products under the Shield brand — designed to protect people and assets across Nigeria.
          </p>

          {/* What We Build bullet list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-w-2xl mx-auto mb-10 text-left">
            {[
              'Modern websites & web platforms',
              'Custom software & enterprise systems',
              'Secure database architectures',
              'AI-powered applications',
              'Digital branding & product design',
              'Sector-specific protection systems',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/contact')}>
              Explore Services <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/properties')}>
              View Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
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

      {/* ── Two Focus Areas ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5">
              <Layers className="w-3.5 h-3.5" />
              A Technology Company With Two Focus Areas
            </div>
            <h2 className="text-3xl font-bold mb-3">What ShieldNet Does</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ShieldNet operates in two powerful directions — serving clients and building our own innovation.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Focus 1: Client Solutions */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Focus Area 1</p>
                  <h3 className="font-bold text-lg leading-tight">Custom Technology Solutions</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                We design and build digital systems for businesses, startups, and organizations.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Website development',
                  'Mobile applications',
                  'Enterprise software systems',
                  'Database & backend infrastructure',
                  'AI integration for business automation',
                  'UI/UX design & branding systems',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/60 italic border-t border-border pt-4">
                We don't just build products — we build working digital ecosystems that solve real problems.
              </p>
            </div>

            {/* Focus 2: Shield Products */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Focus Area 2</p>
                  <h3 className="font-bold text-lg leading-tight">ShieldNet Products</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                We build and operate AI-powered platforms under the Shield brand to solve national problems at scale.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'ShieldNet AI — core intelligence engine',
                  'ShieldHome — real estate fraud protection',
                  'ShieldFarm — smart agriculture assistant',
                  'ShieldHer — personal safety system for women',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" onClick={() => navigate('/ai-tools')}>
                Explore ShieldNet AI <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Unified AI Platform ── */}
      <section className="py-14 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-5">
            <Cpu className="w-3.5 h-3.5" />
            Unified AI Platform
          </div>
          <h2 className="text-2xl font-bold mb-3">ShieldNet AI — The Core Intelligence Layer</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            Our AI system powers both client solutions and internal Shield products — delivering intelligence where it matters most.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              { label: 'Fraud Detection',        desc: 'Real-time scanning of listings, identities, and transactions.' },
              { label: 'Identity Verification',  desc: 'Automated document and person verification at scale.' },
              { label: 'Risk Scoring',           desc: 'AI-generated trust scores for properties, farms, and users.' },
              { label: 'Real-time Intelligence', desc: 'Live data feeds, alerts, and situational awareness.' },
              { label: 'Predictive Analytics',   desc: 'Forecast crop disease, fraud patterns, and market trends.' },
              { label: 'AI Integration API',     desc: 'Plug ShieldNet AI directly into your own business systems.' },
            ].map(f => (
              <div key={f.label} className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-sm font-semibold mb-1 text-purple-300">{f.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Four Shields ── */}
      <section id="products" className="py-20 bg-purple-500/10 border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Four Shields of Protection</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our in-house platforms built for public protection — all powered by ShieldNet AI.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHIELD_PRODUCTS.map(s => (
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
        </div>
      </section>

      {/* ── Our Services ── */}
      <section id="what-we-do" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">We Also Build For Businesses & Organizations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ShieldNet provides end-to-end technology services for every stage of your digital journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CLIENT_SERVICES.map(s => (
              <div key={s.title} className={`p-6 rounded-2xl border ${s.border} ${s.bg} flex flex-col gap-3`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Work ── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">From Idea to Deployment in 4 Steps</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A clear, structured process that takes your vision from concept to a live, working system.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_WE_WORK.map(s => (
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

      {/* ── Testimonials ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Real-World Results</h2>
          <p className="text-muted-foreground">Trusted by businesses, partners, and individuals across Nigeria.</p>
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

      {/* ── Why ShieldNet ── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">One Company. Multiple Capabilities.</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                From software development to AI innovation — ShieldNet delivers at every level of the technology stack.
              </p>
              <ul className="space-y-3">
                {[
                  'Full-stack software development company',
                  'AI product innovation lab',
                  'Enterprise system builders',
                  'Real-world problem solvers',
                  'Trusted infrastructure partner',
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
                { icon: Users,       label: 'Active Users',           value: '18,000+', color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
                { icon: ShieldCheck, label: 'Verified Listings',      value: '2,400+',  color: 'text-green-400',  bg: 'bg-green-500/10'  },
                { icon: Wheat,       label: 'Farms Monitored',        value: '1,200+',  color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { icon: BarChart3,   label: 'Protected Transactions', value: '₦120B+',  color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map(s => (
                <div key={s.label} className={`p-5 rounded-2xl ${s.bg} border border-border`}>
                  <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-gradient-to-b from-green-500/5 to-transparent border-t border-green-500/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShieldCheck className="w-14 h-14 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Let's Build Something Powerful Together</h2>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            Whether you're a business, government, startup, or individual — we help you build, scale, and secure your digital systems.
          </p>
          <p className="text-sm text-muted-foreground/60 mb-8">
            From idea to infrastructure — we design, develop, and deploy systems that work.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/contact')}>
              Start a Project <ArrowRight className="ml-2 w-4 h-4" />
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
