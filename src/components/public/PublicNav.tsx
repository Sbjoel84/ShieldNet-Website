import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  { to: '/',            label: 'Home',       end: true },
  { to: '/properties',  label: 'ShieldHome'  },
  { to: '/farms',       label: 'ShieldFarm'  },
  { to: '/ai-tools',    label: 'AI Tools'    },
  { to: '/about',       label: 'About'       },
  { to: '/contact',     label: 'Contact'     },
]

export function PublicNav() {
  const [open, setOpen] = useState(false)
  const { profile } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <div className="rounded-xl overflow-hidden ring-1 ring-green-500/30 shadow">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-9 h-9 object-contain bg-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold leading-none block">ShieldNet</span>
            <span className="text-[10px] text-muted-foreground">Core Technologies</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {profile ? (
            <Button variant="shield" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button variant="shield" size="sm" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </>
          )}
          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn('flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-border flex gap-2">
            {profile ? (
              <Button variant="shield" className="flex-1" onClick={() => { navigate('/dashboard'); setOpen(false) }}>Dashboard</Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1" onClick={() => { navigate('/auth'); setOpen(false) }}>Sign In</Button>
                <Button variant="shield" className="flex-1" onClick={() => { navigate('/auth'); setOpen(false) }}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
