import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Menu, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':            'Overview',
  '/dashboard/farms':      'ShieldFarm',
  '/dashboard/properties': 'ShieldHome',
  '/dashboard/ai-tools':   'ShieldNet AI Tools',
  '/dashboard/admin':      'Admin Queue',
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ha', label: 'Hausa' },
  { value: 'yo', label: 'Yorùbá' },
  { value: 'ig', label: 'Igbo' },
]

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation()
  const [lang, setLang] = useState('en')
  const title = PAGE_TITLES[location.pathname] ?? 'ShieldNet'

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-base font-semibold leading-none">{title}</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
            ShieldNet Core Technologies · Nigeria
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="h-8 w-[100px] text-xs border-border bg-background gap-1">
            <Globe className="w-3 h-3 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(l => (
              <SelectItem key={l.value} value={l.value} className="text-xs">{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="w-4 h-4" />
          <Badge variant="destructive" className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[9px] flex items-center justify-center rounded-full border-0">
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}
