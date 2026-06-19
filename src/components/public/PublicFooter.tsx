import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-xl overflow-hidden ring-1 ring-green-500/30 shadow">
                <img src="/logo-alt.svg" alt="ShieldNet" className="w-10 h-10 object-contain bg-white" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">ShieldNetCore</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Technologies</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">
              ShieldNet builds the technology behind trusted businesses.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              From idea to infrastructure — we design, develop, and deploy systems that work.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook,  label: 'Facebook'  },
                { Icon: Twitter,   label: 'Twitter'   },
                { Icon: Linkedin,  label: 'LinkedIn'  },
                { Icon: Instagram, label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" title={label} aria-label={label} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/#what-we-do', label: 'Software Development' },
                { to: '/#what-we-do', label: 'Web & App Development' },
                { to: '/#what-we-do', label: 'AI Solutions' },
                { to: '/#what-we-do', label: 'Database Systems' },
                { to: '/#products',   label: 'ShieldNet Products' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-green-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about',          label: 'About Us' },
                { to: '/contact',        label: 'Contact' },
                { to: '/about#team',     label: 'Leadership' },
                { to: '/agent-register', label: 'Become an Agent' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-green-400 transition-colors">{label}</Link>
                </li>
              ))}
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-green-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>Abuja & Lagos, Nigeria</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a href="mailto:info@shieldnet.ng" className="block hover:text-green-400 transition-colors">info@shieldnet.ng</a>
                  <a href="mailto:shieldnetcore@gmail.com" className="block hover:text-green-400 transition-colors">shieldnetcore@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a href="tel:+2348033098318" className="block hover:text-green-400 transition-colors">+234 803 309 8318</a>
                  <a href="tel:+2347030751474" className="block hover:text-green-400 transition-colors">+234 703 075 1474</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ShieldNetCore Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Built by ShieldNet. Powered by AI.</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              Secured by ShieldNet AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
