import { NavLink, Link, useLocation } from 'react-router-dom'
import { Wheat, Building2, Bot, LayoutDashboard, ShieldCheck, ChevronLeft, ChevronRight, LogOut, Home, Globe, Phone, Info } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const NAV_ITEMS = [
  { to: '/dashboard',            label: 'Overview',            icon: LayoutDashboard, end: true },
  { to: '/dashboard/farms',      label: 'ShieldFarm',          icon: Wheat },
  { to: '/dashboard/properties', label: 'ShieldNet Properties', icon: Building2 },
  { to: '/dashboard/ai-tools',   label: 'ShieldNet AI',         icon: Bot },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { profile, role, signOut } = useAuth()
  const location = useLocation()

  const initials = profile?.full_name ? getInitials(profile.full_name) : 'SN'

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-3 py-4 border-b border-border', collapsed && 'justify-center px-2')}>
        <div className="flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-green-500/30 shadow-lg shadow-black/30">
          <img
            src="/logo-alt.svg"
            alt="ShieldNet"
            className={cn('object-contain bg-white transition-all', collapsed ? 'w-9 h-9' : 'w-10 h-10')}
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">ShieldNet</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Core Technologies</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-0'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

          {/* Admin link */}
        {role === 'admin' && (
          <NavLink
            to="/dashboard/admin"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-0'
              )
            }
            title={collapsed ? 'Admin' : undefined}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="flex items-center gap-2 flex-1 min-w-0">
                <span className="truncate">Admin Queue</span>
                <Badge variant="blue" className="text-[10px] px-1.5 py-0">3</Badge>
              </span>
            )}
          </NavLink>
        )}
        {/* Website links divider */}
        <div className={cn('pt-3 mt-2 border-t border-border', collapsed && 'px-0')}>
          {!collapsed && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-3 mb-1.5">Website</p>
          )}
          {[
            { to: '/',           label: 'Home',       icon: Home },
            { to: '/properties', label: 'ShieldHome', icon: Building2 },
            { to: '/farms',      label: 'ShieldFarm', icon: Wheat },
            { to: '/about',      label: 'About',      icon: Info },
            { to: '/contact',    label: 'Contact',    icon: Phone },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* User + collapse toggle */}
      <div className="border-t border-border p-3 space-y-2">
        {!collapsed && profile && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/50">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-green-900 text-green-300">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{profile.full_name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{profile.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={signOut} title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('w-full h-8', collapsed ? 'justify-center' : 'justify-end')}
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  )
}
