import { useNavigate } from 'react-router-dom'
import { Bot, Leaf, Building2, ShieldCheck, BarChart3, AlertTriangle, ArrowRight, Zap } from 'lucide-react'
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

export function PublicAITools() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 shadow-lg mx-auto mb-6">
            <img src="/shieldnet-ai-logo.jpg" alt="ShieldNet AI" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
            <Bot className="w-3.5 h-3.5" />
            AI-Powered Security Platform
          </div>
          <h1 className="text-4xl font-bold mb-4">ShieldNet AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Nigeria's most advanced AI security platform — delivering real-time threat intelligence, fraud detection, identity verification, and risk scoring for individuals and enterprises.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="shield" size="lg" className="h-12 px-8" onClick={() => navigate('/auth')}>
              Try AI Tools Free <ArrowRight className="ml-2 w-4 h-4" />
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
          <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Start Using ShieldNet AI Today</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            All AI tools are available free with your ShieldNet account. No API keys, no setup — just sign up and go.
          </p>
          <Button variant="shield" size="lg" onClick={() => navigate('/auth')}>
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}
