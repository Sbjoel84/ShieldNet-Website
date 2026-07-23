import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Target, Eye, Heart, Users, Wheat, Building2, Bot, Cpu, ArrowRight, Globe2, Database, Code2, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent border-b border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-green-500/30 shadow-2xl shadow-green-500/10 mx-auto mb-8">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-full h-full object-contain bg-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About ShieldNet</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-4">
            ShieldNetCore Technologies (Abuja) is building a unified AI platform under the "Shield" brand — delivering real-time protection across multiple high-impact sectors while also providing modern digital solutions for businesses and individuals.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed mb-6">
            We don't just build AI systems — we build complete digital infrastructure: websites that scale, databases that perform, software that solves real problems, and branding that communicates trust.
          </p>
          <div className="inline-block text-sm text-muted-foreground/70 font-medium tracking-wide">
            Professional Web Development &nbsp;|&nbsp; Database Systems &nbsp;|&nbsp; Software Solutions &nbsp;|&nbsp; Graphics Design
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <Target className="w-8 h-8 text-green-400 mb-4" />
              <h2 className="text-xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To eliminate fraud in Nigerian real estate and agriculture by deploying AI-powered verification, transparency tools, and community trust systems — protecting millions of Nigerians from financial loss.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <Eye className="w-8 h-8 text-blue-400 mb-4" />
              <h2 className="text-xl font-bold mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Nigeria where every land buyer, property investor, and farmer transacts with full confidence — because ShieldNet has verified every deed, diagnosed every crop, and scored every participant for trust.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Platform products */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
              <Cpu className="w-3.5 h-3.5" />
              Our Core Engine
            </div>
            <h2 className="text-2xl font-bold mb-3">The Shield Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ShieldNet AI is the intelligence backbone that powers four vertical products — each purpose-built to protect Nigerians in the areas that matter most.
            </p>
          </div>
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
            ].map(p => (
              <div key={p.title} className={`p-5 rounded-2xl border ${p.border} ${p.bg} flex flex-col gap-3`}>
                <div className="flex items-start justify-between">
                  {p.logo && <img src={p.logo} alt={p.title} className="w-7 h-7 rounded-lg object-cover" />}
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
              </div>
            ))}
          </div>
        </section>

        {/* What We Build */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Complete Digital Infrastructure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We don't just build AI systems — we build everything a modern business needs to operate, grow, and compete.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: Globe2,    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   title: 'Web Development',        desc: 'Modern, responsive, business-ready websites built to scale.' },
              { icon: Database,  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  title: 'Database Systems',       desc: 'Secure, scalable data architecture and management.' },
              { icon: Code2,     color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Custom Software',        desc: 'Tailored applications for business operations and automation.' },
              { icon: Palette,   color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   title: 'Graphics & Brand Design',desc: 'Visual identity systems that build trust and communicate value.' },
              { icon: Bot,       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'AI-Powered Platforms',   desc: 'Intelligent systems for real-time decision making and protection.' },
            ].map(s => (
              <div key={s.title} className={`p-5 rounded-2xl border ${s.border} ${s.bg} flex flex-col gap-3`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: Building2, value: '2,400+', label: 'Verified Properties', color: 'text-blue-400' },
            { icon: Wheat,     value: '1,200+', label: 'Farmers Supported',  color: 'text-green-400' },
            { icon: Users,     value: '18,000+',label: 'Active Users',       color: 'text-purple-400' },
            { icon: Bot,       value: '₦120B+', label: 'Transactions Safe',  color: 'text-yellow-400' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-6">
                <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-3`} />
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="p-6 rounded-2xl bg-card border border-border">
                <v.icon className="w-7 h-7 text-green-400 mb-4" />
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team">
          <h2 className="text-2xl font-bold mb-10 text-center">Leadership Team</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {TEAM.map(m => (
              <div key={m.name} className="flex flex-col items-center text-center max-w-sm">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-green-500/20 mb-5">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl mb-1">{m.name}</h3>
                <p className="text-sm text-green-400 mb-3">{m.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 z-10">
                    <span className="text-xs font-bold text-green-400">{m.year}</span>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm text-foreground/85 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-green-500/5 border border-green-500/20 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-lg mx-auto mb-6">
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
        </section>
      </div>
    </div>
  )
}
