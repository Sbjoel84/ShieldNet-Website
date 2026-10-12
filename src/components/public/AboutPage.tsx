import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck, Target, Eye, Heart, Users, Wheat, Building2, Bot, Cpu, ArrowRight, Globe2, Database, Code2, Palette, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { PROJECTS, CLIENT_LOGOS } from '@/data/projects'

const TEAM = [
  {
    name: 'Raheem Victor',
    role: 'CEO & Co-Founder',
    img: '/raheem.jpg',
    bio: 'Visionary entrepreneur and technologist leading ShieldNet\'s mission to protect every Nigerian transaction through AI. Raheem drives the company\'s strategic vision and product direction.',
  },
  {
    name: 'Joel Yahaya',
    role: 'Chief Company Executive Officer (CCEO)',
    img: '/joel.png',
    bio: 'Leads ShieldNet\'s commercial strategy, investor relations, and growth across Nigeria\'s real estate and agricultural sectors. Joel ensures every partnership delivers real value to users.',
  },
]

const VALUES = [
  { icon: ShieldCheck, title: 'Protection First', desc: 'Every feature we build starts with one question: does this make our users safer?' },
  { icon: Target,      title: 'Accuracy',         desc: 'We hold our AI to the highest standards — 90%+ accuracy, zero tolerance for false security.' },
  { icon: Eye,         title: 'Transparency',      desc: 'We show our work. Shield Scores, fraud reports, and verification steps are all visible to users.' },
  { icon: Heart,       title: 'Community',         desc: 'ShieldNet is built for Nigerian communities — our success is measured by theirs.' },
]

const MILESTONES = [
  { year: '2023', event: 'ShieldNet founded in Abuja by Raheem Victor and Joel Yahaya.' },
  { year: '2024', event: 'Launched ShieldHome with 200+ verified listings in Abuja — AI anti-fraud tool for property titles.' },
  { year: '2024', event: 'ShieldFarm beta launched — 500 farmers onboarded in first month.' },
  { year: '2025', event: 'Expanded to Lagos. 1,000+ ShieldHome listings and ₦50B+ in transactions protected.' },
  { year: '2025', event: 'AI Crop Diagnosis launched with 90%+ accuracy across 50+ crop types.' },
  { year: '2026', event: '18,000+ active users. ₦120B+ in protected transactions. Expanding to Port Harcourt.' },
]

export function AboutPage() {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const [highlighted, setHighlighted] = useState<string | null>(null)

  // Scroll to a project card when arriving from a client logo link (e.g. /about#project-bevick)
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    // Short delay lets images above the section load so the scroll target doesn't shift
    const scroll = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlighted(id)
    }, 150)
    const clear = setTimeout(() => setHighlighted(null), 2800)
    return () => { clearTimeout(scroll); clearTimeout(clear) }
  }, [hash])

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-green-500/10 to-transparent border-b border-border py-20">
        <div className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-green-500/15 blur-3xl blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl blob [animation-delay:-7s]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="hero-in mb-8">
            <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-green-500/30 shadow-2xl shadow-green-500/10 mx-auto float">
              <img src="/logo-alt.svg" alt="ShieldNet" className="w-full h-full object-contain bg-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 hero-in [animation-delay:150ms]">About <span className="text-shimmer">ShieldNet</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-4 hero-in [animation-delay:300ms]">
            ShieldNetCore Technologies (Abuja) is building a unified AI platform under the "Shield" brand — delivering real-time protection across multiple high-impact sectors while also providing modern digital solutions for businesses and individuals.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed mb-6 hero-in [animation-delay:450ms]">
            We don't just build AI systems — we build complete digital infrastructure: websites that scale, databases that perform, software that solves real problems, and branding that communicates trust.
          </p>
          <div className="inline-block text-sm text-muted-foreground/70 font-medium tracking-wide hero-in [animation-delay:600ms]">
            Professional Web Development &nbsp;|&nbsp; Database Systems &nbsp;|&nbsp; Software Solutions &nbsp;|&nbsp; Graphics Design
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Reveal variant="left" className="group">
            <Card className="h-full card-lift hover:border-green-500/40">
              <CardContent className="p-8">
                <span className="reveal-icon block w-fit mb-4"><Target className="w-8 h-8 text-green-400 hover-wiggle" /></span>
                <h2 className="text-xl font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To eliminate fraud in Nigerian real estate and agriculture by deploying AI-powered verification, transparency tools, and community trust systems — protecting millions of Nigerians from financial loss.
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal variant="right" delay={150} className="group">
            <Card className="h-full card-lift hover:border-blue-500/40">
              <CardContent className="p-8">
                <span className="reveal-icon block w-fit mb-4"><Eye className="w-8 h-8 text-blue-400 hover-wiggle" /></span>
                <h2 className="text-xl font-bold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Nigeria where every land buyer, property investor, and farmer transacts with full confidence — because ShieldNet has verified every deed, diagnosed every crop, and scored every participant for trust.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </section>

        {/* Platform products */}
        <section>
          <Reveal className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4 shield-glow">
              <Cpu className="w-3.5 h-3.5 reveal-icon" />
              Our Core Engine
            </div>
            <h2 className="text-2xl font-bold mb-3">The Shield Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ShieldNet AI is the intelligence backbone that powers four vertical products — each purpose-built to protect Nigerians in the areas that matter most.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                logo: '/shieldnet-ai-logo.jpg',
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                title: 'ShieldNet AI',
                badge: 'Core Engine',
                desc: 'Real-time safety & threat detection backbone powering all Shield products — fraud scoring, identity verification, and risk intelligence.',
                to: '/ai-tools',
              },
              {
                logo: '/ShieldHer.png',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                title: 'ShieldHer',
                badge: 'Live',
                desc: 'Personal protection app for women — real-time threat alerts, emergency SOS, safe-route navigation, and community safety reporting.',
                to: '/shieldher',
              },
              {
                logo: '/ShieldFarm.png',
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
                title: 'ShieldFarm',
                badge: 'Live',
                desc: 'AI-powered app for smallholder farmers — on-device pest & disease detection, real-time market prices, weather, and farm diary. Offline-first.',
                to: '/farms',
              },
              {
                logo: '/ShieldHome.png',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                title: 'ShieldHome',
                badge: 'Live',
                desc: 'AI anti-fraud tool for property titles & listings — every listing is scanned, scored, and Shield Verified before you buy, rent, or invest.',
                to: '/properties',
              },
            ].map((p, i) => (
              <Reveal key={p.title} variant="flip" delay={i * 150} duration={900} className={`group p-5 rounded-2xl border ${p.border} ${p.bg} flex flex-col gap-3 card-lift`}>
                <div className="flex items-start justify-between">
                  {p.logo && <img src={p.logo} alt={p.title} className="w-7 h-7 rounded-lg object-cover reveal-icon" />}
                  <Badge className={`text-[10px] ${p.badge === 'Coming Soon' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : p.badge === 'Core Engine' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                    {p.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                {p.to && (
                  <a href={p.to} className={`text-sm font-medium ${p.color} flex items-center gap-1 hover:gap-2 transition-all`}>
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        </section>

        {/* What We Build */}
        <section>
          <Reveal className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Complete Digital Infrastructure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We don't just build AI systems — we build everything a modern business needs to operate, grow, and compete.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: Globe2,    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   title: 'Web Development',        desc: 'Modern, responsive, business-ready websites built to scale.' },
              { icon: Database,  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  title: 'Database Systems',       desc: 'Secure, scalable data architecture and management.' },
              { icon: Code2,     color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Custom Software',        desc: 'Tailored applications for business operations and automation.' },
              { icon: Palette,   color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   title: 'Graphics & Brand Design',desc: 'Visual identity systems that build trust and communicate value.' },
              { icon: Bot,       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'AI-Powered Platforms',   desc: 'Intelligent systems for real-time decision making and protection.' },
            ].map((s, i) => (
              <Reveal key={s.title} variant="up" delay={i * 120} className={`group p-5 rounded-2xl border ${s.border} ${s.bg} flex flex-col gap-3 card-lift`}>
                <span className="reveal-icon w-fit"><s.icon className={`w-7 h-7 ${s.color} hover-wiggle`} /></span>
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projects / Clients */}
        <section id="projects">
          <Reveal className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
              <Briefcase className="w-3.5 h-3.5 reveal-icon" />
              Our Work
            </div>
            <h2 className="text-2xl font-bold mb-3">Projects We've Delivered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Beyond the Shield platform, we build software that runs real businesses. Here are some of the organisations we've partnered with so far.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} variant="up" delay={i * 120}>
              <div
                id={`project-${p.slug}`}
                className={`group h-full scroll-mt-24 rounded-2xl border bg-card overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-green-500/10 ${highlighted === `project-${p.slug}` ? 'border-green-500 ring-4 ring-green-500/30 scale-[1.02]' : 'border-border hover:border-green-500/40'}`}
              >
                <div className="h-32 bg-white flex items-center justify-center p-4 overflow-hidden">
                  {p.logo ? (
                    <img src={p.logo} alt={`${p.name} logo`} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-3xl font-bold text-green-600 tracking-tight">
                      {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <Badge className="w-fit text-[10px] bg-green-500/20 text-green-300 border-green-500/30">{p.category}</Badge>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Reveal as="p" variant="fade" className="text-center text-xs uppercase tracking-widest text-muted-foreground/70 mb-5">Trusted by</Reveal>
            <div className="flex flex-wrap justify-center gap-4">
              {CLIENT_LOGOS.map((c, i) => (
                <Reveal key={c.name} variant="zoom" delay={i * 100}>
                  <Link to={c.href} title={c.name} className="w-40 h-20 rounded-xl bg-white border border-border flex items-center justify-center p-3 hover:border-green-500 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                    <img src={c.src} alt={`${c.name} logo`} className="max-h-full max-w-full object-contain" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: Building2, value: '2,400+', label: 'Verified Properties', color: 'text-blue-400' },
            { icon: Wheat,     value: '1,200+', label: 'Farmers Supported',  color: 'text-green-400' },
            { icon: Users,     value: '18,000+',label: 'Active Users',       color: 'text-purple-400' },
            { icon: Bot,       value: '₦120B+', label: 'Transactions Safe',  color: 'text-yellow-400' },
          ].map((s, i) => (
            <Reveal key={s.label} variant="zoom" delay={i * 120} className="group">
              <Card className="h-full card-lift">
                <CardContent className="p-6">
                  <span className="reveal-icon block w-fit mx-auto mb-3"><s.icon className={`w-6 h-6 ${s.color} hover-wiggle`} /></span>
                  <CountUp value={s.value} className={`block text-3xl font-bold ${s.color}`} />
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </section>

        {/* Values */}
        <section>
          <Reveal as="h2" className="text-2xl font-bold mb-8 text-center">Our Values</Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} variant="up" delay={i * 130} className="group p-6 rounded-2xl bg-card border border-border card-lift hover:border-green-500/40">
                <span className="reveal-icon block w-fit mb-4"><v.icon className="w-7 h-7 text-green-400 hover-wiggle" /></span>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team">
          <Reveal as="h2" className="text-2xl font-bold mb-10 text-center">Leadership Team</Reveal>
          <div className="flex flex-wrap justify-center gap-10">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} variant={i % 2 === 0 ? 'left' : 'right'} delay={i * 150} className="group flex flex-col items-center text-center max-w-sm">
                <div className="w-44 h-44 rounded-3xl overflow-hidden ring-4 ring-green-500/20 mb-5 group-hover:ring-green-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-green-500/20">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="font-bold text-xl mb-1">{m.name}</h3>
                <p className="text-sm text-green-400 mb-3">{m.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <Reveal as="h2" className="text-2xl font-bold mb-8 text-center">Our Journey</Reveal>
          <Reveal variant="fade" duration={400} className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/60 via-border to-border grow-line" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <Reveal key={i} variant="left" delay={i * 100} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 z-10 reveal-icon">
                    <span className="text-xs font-bold text-green-400">{m.year}</span>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm text-foreground/85 leading-relaxed">{m.event}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <Reveal as="section" variant="zoom" duration={1000} className="rounded-2xl bg-green-500/5 border border-green-500/20 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-lg mx-auto mb-6 float">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-full h-full object-contain bg-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Join the ShieldNet Community</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Whether you're a buyer, farmer, agent, or investor — ShieldNet protects your every move.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" onClick={() => navigate('/contact')}>Get Started Free</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>Contact Us</Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
