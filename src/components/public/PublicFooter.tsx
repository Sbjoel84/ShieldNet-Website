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
                <p className="text-sm font-bold leading-none">ShieldNet</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Core Technologies</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Nigeria's trusted AI-powered platform for real estate, agriculture, and security intelligence.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-colors">
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
                { to: '/ai-tools',   label: 'ShieldNet AI' },
                { to: '/farms',      label: 'ShieldFarm' },
                { to: '/properties', label: 'ShieldNet Properties' },
              ].map(({ to, label }) => (
                <li key={to}>
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
                { to: '/about',   label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/about#team', label: 'Leadership' },
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
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <a href="mailto:info@shieldnet.ng" className="hover:text-green-400 transition-colors">info@shieldnet.ng</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-green-400 transition-colors">+234 800 000 0000</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ShieldNet Core Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            Secured by ShieldNet AI
          </div>
        </div>
      </div>
    </footer>
  )
}
