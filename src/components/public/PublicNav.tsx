import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Shield, Heart, Home, Wheat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ShieldLogo } from '@/components/ui/ShieldLogo'

const PRODUCTS = [
  {
    to: '/ai-tools',
    label: 'ShieldNet AI',
    desc: 'Fraud detection & property verification',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    to: '/shieldher',
    label: 'ShieldHer',
    desc: "Women's safety & empowerment platform",
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    to: '/properties',
    label: 'ShieldHome',
    desc: 'Verified real estate listings across Nigeria',
    icon: Home,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    to: '/farms',
    label: 'ShieldFarm',
    desc: 'AI-powered crop diagnosis & market prices',
    icon: Wheat,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
]

const NAV_BEFORE = [
  { to: '/',      label: 'Home',  end: true },
  { to: '/about', label: 'About'            },
]

const NAV_AFTER = [
  { to: '/contact', label: 'Contact' },
]

export function PublicNav() {
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProducts, setMobileProducts] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
          <ShieldLogo sizeClass="w-9 h-9" wrapperClassName="shadow" />
          <div className="hidden sm:block">
            <span className="text-sm font-bold leading-none block">ShieldNetCore</span>
            <span className="text-[10px] text-muted-foreground">Technologies</span>
          </div>
        </Link>

        {/* Desktop nav — absolutely centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {NAV_BEFORE.map(({ to, label, end }) => (
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

          {/* Products dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProductsOpen(v => !v)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                productsOpen ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              Products
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', productsOpen && 'rotate-180')} />
            </button>

            {productsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl shadow-black/20 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                {PRODUCTS.map(({ to, label, desc, icon: Icon, color, bg }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setProductsOpen(false)}
                    className={({ isActive }) =>
                      cn('flex items-center gap-3 p-3 rounded-lg transition-colors group',
                        isActive ? 'bg-green-500/10' : 'hover:bg-accent')
                    }
                  >
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', bg)}>
                      <Icon className={cn('w-5 h-5', color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{desc}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {NAV_AFTER.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-1">
          {NAV_BEFORE.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Mobile Products accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileProducts(v => !v)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Products
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', mobileProducts && 'rotate-180')} />
            </button>
            {mobileProducts && (
              <div className="mt-1 ml-3 space-y-0.5 border-l border-border pl-3">
                {PRODUCTS.map(({ to, label, desc, icon: Icon, color, bg }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => { setMobileOpen(false); setMobileProducts(false) }}
                    className={({ isActive }) =>
                      cn('flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive ? 'bg-green-500/10' : 'hover:bg-accent')
                    }
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bg)}>
                      <Icon className={cn('w-4 h-4', color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {NAV_AFTER.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-green-400 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
              }
            >
              {label}
            </NavLink>
          ))}

        </div>
      )}
    </header>
  )
}
