import { Bot, Shield, FileSearch, BarChart3, Zap, ArrowRight, Sparkles, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AI_TOOLS = [
  {
    id: 'pest-diagnosis',
    icon: Bot,
    label: 'Crop Pest & Disease Diagnosis',
    desc: 'Upload a photo of your crop and our AI model identifies diseases, pests, and recommends treatment — in seconds.',
    badge: 'Live',
    badgeVariant: 'verified' as const,
    action: '/dashboard/farms',
    actionLabel: 'Open ShieldFarm',
    gradient: 'from-green-600/20 to-green-800/5',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
  },
  {
    id: 'fraud-detect',
    icon: Shield,
    label: 'Shield Score & Fraud Detection',
    desc: 'Every agent, property, and transaction is scored by our anti-fraud engine. Red flags are surfaced to admins automatically.',
    badge: 'Live',
    badgeVariant: 'verified' as const,
    action: '/dashboard/properties',
    actionLabel: 'View Properties',
    gradient: 'from-blue-600/20 to-blue-800/5',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    id: 'doc-verify',
    icon: FileSearch,
    label: 'Document Verification AI',
    desc: 'Upload land title documents (C of O, Survey, Deed) for AI-assisted authenticity checks against known fraud patterns.',
    badge: 'Beta',
    badgeVariant: 'pending' as const,
    action: null,
    actionLabel: 'Coming Soon',
    gradient: 'from-purple-600/20 to-purple-800/5',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
  {
    id: 'market-intel',
    icon: BarChart3,
    label: 'Market Intelligence',
    desc: 'Real-time crop prices, property market trends, and demand signals across Abuja and Lagos — powered by live data feeds.',
    badge: 'Live',
    badgeVariant: 'verified' as const,
    action: '/dashboard/farms',
    actionLabel: 'View Market Prices',
    gradient: 'from-cyan-600/20 to-cyan-800/5',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
  {
    id: 'valuation',
    icon: Zap,
    label: 'AI Property Valuation',
    desc: 'Instant automated valuation (AVM) for Nigerian properties using comparable sales data and location analytics.',
    badge: 'Soon',
    badgeVariant: 'outline' as const,
    action: null,
    actionLabel: 'Coming Soon',
    gradient: 'from-orange-600/20 to-orange-800/5',
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
  },
  {
    id: 'agent-intel',
    icon: Sparkles,
    label: 'Agent Intelligence Report',
    desc: 'Deep profile analysis for registered agents — transaction history, fraud incidents, peer ratings and trust score evolution.',
    badge: 'Soon',
    badgeVariant: 'outline' as const,
    action: null,
    actionLabel: 'Coming Soon',
    gradient: 'from-pink-600/20 to-pink-800/5',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10',
  },
]

export function AITools() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold">ShieldNet AI Tools</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          AI-powered capabilities purpose-built for Nigeria's property and agricultural markets. Reducing fraud, increasing trust, empowering farmers and agents.
        </p>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AI_TOOLS.map(tool => (
          <Card
            key={tool.id}
            className={`relative overflow-hidden bg-gradient-to-br ${tool.gradient} border-border hover:border-border/80 transition-all hover:shadow-lg hover:shadow-black/20 group`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center`}>
                  <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <Badge variant={tool.badgeVariant} className="text-[10px]">{tool.badge}</Badge>
              </div>
              <CardTitle className="text-sm leading-snug">{tool.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
              {tool.action ? (
                <Button
                  variant="shield-outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate(tool.action!)}
                >
                  {tool.actionLabel} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full text-xs opacity-50 cursor-not-allowed" disabled>
                  <Lock className="w-3.5 h-3.5 mr-1.5" />{tool.actionLabel}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust section */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold mb-1">How Shield Score Works</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Every agent and property on ShieldNet receives a <strong className="text-foreground">Shield Score</strong> (0–100) computed from document verification, fraud report history, peer reviews, and transaction patterns.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { range: '80–100', label: 'Trusted', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                  { range: '60–79',  label: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                  { range: '0–59',   label: 'Caution', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                ].map(s => (
                  <div key={s.range} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${s.color}`}>
                    <span className="font-bold">{s.range}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration CTA */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-5 flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold mb-1">ShieldNet AI API — Coming Q3 2026</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Integrate ShieldNet's fraud detection, crop diagnosis, and Shield Score APIs directly into your app. Built for fintechs, banks, co-operatives, and agri-businesses across Nigeria.
            </p>
          </div>
          <Button variant="shield-blue" size="sm" className="shrink-0 text-xs">
            Join Waitlist
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
